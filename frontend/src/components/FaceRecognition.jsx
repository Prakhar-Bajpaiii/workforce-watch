'use client';
import { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';

export default function FaceRecognition({ onFaceDetected, isProcessing = false, isActive = true }) {
  const videoRef = useRef();
  const canvasRef = useRef();
  const streamRef = useRef(null);
  const [initializing, setInitializing] = useState(false);
  const [message, setMessage] = useState('Loading models...');
  const [faceDetected, setFaceDetected] = useState(false);
  const [intervalId, setIntervalId] = useState(null);
  const lastDetectionTime = useRef(0);
  const detectionCooldown = 1500; // 1.5 seconds between detections
  
  // Control camera based on isActive prop
  useEffect(() => {
    console.log("Camera active state changed:", isActive);
    
    if (isActive) {
      startVideo();
    } else {
      stopVideo();
    }
    
    return () => {
      stopVideo();
    };
  }, [isActive]);
  
  // Start video stream
  const startVideo = () => {
    if (streamRef.current) return; // Already started
    
    console.log("Starting video stream");
    navigator.mediaDevices.getUserMedia({ video: true })
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
    if (intervalId || initializing || !videoRef.current) return;
    
    console.log("Video playing, setting up detection interval");
    const newIntervalId = setInterval(async () => {
      if (!videoRef.current || !canvasRef.current || !streamRef.current) return;
      if (isProcessing) return; // Skip detection if we're already processing
      
      // Check if we're in cooldown period
      const now = Date.now();
      if (now - lastDetectionTime.current < detectionCooldown) {
        return;
      }
      
      try {
        const detections = await faceapi
          .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
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
        setMessage('Error processing face. Please try again.');
      }
    }, 500);
    
    setIntervalId(newIntervalId);
  };

  return (
    <div className="relative w-full max-w-lg mx-auto">
      {isActive ? (
        <>
          <video
            ref={videoRef}
            autoPlay
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
      ) : (
        <div className="rounded-lg bg-gray-100 w-full h-[480px] flex items-center justify-center">
          <p className="text-gray-500">Camera is turned off</p>
        </div>
      )}
    </div>
  );
}