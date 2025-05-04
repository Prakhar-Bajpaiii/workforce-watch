const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'employee',
    required: true,
  },
  date: {
    type: Date,
    required: true,
    default: () => new Date().setHours(0,0,0,0), // midnight today
  },
  loginTime: {
    type: Date,
    required: true,
  },
  logoutTime: {
    type: Date,
  },
  durationMinutes: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ['Present', 'Absent', 'Half Day', 'On Leave'],
    default: 'Present',
  },
  notes: {
    type: String,
  },
  screenRecordings: [
    {
      url: { type: String, required: true }, // URL or path to the screen recording file
      startedAt: { type: Date },
      endedAt: { type: Date }
    }
  ],
  videoRecordings: [
    {
      url: { type: String, required: true }, // URL or path to the video recording file
      startedAt: { type: Date },
      endedAt: { type: Date }
    }
  ]
});

module.exports = mongoose.model('session', sessionSchema);