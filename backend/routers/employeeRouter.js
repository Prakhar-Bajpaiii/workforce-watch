const express = require('express');

const router = express.Router();
const Model = require('../models/employeeModel');
require('dotenv').config();

const jwt = require('jsonwebtoken');
const verifyToken = require('../midlewares/verify-token'); // adjust path if needed

router.post('/add', verifyToken, (req, res) => {
    req.body.manager = req.user.id; // Set the manager ID from the token
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
router.get('/getbyid/:id', (req, res) => {
    Model.findById(req.params.id)
        .then((result) => {
            res.status(200).json(result);
        }).catch((err) => {
            res.status(500).json(err);
        });
});

router.get('/getbyemployee/:id', (req, res) => {
    Task.find({ assignedTo: req.params.id })
      .then((tasks) => res.status(200).json(tasks))
      .catch((err) => res.status(500).json(err));
  });

router.get('/getbymanager', verifyToken, (req, res) => {
    // req.user.id should be set by your verify-token middleware
    console.log(req.user);
    
    Model.find({ manager: req.user.id })
        .then((employees) => res.status(200).json(employees))
        .catch((err) => res.status(500).json(err));
});

router.get('/profile', verifyToken, (req, res) => {
    Model.findById(req.user.id)
        .then((employee) => {
            if (employee) res.status(200).json(employee);
            else res.status(404).json({ message: 'Employee not found' });
        })
        .catch((err) => res.status(500).json(err));
});

router.get('/authorise', (req,res) => {
    res.status(200).json({ allowed:true })
})

module.exports = router;