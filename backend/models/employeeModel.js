const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    contact: String,
    password: String,
    shift: String,
    designation: String,
    faceDescriptor: {
        type: String, // Store as string, not as array
        required: true
    },
    worklocation: String,
    gender: String,
    dateofBirth: String,
    DateofJoining: String,
    team: String,
    Address: String,   
    manager: { type: mongoose.Types.ObjectId, ref: 'user' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Employee', employeeSchema);