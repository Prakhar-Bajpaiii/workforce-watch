'use client';
import { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';

export default function FaceRecognition({ onFaceDetected, isProcessing = false, isActive = true, minConfidence = 0.6 }) {
  const videoRef = useRef();
  const canvasRef = useRef();
  const streamRef = useRef(null);
  const [initializing, setInitializing] = useState(true);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [message, setMessage] = useState('Loading face recognition models...');
  const [faceDetected, setFaceDetected] = useState(false);
  const [intervalId, setIntervalId] = useState(null);
  const lastDetectionTime = useRef(0);
  const detectionCooldown = 1000; // Reduced cooldown for more frequent checks
  const [confidenceLevel, setConfidenceLevel] = useState(0);
  const lastDescriptors = useRef([]);
  
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

  // Update the handleVideoPlay function with improved detection
  const handleVideoPlay = () => {
    if (intervalId || initializing || !videoRef.current || !modelsLoaded) {
      return;
    }
    
    console.log("Video playing, setting up detection interval");
    const newIntervalId = setInterval(async () => {
      // First ensure all refs are valid
      if (!videoRef.current || !canvasRef.current || !streamRef.current || initializing || !modelsLoaded) {
        return;
      }
      
      if (isProcessing) {
        return;
      }
      
      // Check if we're in cooldown period
      const now = Date.now();
      if (now - lastDetectionTime.current < detectionCooldown) {
        return;
      }
      
      try {
        // Use optimal detection parameters
        const options = new faceapi.TinyFaceDetectorOptions({ 
          inputSize: 512,  // Increased from 416 for better accuracy
          scoreThreshold: 0.4 // Lowered from 0.5 to detect more faces
        });
        
        const detections = await faceapi
          .detectAllFaces(videoRef.current, options)
          .withFaceLandmarks()
          .withFaceDescriptors();
        
        // Canvas checks and clearing (existing code)...
        
        if (detections.length > 0) {
          setFaceDetected(true);
          
          // Store multiple descriptors to improve accuracy
          const newDescriptor = detections[0].descriptor;
          
          // Keep only the last 5 descriptors
          if (lastDescriptors.current.length >= 5) {
            lastDescriptors.current.shift();
          }
          lastDescriptors.current.push(newDescriptor);
          
          // Draw face detection on canvas (existing code)...
          
          // Only trigger face detection when we have collected enough samples
          // and the face is sufficiently stable (confidence is high)
          if (lastDescriptors.current.length >= 3) {
            // Calculate average descriptor for better stability
            const averageDescriptor = calculateAverageDescriptor(lastDescriptors.current);
            
            // Calculate confidence level
            const stability = calculateStability(lastDescriptors.current);
            setConfidenceLevel(stability);
            
            // Only report face when stability is high enough
            if (stability > minConfidence && onFaceDetected && !isProcessing) {
              setMessage(`Face detected! Confidence: ${Math.round(stability * 100)}%`);
              lastDetectionTime.current = now;
              onFaceDetected(averageDescriptor);
            } else {
              setMessage(`Adjusting... Confidence: ${Math.round(stability * 100)}%`);
            }
          } else {
            setMessage(`Positioning face... ${lastDescriptors.current.length}/3 samples`);
          }
        } else {
          setFaceDetected(false);
          // Clear saved descriptors if face is lost
          if (lastDescriptors.current.length > 0) {
            lastDescriptors.current = [];
          }
          setMessage('No face detected. Please position your face in the frame.');
        }
      } catch (error) {
        console.error('Face detection error:', error);
        setMessage(`Error processing face: ${error.message}. Please try again.`);
      }
    }, 300); // Reduced interval for more responsive detection
    
    setIntervalId(newIntervalId);
  };
  
  // Calculate average descriptor from multiple samples
  const calculateAverageDescriptor = (descriptors) => {
    if (!descriptors || descriptors.length === 0) return null;
    
    // Initialize with zeros
    const length = descriptors[0].length;
    const avgDescriptor = new Float32Array(length);
    
    // Sum all descriptors
    for (const descriptor of descriptors) {
      for (let i = 0; i < length; i++) {
        avgDescriptor[i] += descriptor[i];
      }
    }
    
    // Divide by count
    for (let i = 0; i < length; i++) {
      avgDescriptor[i] /= descriptors.length;
    }
    
    return avgDescriptor;
  };
  
  // Calculate face detection stability based on descriptor similarity
  const calculateStability = (descriptors) => {
    if (descriptors.length < 2) return 0;
    
    let totalSimilarity = 0;
    let comparisons = 0;
    
    // Compare each descriptor with every other
    for (let i = 0; i < descriptors.length; i++) {
      for (let j = i + 1; j < descriptors.length; j++) {
        const similarity = 1 - faceapi.euclideanDistance(descriptors[i], descriptors[j]);
        totalSimilarity += similarity;
        comparisons++;
      }
    }
    
    return comparisons > 0 ? totalSimilarity / comparisons : 0;
  };

  // Render function with confidence indicator
  return (
    <div className="relative w-full max-w-lg mx-auto">
      {isActive ? (
        initializing || !modelsLoaded ? (
          <div className="rounded-lg bg-gray-100 w-full h-[300px] flex flex-col items-center justify-center p-4">
            <div className="w-10 h-10 border-4 border-t-blue-600 border-blue-200 rounded-full animate-spin mb-4"></div>
            <p className="text-gray-700 text-center">{message}</p>
          </div>
        ) : (
          <div className="relative">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              width={640}
              height={480}
              onLoadedMetadata={(e) => {
                if (canvasRef.current) {
                  canvasRef.current.width = e.target.videoWidth || 640;
                  canvasRef.current.height = e.target.videoHeight || 480;
                }
              }}
              onPlay={handleVideoPlay}
              className="rounded-lg w-full"
            />
            {videoRef.current && (
              <canvas
                ref={canvasRef}
                width={640}
                height={480}
                className="absolute top-0 left-0 w-full h-full"
              />
            )}
            <p className={`mt-2 text-center ${faceDetected ? 'text-green-500' : 'text-red-500'}`}>
              {message}
            </p>
            
            {/* Add confidence meter */}
            {faceDetected && (
              <div className="mt-2">
                <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${confidenceLevel > minConfidence ? 'bg-green-500' : 'bg-yellow-500'}`}
                    style={{ width: `${confidenceLevel * 100}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        )
      ) : (
        <div className="rounded-lg bg-gray-100 w-full h-[300px] flex items-center justify-center">
          <p className="text-gray-500">Camera is turned off</p>
        </div>
      )}
    </div>
  );
}