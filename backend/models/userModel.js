const { model, Schema } = require('../connection');

const mySchema = new Schema({
    name: String,
    email: String,
    password: String,
    createdAt: { type: Date, default: Date.now }
});

module.exports = model('user', mySchema);