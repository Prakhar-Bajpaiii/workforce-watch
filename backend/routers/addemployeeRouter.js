const express = require('express');

const router = express.Router();
const Model = require('../models/addemployeeModel');

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
            if (result) res.status(200).json(result);
            else res.status(401).json({ message: 'login failed' });
        }).catch((err) => {
            res.status(500).json(err);
        });
})

router.get('/authorise', (req,res) => {
    res.status(200).json({ allowed:true })
})

module.exports = router;