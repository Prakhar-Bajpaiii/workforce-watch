const { model, Schema } = require('../connection');

const mySchema = new Schema({
    name: String,
    email: String,
    contact: String,
    password: String,
    
   
createdAt: { type: Date, default: Date.now }


});

module.exports = model('manager', mySchema);