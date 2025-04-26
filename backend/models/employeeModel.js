const { model, Schema } = require('../connection');

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
    manager: String,
    team: String,
    Address: String,   
    
    createdAt: { type: Date, default: Date.now }
});

module.exports = model('employee', mySchema);