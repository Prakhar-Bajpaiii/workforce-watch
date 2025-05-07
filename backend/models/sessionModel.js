const { Schema, model } = require('../connection');

const recordingSchema = new Schema({
  filename: String,
  path: String,
  size: Number,
  mimetype: String,
  timestamp: { type: Date, default: Date.now },
  url: String
});

const sessionSchema = new Schema({
  employee: { type: Schema.Types.ObjectId, ref: 'employee', required: true },
  date: { type: Date, default: Date.now },
  status: { type: String, default: 'active' },
  loginTime: { type: Date, default: Date.now },
  logoutTime: { type: Date },
  screenRecordings: [recordingSchema],
  audioRecordings: [recordingSchema],
  videoRecordings: [recordingSchema],
  notes: String,
  location: {
    latitude: String,
    longitude: String,
    address: String
  }
});

module.exports = model('session', sessionSchema);