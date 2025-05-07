'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import FaceRecognition from '@/components/FaceRecognition';
import * as faceapi from 'face-api.js';

const SessionManager = () => {
  // Existing state
  const [sessions, setSessions] = useState([]);
  const [activeSession, setActiveSession] = useState(null);
  const [employee, setEmployee] = useState(null);
  const [userDescriptor, setUserDescriptor] = useState(null);
  const [faceMatched, setFaceMatched] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [modelsLoading, setModelsLoading] = useState(true);
  const [showFaceVerification, setShowFaceVerification] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [verificationMessage, setVerificationMessage] = useState(null);
  
  // New state for recordings
  const [isRecording, setIsRecording] = useState(false);
  const [recordingType, setRecordingType] = useState(null); // 'screen', 'audio', or 'both'
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordingInterval, setRecordingInterval] = useState(null);
  const [recordingBlobs, setRecordingBlobs] = useState([]);
  
  // Refs for media
  const videoRef = useRef();
  const canvasRef = useRef();
  const mediaRecorderRef = useRef(null);
  const screenStreamRef = useRef(null);
  const audioStreamRef = useRef(null);
  const combinedStreamRef = useRef(null);
  
  const token = typeof window !== 'undefined' ? localStorage.getItem('employee_token') : null;

  // Load face-api models
  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = '/models';
      setModelsLoading(true);
      try {
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
          faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
        ]);
        setModelsLoaded(true);
        console.log('Face recognition models loaded successfully');
      } catch (error) {
        console.error('Error loading face recognition models:', error);
        setVerificationMessage({
          type: 'error',
          text: 'Failed to load face recognition. Please refresh the page.'
        });
      } finally {
        setModelsLoading(false);
      }
    };
    
    loadModels();
  }, []);

  // Fetch employee details
  useEffect(() => {
    if (!token) return;
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/employee/profile`, {
      headers: { 'x-auth-token': token }
    })
      .then(res => {
        setEmployee(res.data);
        // Store face descriptor 
        if (res.data.faceDescriptor) {
          setUserDescriptor(res.data.faceDescriptor);
        }
      })
      .catch(() => setEmployee(null));
  }, [token]);

  // Fetch sessions
  useEffect(() => {
    if (!token) return;
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/session/my`, {
      headers: { 'x-auth-token': token }
    }).then(res => {
      setSessions(res.data);
      // Check if there's already an active session
      const active = res.data.find(s => !s.logoutTime);
      if (active) {
        setActiveSession(active);
      }
    });
  }, [token]);

  // Set up recording interval to track duration
  useEffect(() => {
    if (isRecording) {
      const interval = setInterval(() => {
        setRecordingTime(prevTime => prevTime + 1);
      }, 1000);
      setRecordingInterval(interval);
    } else {
      if (recordingInterval) {
        clearInterval(recordingInterval);
        setRecordingInterval(null);
        setRecordingTime(0);
      }
    }
    
    return () => {
      if (recordingInterval) {
        clearInterval(recordingInterval);
      }
    };
  }, [isRecording]);

  // Start screen and/or audio recording
  const startRecording = async (type = 'both') => {
    try {
      setRecordingType(type);
      const recordingOptions = { mimeType: 'video/webm;codecs=vp9,opus' };
      const recordedChunks = [];
      
      // Get screen or audio stream based on type
      let stream = null;
      
      if (type === 'screen' || type === 'both') {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: { 
            cursor: 'always',
            displaySurface: 'monitor',
            logicalSurface: true,
          },
          audio: type === 'both', // Only capture audio if type is 'both'
        });
        screenStreamRef.current = screenStream;
        
        // Add screen ended event listener
        screenStream.getVideoTracks()[0].addEventListener('ended', () => {
          stopRecording();
        });
        
        stream = screenStream;
      }
      
      if (type === 'audio' || (type === 'both' && !stream.getAudioTracks().length)) {
        // If we're doing both but screen didn't give us audio, get it separately
        const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        audioStreamRef.current = audioStream;
        
        if (type === 'both' && stream) {
          // Combine screen and audio streams
          const tracks = [...stream.getTracks(), ...audioStream.getAudioTracks()];
          combinedStreamRef.current = new MediaStream(tracks);
          stream = combinedStreamRef.current;
        } else {
          stream = audioStream;
        }
      }
      
      // Create media recorder
      const mediaRecorder = new MediaRecorder(stream, recordingOptions);
      
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          recordedChunks.push(e.data);
        }
      };
      
      mediaRecorder.onstop = async () => {
        setRecordingBlobs(recordedChunks);
        
        // Upload recording if we have an active session
        if (activeSession) {
          const recordingBlob = new Blob(recordedChunks, { type: 'video/webm' });
          await saveRecording(recordingBlob, type);
        }
        
        // Clean up streams
        if (screenStreamRef.current) {
          screenStreamRef.current.getTracks().forEach(track => track.stop());
          screenStreamRef.current = null;
        }
        
        if (audioStreamRef.current) {
          audioStreamRef.current.getTracks().forEach(track => track.stop());
          audioStreamRef.current = null;
        }
        
        if (combinedStreamRef.current) {
          combinedStreamRef.current.getTracks().forEach(track => track.stop());
          combinedStreamRef.current = null;
        }
      };
      
      // Start recording
      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start(1000); // Capture in 1 second chunks
      setIsRecording(true);
      toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} recording started`);
      
    } catch (error) {
      console.error('Error starting recording:', error);
      toast.error('Failed to start recording. Please check permissions.');
      stopRecording();
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      toast.success('Recording stopped');
    }
  };

  // Save recording to server
  const saveRecording = async (blob, type) => {
    try {
      // Create form data with recording
      const formData = new FormData();
      formData.append('recording', blob, `${type}_recording_${Date.now()}.webm`);
      formData.append('type', type);
      formData.append('sessionId', activeSession._id);
      
      // Upload to server
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/recording/upload`,
        formData,
        {
          headers: {
            'x-auth-token': token,
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      
      toast.success('Recording saved successfully');
      
      // Refresh sessions to get updated recording list
      fetchSessions();
      
    } catch (error) {
      console.error('Error saving recording:', error);
      toast.error('Failed to save recording');
    }
  };

  // Fetch sessions with a function we can call to refresh
  const fetchSessions = useCallback(() => {
    if (!token) return;
    
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/session/my`, {
      headers: { 'x-auth-token': token }
    }).then(res => {
      setSessions(res.data);
      console.log(res.data);
      
      // Check if there's already an active session
      const active = res.data.find(s => !s.logoutTime);
      if (active) {
        setActiveSession(active);
      } else {
        setActiveSession(null);
      }
    });
  }, [token]);

  // Update the existing useEffect to use fetchSessions
  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  // Start session after face verification
  const startSession = async () => {
    // Reset state
    setVerificationMessage(null);
    setPendingAction('start');
    setShowFaceVerification(true);
    setFaceMatched(false);
    setCameraActive(true);
  };

  // End session after face verification
  const endSession = async () => {
    // Reset state
    setVerificationMessage(null);
    setPendingAction('end');
    setShowFaceVerification(true);
    setFaceMatched(false);
    setCameraActive(true);
  };

  // Process the actual session start/end after successful face verification
  const handleVerificationSuccess = async () => {
    // First turn off camera
    setCameraActive(false);
    setShowFaceVerification(false);
    
    try {
      if (pendingAction === 'start') {
        const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/session/create`, {}, {
          headers: { 'x-auth-token': token }
        });
        setActiveSession(res.data);
        toast.success('Session started!');
        
        // Optional: Auto-start recording when session starts
        // startRecording('both');
      } else if (pendingAction === 'end' && activeSession) {
        // If recording, stop it before ending session
        if (isRecording) {
          stopRecording();
        }
        
        await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/session/update/${activeSession._id}`, {
          logoutTime: new Date()
        }, {
          headers: { 'x-auth-token': token }
        });
        setActiveSession(null);
        toast.success('Session ended!');
      }
    } catch (error) {
      toast.error(`Failed to ${pendingAction} session`);
      console.error(error);
    } finally {
      setPendingAction(null);
    }
  };

  // Handle face detection from FaceRecognition component
  const handleFaceDetected = async (descriptor) => {
    // Add these checks to prevent multiple calls
    if (faceMatched || isVerifying || !showFaceVerification) {
      return;
    }
    
    // Set verifying state immediately to prevent multiple calls
    setIsVerifying(true);
    
    try {
      await verifyFace(descriptor);
    } catch (error) {
      console.error("Error during face verification:", error);
    }
  };

  // Process face verification with backend
  const verifyFace = async (detectedDescriptor) => {
    if (!detectedDescriptor || !userDescriptor) {
      setIsVerifying(false);
      return false;
    }
    
    // Message already set by setIsVerifying(true) in handleFaceDetected
    setVerificationMessage({
      type: 'info',
      text: 'Verifying your face...'
    });
    
    try {
      // Server-side verification:
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/employee/verify-face`, {
        descriptor: detectedDescriptor
      }, {
        headers: { 'x-auth-token': token }
      });
      
      if (res.data.verified) {
        setVerificationMessage({
          type: 'success',
          text: 'Face verified successfully!'
        });
        setFaceMatched(true);
        
        // Short delay before proceeding to give user visual feedback
        setTimeout(() => {
          // Only proceed if we're still in verification mode
          if (showFaceVerification && pendingAction) {
            handleVerificationSuccess();
          }
        }, 1000);
        
        return true;
      } else {
        setVerificationMessage({
          type: 'error',
          text: 'Face verification failed. Please try again.'
        });
        
        setIsVerifying(false); // Allow retry
        return false;
      }
    } catch (error) {
      console.error('Face verification error:', error);
      setVerificationMessage({
        type: 'error',
        text: 'Error during face verification. Please try again.'
      });
      
      setIsVerifying(false); // Allow retry
      return false;
    }
  };

  // Cancel verification - stop camera when canceled
  const cancelVerification = () => {
    setCameraActive(false);
    setShowFaceVerification(false);
    setPendingAction(null);
    setVerificationMessage(null);
    toast.info('Action canceled');
  };

  // Get message styling based on type
  const getMessageStyle = (type) => {
    switch(type) {
      case 'error':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'success':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'info':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  // Format recording time display
  const formatRecordingTime = (seconds) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  // Add new recording controls to the UI
  const renderRecordingControls = () => {
    if (!activeSession) return null;
    
    return (
      <div className="mt-4 p-4 border rounded-lg bg-white">
        <h4 className="font-medium mb-3">Recording Controls</h4>
        
        {isRecording ? (
          <div>
            <div className="flex items-center mb-2">
              <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse mr-2"></div>
              <span>Recording {recordingType} - {formatRecordingTime(recordingTime)}</span>
            </div>
            <button 
              onClick={stopRecording}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10v4a1 1 0 001 1h4a1 1 0 001-1v-4a1 1 0 00-1-1h-4a1 1 0 00-1 1z" />
              </svg>
              Stop Recording
            </button>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            <button 
              onClick={() => startRecording('screen')}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Record Screen
            </button>
            
            <button 
              onClick={() => startRecording('audio')}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
              Record Audio
            </button>
            
            <button 
              onClick={() => startRecording('both')}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Record Screen & Audio
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Session Manager</h2>
      
      {showFaceVerification ? (
        <div className="mb-6 p-4 bg-gray-50 rounded shadow-lg">
          <h3 className="text-lg font-medium mb-3">
            Face Verification Required
          </h3>
          <p className="mb-4 text-gray-700">
            {pendingAction === 'start' 
              ? 'Please look at the camera to verify your identity before starting the session.' 
              : 'Please look at the camera to verify your identity before ending the session.'}
          </p>
          
          {/* Verification message */}
          {verificationMessage && (
            <div className={`p-3 mb-4 rounded border ${getMessageStyle(verificationMessage.type)}`}>
              {verificationMessage.text}
            </div>
          )}
          
          {modelsLoading ? (
            <div className="flex items-center justify-center p-8 bg-gray-100 rounded">
              <div className="flex items-center space-x-3">
                <svg className="animate-spin h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Loading face recognition models...</span>
              </div>
            </div>
          ) : (
            <div className="relative">
              {userDescriptor ? (
                <FaceRecognition
                  onFaceDetected={handleFaceDetected}
                  isProcessing={isVerifying}
                  isActive={cameraActive && modelsLoaded}
                />
              ) : (
                <div className="bg-yellow-100 p-4 rounded-lg mb-4">
                  <p className="text-yellow-700">
                    No face data found for your account. Please contact administrator.
                  </p>
                </div>
              )}
            </div>
          )}
          
          <div className="flex justify-between mt-4">
            <button
              onClick={cancelVerification}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Cancel
            </button>
            
            {verificationMessage?.type === 'error' && !modelsLoading && (
              <button
                onClick={() => {
                  setVerificationMessage(null);
                  // Re-activate camera if it was turned off
                  setCameraActive(true);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Try Again
              </button>
            )}
          </div>
        </div>
      ) : (
        <>
          {employee && (
            <div className="mb-6 p-4 bg-blue-50 rounded shadow">
              <div className="font-semibold text-blue-700 mb-1">Employee Details</div>
              <div><b>Name:</b> {employee.name}</div>
              <div><b>Email:</b> {employee.email}</div>
              <div><b>Designation:</b> {employee.designation}</div>
              <div><b>Team:</b> {employee.team}</div>
            </div>
          )}
          
          {!activeSession ? (
            <button 
              onClick={startSession} 
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center"
              disabled={!userDescriptor || modelsLoading}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Start Session
            </button>
          ) : (
            <button 
              onClick={endSession} 
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 flex items-center"
              disabled={modelsLoading}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              End Session
            </button>
          )}
          
          {/* Recording controls (new) */}
          {renderRecordingControls()}
          
          {!userDescriptor && (
            <div className="mt-4 bg-yellow-100 p-4 rounded-lg">
              <p className="text-yellow-800">
                <strong>Notice:</strong> Face recognition data is not set up for your account. 
                Please contact your administrator to register your face data.
              </p>
            </div>
          )}
        </>
      )}

      <h3 className="mt-8 mb-2 font-semibold">My Sessions</h3>
      {sessions.length === 0 ? (
        <p className="text-gray-500 italic">No sessions found</p>
      ) : (
        <ul className="space-y-4">
          {sessions.map(s => (
            <li key={s._id} className="p-4 border rounded-lg">
              {/* Basic session info */}
              <div className="flex justify-between">
                <div className="font-medium">
                  {new Date(s.date).toLocaleDateString()}
                </div>
                <div className={`px-2 py-1 rounded-full text-xs ${s.logoutTime ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                  {s.logoutTime ? 'Completed' : 'Active'}
                </div>
              </div>
              
              {/* Session details */}
              <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                <div><span className="text-gray-600">Login:</span> {new Date(s.loginTime).toLocaleTimeString()}</div>
                <div><span className="text-gray-600">Logout:</span> {s.logoutTime ? new Date(s.logoutTime).toLocaleTimeString() : 'Active'}</div>
                <div><span className="text-gray-600">Status:</span> {s.status}</div>
                <div><span className="text-gray-600">Duration:</span> {s.logoutTime 
                  ? calculateDuration(new Date(s.loginTime), new Date(s.logoutTime))
                  : calculateDuration(new Date(s.loginTime), new Date())}
                </div>
              </div>
              
              {/* Recordings section (expanded) */}
              <div className="mt-3">
                <div className="text-sm font-medium mb-1">Recordings</div>
                
                {/* Screen recordings */}
                <div className="mt-1">
                  <div className="text-xs text-gray-600 flex items-center mb-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Screen Recordings: {s.screenRecordings?.length || 0}
                  </div>
                  
                  {s.screenRecordings?.length > 0 && (
                    <div className="grid grid-cols-2 gap-2">
                      {s.screenRecordings.map((recording, idx) => (
                        <a 
                          key={`screen-${idx}`} 
                          href={recording.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-xs bg-blue-50 p-2 rounded flex items-center hover:bg-blue-100"
                        >
                          <span className="truncate">Recording {idx + 1}</span>
                        </a>
                      ))}
                    </div>
                  )}
                </div>
                
                {/* Audio recordings */}
                <div className="mt-2">
                  <div className="text-xs text-gray-600 flex items-center mb-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    </svg>
                    Audio Recordings: {s.audioRecordings?.length || 0}
                  </div>
                  
                  {s.audioRecordings?.length > 0 && (
                    <div className="grid grid-cols-2 gap-2">
                      {s.audioRecordings.map((recording, idx) => (
                        <a 
                          key={`audio-${idx}`} 
                          href={recording.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-xs bg-blue-50 p-2 rounded flex items-center hover:bg-blue-100"
                        >
                          <span className="truncate">Recording {idx + 1}</span>
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

// Helper function to calculate session duration
function calculateDuration(start, end) {
  const diff = Math.abs(end - start);
  const hours = Math.floor(diff / 36e5);
  const minutes = Math.floor((diff % 36e5) / 6e4);
  return `${hours}h ${minutes}m`;
}

export default SessionManager;