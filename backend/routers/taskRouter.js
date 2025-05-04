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
router.get('/getbyemployee/:id',  (req, res) => {
    // console.log(req.user._id);
    
    Model.find({ assignedTo: req.params.id })
        .then((tasks) => {
            res.status(200).json(tasks);
        }).catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
});
// Get tasks assigned to the logged-in employee (using token)
router.get('/getbyemployee', require('../midlewares/verify-token'), (req, res) => {
    // req.user.id should be set by your verify-token middleware
    Model.find({ assignedTo: req.user.id })
        .then((tasks) => res.status(200).json(tasks))
        .catch((err) => res.status(500).json(err));
});

// Update task status by employee (protected)
router.put('/updatestatus/:taskId', require('../midlewares/verify-token'), async (req, res) => {
    try {
        const { status } = req.body;
        const task = await Model.findOne({ _id: req.params.taskId, assignedTo: req.user.id });
        if (!task) {
            return res.status(404).json({ message: 'Task not found or not assigned to you' });
        }
        task.status = status;
        await task.save();
        res.status(200).json(task);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Failed to update task status' });
    }
});

router.get('/authorise', (req,res) => {
    res.status(200).json({ allowed:true })
})

module.exports = router;