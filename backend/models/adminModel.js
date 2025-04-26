const {model,Schema } = require('../connection');

const mySchema = new Schema({
    name: String,
    email: String,
    passward: String,
    contact: String,


    createdAt: {type: Date, default: Date.now}
    
    
});

model.exports =  model('admin',mySchema);