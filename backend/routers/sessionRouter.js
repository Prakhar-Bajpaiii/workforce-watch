const express = require('express');
const router = express.Router();
const Session = require('../models/sessionModel');
const verifyToken = require('../midlewares/verify-token');
const EmployeeModel = require('../models/employeeModel');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

// Create a new session (employee login)
router.post('/create', verifyToken, async (req, res) => {
  try {
    const session = new Session({
      employee: req.user.id,
      loginTime: req.body.loginTime || new Date(),
      ...req.body
    });
    await session.save();
    res.status(201).json(session);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create session', details: err });
  }
});

// Update session (employee logout, add logoutTime, duration, recordings, etc.)
router.put('/update/:id', verifyToken, async (req, res) => {
  try {
    const session = await Session.findOneAndUpdate(
      { _id: req.params.id, employee: req.user.id },
      { $set: req.body },
      { new: true }
    );
    if (!session) return res.status(404).json({ message: 'Session not found' });
    res.json(session);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update session', details: err });
  }
});

// Get all sessions for the logged-in employee
router.get('/my', verifyToken, async (req, res) => {
  try {
    const sessions = await Session.find({ employee: req.user.id }).sort({ date: -1 });
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch sessions', details: err });
  }
});

// Get a session by ID (for employee or manager)
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);
    if (!session) return res.status(404).json({ message: 'Session not found' });
    res.json(session);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch session', details: err });
  }
});

// Add a screen recording to a session
router.post('/add-screen/:id', verifyToken, async (req, res) => {
  try {
    const { url, startedAt, endedAt } = req.body;
    const session = await Session.findOneAndUpdate(
      { _id: req.params.id, employee: req.user.id },
      { $push: { screenRecordings: { url, startedAt, endedAt } } },
      { new: true }
    );
    if (!session) return res.status(404).json({ message: 'Session not found' });
    res.json(session);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add screen recording', details: err });
  }
});

// Add a video recording to a session
router.post('/add-video/:id', verifyToken, async (req, res) => {
  try {
    const { url, startedAt, endedAt } = req.body;
    const session = await Session.findOneAndUpdate(
      { _id: req.params.id, employee: req.user.id },
      { $push: { videoRecordings: { url, startedAt, endedAt } } },
      { new: true }
    );
    if (!session) return res.status(404).json({ message: 'Session not found' });
    res.json(session);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add video recording', details: err });
  }
});

// Get all sessions for a specific employee (manager access)
router.get('/employee/:employeeId', authenticateManager, async (req, res) => {
  try {
    const { employeeId } = req.params;
    
    // Verify that the employee exists
    const employee = await EmployeeModel.findById(employeeId);
    console.log(employeeId, employee);
    
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    
    // Get all sessions for this employee
    const sessions = await Session.find({ employee: employeeId })
      .sort({ date: -1 }); // Sort by date descending (newest first)
    
    res.status(200).json(sessions);
  } catch (error) {
    console.error('Error fetching employee sessions:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete a session (manager access)
router.delete('/:sessionId', authenticateManager, async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    // Find the session
    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }
    
    // Delete recordings if any exist
    if (session.screenRecordings?.length > 0 || session.audioRecordings?.length > 0) {
      const recordings = [
        ...(session.screenRecordings || []),
        ...(session.audioRecordings || [])
      ];
      
      // Delete recording files
      for (const recording of recordings) {
        if (recording.path) {
          try {
            const filePath = path.resolve(recording.path);
            if (fs.existsSync(filePath)) {
              fs.unlinkSync(filePath);
            }
          } catch (fileErr) {
            console.error(`Error deleting recording file: ${fileErr.message}`);
            // Continue even if file delete fails
          }
        }
      }
    }
    
    // Delete the session
    await Session.findByIdAndDelete(sessionId);
    
    res.status(200).json({ message: 'Session deleted successfully' });
  } catch (error) {
    console.error('Error deleting session:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Manager authentication middleware
function authenticateManager(req, res, next) {
  const token = req.headers['x-auth-token'];
  
  if (!token) {
    return res.status(401).json({ message: 'No authentication token provided' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if the user is a manager
    // if (decoded.role !== 'manager') {
    //   return res.status(403).json({ message: 'Access denied. Managers only.' });
    // }
    
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ message: 'Invalid token' });
  }
}

module.exports = router;