const { model, Schema } = require('../connection');

const mySchema = new Schema({
    name: String,
    email: String,
    contact: String,
    password: String,
    shift: String,
    designation: String,
    worklocation: String,
    team: String, 
    
    createdAt: { type: Date, default: Date.now }
});

module.exports = model('addemployee', mySchema);