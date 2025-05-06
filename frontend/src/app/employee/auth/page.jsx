"use client";
import React, { useState, useRef, useEffect } from 'react';
import * as faceapi from 'face-api.js';
import styles from './Authentication.module.css';

const Authentication = () => {
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [authStatus, setAuthStatus] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const videoRef = useRef();
  const canvasRef = useRef();

  useEffect(() => {
    const loadModels = async () => {
      try {
        setErrorMessage('');
        const MODEL_URL = '/models';
        
        // Load the required face-api models
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
          faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
        ]);
        
        setIsModelLoaded(true);
        console.log('Face recognition models loaded successfully');
      } catch (error) {
        console.error('Error loading models:', error);
        setErrorMessage('Failed to load face recognition models. Please refresh and try again.');
      }
    };

    loadModels();
  }, []);

  useEffect(() => {
    if (isModelLoaded) {
      startVideo();
    }
    
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, [isModelLoaded]);

  const startVideo = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Error accessing webcam:', error);
      setErrorMessage('Unable to access your camera. Please check permissions and try again.');
    }
  };

  const handleAuthenticate = async () => {
    if (!isModelLoaded || isProcessing) return;
    
    setIsProcessing(true);
    setAuthStatus('Authenticating...');
    
    try {
      // Take snapshot from video stream
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const displaySize = { width: video.width, height: video.height };
      faceapi.matchDimensions(canvas, displaySize);
      
      // Detect face in the current video frame
      const detections = await faceapi.detectSingleFace(
        video, 
        new faceapi.TinyFaceDetectorOptions()
      ).withFaceLandmarks().withFaceDescriptor();
      
      if (!detections) {
        setAuthStatus('No face detected. Please face the camera directly.');
        setIsProcessing(false);
        return;
      }

      // Draw detections on the canvas
      const resizedDetections = faceapi.resizeResults(detections, displaySize);
      canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
      faceapi.draw.drawDetections(canvas, resizedDetections);
      faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
      
      // Simulate API call to verify employee
      // In a real application, you would send the face descriptor to your backend
      setTimeout(() => {
        // Simulating successful authentication
        setAuthStatus('Authentication successful');
        
        // Redirect or perform further actions after successful auth
        // window.location.href = '/employee/dashboard';
        
        setIsProcessing(false);
      }, 2000);
      
    } catch (error) {
      console.error('Authentication error:', error);
      setAuthStatus('Authentication failed');
      setErrorMessage('An error occurred during authentication. Please try again.');
      setIsProcessing(false);
    }
  };

  return (
    <div className={styles.authContainer}>
      <h1 className={styles.title}>Employee Face Authentication</h1>
      
      {errorMessage && (
        <div className={styles.errorMessage}>{errorMessage}</div>
      )}
      
      <div className={styles.videoContainer}>
        <video 
          ref={videoRef} 
          width="640" 
          height="480" 
          autoPlay 
          muted
          className={styles.video}
          onPlay={() => {
            // Clear the canvas when video starts/restarts
            if (canvasRef.current) {
              const ctx = canvasRef.current.getContext('2d');
              ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
            }
          }}
        />
        <canvas ref={canvasRef} className={styles.canvas} />
      </div>
      
      <div className={styles.controls}>
        <button 
          onClick={handleAuthenticate}
          disabled={!isModelLoaded || isProcessing}
          className={styles.authButton}
        >
          {isProcessing ? 'Processing...' : 'Authenticate'}
        </button>
        
        {authStatus && (
          <div className={`${styles.authStatus} ${authStatus.includes('successful') ? styles.success : ''}`}>
            {authStatus}
          </div>
        )}
      </div>
      
      {!isModelLoaded && (
        <div className={styles.loadingMessage}>
          Loading face recognition models...
        </div>
      )}
    </div>
  );
};

export default Authentication;