const { model, Schema, Types } = require('../connection');

const mySchema = new Schema({
    name: String,
    email: String,
    contact: String,
    password: String,
    shift: String,
    designation: String,
    worklocation: String,
    gender: String,
    dateofBirth: String,
    DateofJoining: String,
    team: String,
    Address: String,   
    manager: { type: Types.ObjectId, ref: 'user' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = model('employee', mySchema);