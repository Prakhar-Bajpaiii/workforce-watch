const express = require('express');
const router = express.Router();
const Session = require('../models/sessionModel');
const verifyToken = require('../midlewares/verify-token');

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

module.exports = router;