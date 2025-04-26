const mongoose = require('mongoose');

const url = 'mongodb+srv://prakharbajpai201:prakhar515@cluster0.pjpye.mongodb.net/Major_project?retryWrites=true&w=majority&appName=Cluster0';


mongoose.connect(url)
    .then((result) => {
        console.log('database connected');
    }).catch((err) => {
        console.log(err);
    });

module.exports = mongoose;
