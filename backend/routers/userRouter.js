const express = require('express');

const router = express.Router();
const Model = require('../models/userModel');
require('dotenv').config();

const jwt = require('jsonwebtoken');

router.post('/add', (req, res) => {
    new Model(req.body).save()
        .then((result) => {
            res.status(200).json(result);
        }).catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
})

router.get('/getall', (req, res) => {
    Model.find()
        .then((result) => {
            res.status(200).json(result);
        }).catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
})

router.post('/authenticate', (req, res) => {
    Model.findOne(req.body)
        .then((result) => {
            if (result) {
                // Generate a token
                const token = jwt.sign(
                    { id: result._id, email: result.email }, // Payload
                    process.env.JWT_SECRET, // Secret key
                    { expiresIn: '1h' } // Token expiration time
                );

                res.status(200).json({ message: 'Login successful', token });
            } else {
                res.status(401).json({ message: 'Login failed' });
            }
        }).catch((err) => {
            console.log(err);
            
            res.status(500).json(err);
        });
});

router.delete('/delete/:id', (req, res) => {
    Model.findByIdAndDelete(req.params.id)
        .then((result) => {
            if (result) res.status(200).json(result);
            else res.status(404).json({ message: 'user not found' });
        }).catch((err) => {
            res.status(500).json(err);
        });
});

router.get('/authorise', (req,res) => {
    res.status(200).json({ allowed:true })
})

module.exports = router;