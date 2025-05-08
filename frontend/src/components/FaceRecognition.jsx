'use client';
import { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';

export default function FaceRecognition({ onFaceDetected, isProcessing = false, isActive = true }) {
  const videoRef = useRef();
  const canvasRef = useRef();
  const streamRef = useRef(null);
  const [initializing, setInitializing] = useState(true);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [message, setMessage] = useState('Loading face recognition models...');
  const [faceDetected, setFaceDetected] = useState(false);
  const [intervalId, setIntervalId] = useState(null);
  const lastDetectionTime = useRef(0);
  const detectionCooldown = 1500; // 1.5 seconds between detections
  
  // Load face-api models once when component mounts
  useEffect(() => {
    let isMounted = true;
    
    const loadModels = async () => {
      try {
        setInitializing(true);
        setMessage('Loading face recognition models...');
        
        // Make sure models directory exists and is accessible
        const MODEL_URL = '/models';
        
        // Load models sequentially with proper error handling
        // We're only going to load the models we need and have available
        await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
        console.log('TinyFaceDetector model loaded');
        
        await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
        console.log('FaceLandmark68Net model loaded');
        
        await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
        console.log('FaceRecognitionNet model loaded');
        
        // Skip loading TinyYolov2 since it's not available
        // Instead, we'll use the TinyFaceDetector model for detection
        
        // Only update state if component is still mounted
        if (isMounted) {
          setModelsLoaded(true);
          setInitializing(false);
          setMessage('Models loaded. Please position your face in the frame.');
          console.log('All required face models loaded successfully');
        }
      } catch (error) {
        console.error('Error loading face models:', error);
        if (isMounted) {
          setMessage(`Error loading models: ${error.message}. Please refresh the page.`);
        }
      }
    };
    
    loadModels();
    
    // Cleanup function to prevent state updates on unmounted component
    return () => {
      isMounted = false;
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, []);
  
  // Control camera based on isActive prop and models loaded state
  useEffect(() => {
    console.log("Camera active state changed:", isActive, "Models loaded:", modelsLoaded);
    
    if (isActive && modelsLoaded) {
      startVideo();
    } else {
      stopVideo();
    }
    
    return () => {
      stopVideo();
    };
  }, [isActive, modelsLoaded]);
  
  // Start video stream
  const startVideo = () => {
    if (streamRef.current || initializing) return; // Already started or still loading models
    
    console.log("Starting video stream");
    navigator.mediaDevices.getUserMedia({ 
      video: {
        width: { ideal: 640 },
        height: { ideal: 480 },
        facingMode: "user" // Use front camera on mobile devices
      } 
    })
    .then(stream => {
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        console.log("Video stream started");
      }
    })
    .catch(err => {
      console.error('Camera error:', err);
      setMessage('Camera access error. Please check permissions and try again.');
    });
  };
  
  // Stop video stream
  const stopVideo = () => {
    console.log("Stopping video stream");
    
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
    
    if (streamRef.current) {
      const tracks = streamRef.current.getTracks();
      tracks.forEach(track => {
        track.stop();
        console.log("Track stopped:", track.kind);
      });
      streamRef.current = null;
      
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      
      if (canvasRef.current) {
        const ctx = canvasRef.current.getContext('2d');
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
      
      setFaceDetected(false);
      setMessage('Camera turned off');
    }
  };

  const handleVideoPlay = () => {
    if (intervalId || initializing || !videoRef.current || !modelsLoaded) {
      console.log("Not setting up detection - conditions not met:", 
        { hasIntervalId: !!intervalId, isInitializing: initializing, hasVideo: !!videoRef.current, modelsLoaded });
      return;
    }
    
    console.log("Video playing, setting up detection interval");
    const newIntervalId = setInterval(async () => {
      if (!videoRef.current || !canvasRef.current || !streamRef.current || initializing || !modelsLoaded) return;
      if (isProcessing) return; // Skip detection if we're already processing
      
      // Check if we're in cooldown period
      const now = Date.now();
      if (now - lastDetectionTime.current < detectionCooldown) {
        return;
      }
      
      try {
        // Use TinyFaceDetector instead of SsdMobilenetv1 or TinyYolov2
        const options = new faceapi.TinyFaceDetectorOptions({ 
          inputSize: 416,  // Recommended for TinyFaceDetector
          scoreThreshold: 0.5 // Adjust threshold as needed
        });
        
        const detections = await faceapi
          .detectAllFaces(videoRef.current, options)
          .withFaceLandmarks()
          .withFaceDescriptors();
        
        // Clear the canvas first
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        context.clearRect(0, 0, canvas.width, canvas.height);
        
        if (detections.length > 0) {
          setFaceDetected(true);
          
          faceapi.matchDimensions(canvas, {
            width: videoRef.current.width,
            height: videoRef.current.height
          });
          
          const resizedDetections = faceapi.resizeResults(detections, {
            width: videoRef.current.width,
            height: videoRef.current.height
          });
          
          // Draw face detections
          faceapi.draw.drawDetections(canvas, resizedDetections);
          faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
          
          if (onFaceDetected && !isProcessing) {
            setMessage('Face detected! Processing...');
            lastDetectionTime.current = now; // Update cooldown timestamp
            onFaceDetected(detections[0].descriptor);
          }
        } else {
          setFaceDetected(false);
          setMessage('No face detected. Please position your face in the frame.');
        }
      } catch (error) {
        console.error('Face detection error:', error);
        setMessage(`Error processing face: ${error.message}. Please try again.`);
      }
    }, 500);
    
    setIntervalId(newIntervalId);
  };

  return (
    <div className="relative w-full max-w-lg mx-auto">
      {isActive ? (
        initializing || !modelsLoaded ? (
          <div className="rounded-lg bg-gray-100 w-full h-[300px] flex flex-col items-center justify-center p-4">
            <div className="w-10 h-10 border-4 border-t-blue-600 border-blue-200 rounded-full animate-spin mb-4"></div>
            <p className="text-gray-700 text-center">{message}</p>
          </div>
        ) : (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              width={640}
              height={480}
              onPlay={handleVideoPlay}
              className="rounded-lg w-full"
            />
            <canvas
              ref={canvasRef}
              width={640}
              height={480}
              className="absolute top-0 left-0 w-full h-auto"
            />
            <p className={`mt-2 text-center ${faceDetected ? 'text-green-500' : 'text-red-500'}`}>
              {message}
            </p>
          </>
        )
      ) : (
        <div className="rounded-lg bg-gray-100 w-full h-[300px] flex items-center justify-center">
          <p className="text-gray-500">Camera is turned off</p>
        </div>
      )}
    </div>
  );
}