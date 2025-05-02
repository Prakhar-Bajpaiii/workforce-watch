const express = require('express');

const router = express.Router();
const Model = require('../models/taskModel');
const verifyToken = require('../midlewares/verify-token');

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


router.delete('/delete/:id', (req, res) => {
    Model.findByIdAndDelete(req.params.id)
        .then((result) => {
            if (result) res.status(200).json(result);
            else res.status(404).json({ message: 'task not found' });
        }).catch((err) => {
            res.status(500).json(err);
        });
});
router.get('/getbyid/:id', (req, res) => {
    Model.findById(req.params.id)
        .then((result) => {
            if (result) res.status(200).json(result);
            else res.status(404).json({ message: 'task not found' });
        }).catch((err) => {
            res.status(500).json(err);
        });
});

// New endpoint to fetch tasks assigned to a specific employee
router.get('/getbyemployee', verifyToken, (req, res) => {
    Model.find({ assignedTo: req.user._id })
        .then((tasks) => {
            res.status(200).json(tasks);
        }).catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
});

router.get('/getbyemployee/:id', (req, res) => {
    // Only fetch tasks assigned to the given employee ID
    Model.find({ assignedTo: req.params.id })
        .then((tasks) => res.status(200).json(tasks))
        .catch((err) => res.status(500).json(err));
});

router.get('/authorise', (req,res) => {
    res.status(200).json({ allowed:true })
})

module.exports = router;