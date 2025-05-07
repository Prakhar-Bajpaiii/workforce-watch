const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const SessionModel = require('../models/sessionModel');
const EmployeeModel = require('../models/employeeModel');

// Set up multer storage for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Create directory if it doesn't exist
    const dir = path.join(__dirname, '../uploads/recordings');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `recording-${uniqueSuffix}${ext}`);
  }
});

// File filter to only accept webm files
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'video/webm' || file.mimetype === 'audio/webm') {
    cb(null, true);
  } else {
    cb(new Error('Only webm files are allowed'), false);
  }
};

// Set up multer upload
const upload = multer({ 
  storage, 
  fileFilter,
  limits: {
    fileSize: 500 * 1024 * 1024, // 500 MB max file size
  }
});

// Authentication middleware
const authenticate = (req, res, next) => {
  const token = req.headers['x-auth-token'];
  
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Upload recording
router.post('/upload', authenticate, upload.single('recording'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    const { sessionId, type } = req.body;
    
    if (!sessionId || !type) {
      return res.status(400).json({ message: 'Session ID and recording type are required' });
    }
    
    // Get the session
    const session = await SessionModel.findById(sessionId);
    
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }
    
    // Verify that the session belongs to the authenticated user
    if (session.employee.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to add recordings to this session' });
    }
    
    // Create recording object
    const recording = {
      filename: req.file.filename,
      path: req.file.path,
      size: req.file.size,
      mimetype: req.file.mimetype,
      timestamp: new Date(),
      url: `http://localhost:5000/uploads/recordings/${req.file.filename}`
    };
    
    // Add the recording to the appropriate array based on type
    if (type === 'screen' || type === 'both') {
      if (!session.screenRecordings) {
        session.screenRecordings = [];
      }
      session.screenRecordings.push(recording);
    }
    
    if (type === 'audio' || type === 'both') {
      if (!session.audioRecordings) {
        session.audioRecordings = [];
      }
      session.audioRecordings.push(recording);
    }
    
    // Save the session
    await session.save();
    
    res.status(200).json({ 
      message: 'Recording uploaded successfully',
      recording
    });
    
  } catch (error) {
    console.error('Error uploading recording:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get recording file
router.get('/file/:filename', async (req, res) => {
  try {
    const filePath = path.join(__dirname, `../uploads/recordings/${req.params.filename}`);
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'Recording file not found' });
    }
    
    // Serve the file
    res.sendFile(filePath);
    
  } catch (error) {
    console.error('Error retrieving recording file:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all recordings for a specific session
router.get('/session/:sessionId', authenticate, async (req, res) => {
  try {
    const session = await SessionModel.findById(req.params.sessionId);
    
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }
    
    // Verify ownership
    if (session.employee.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to access these recordings' });
    }
    
    const recordings = {
      screenRecordings: session.screenRecordings || [],
      audioRecordings: session.audioRecordings || []
    };
    
    res.status(200).json(recordings);
    
  } catch (error) {
    console.error('Error retrieving recordings:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;