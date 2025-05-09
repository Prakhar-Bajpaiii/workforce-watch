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


router.post('/verify-face', (req, res) => {
    // Extract token from headers
    const token = req.headers['x-auth-token'];

    if (!token) {
        return res.status(401).json({ message: 'Authorization token required' });
    }
    // console.log(req.body);

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Get the submitted face descriptor
        let { descriptor } = req.body;

        // Convert descriptor object to array if needed
        if (descriptor && typeof descriptor === 'object' && !Array.isArray(descriptor)) {
            // Convert object with numeric keys to array
            const descriptorArray = [];
            const keys = Object.keys(descriptor).sort((a, b) => parseInt(a) - parseInt(b));

            for (const key of keys) {
                descriptorArray.push(descriptor[key]);
            }
            descriptor = descriptorArray;
        }

        if (!descriptor || !Array.isArray(descriptor)) {
            return res.status(400).json({
                message: 'Invalid face descriptor format',
                verified: false
            });
        }

        // console.log("Descriptor length:", descriptor.length);
        // console.log(decoded);

        // Find the user by ID from the token
        Model.findById(decoded.id)
            .then((user) => {
                if (!user) {
                    return res.status(404).json({
                        message: 'User not found',
                        verified: false
                    });
                }

                // Check if user has stored face descriptors
                if (!user.faceDescriptor) {
                    return res.status(400).json({
                        message: 'No face descriptors registered for this user',
                        verified: false
                    });
                }

                // Compare submitted descriptor with stored descriptors
                // Using Euclidean distance for face descriptor comparison
                // A lower distance means more similar faces
                const THRESHOLD = 0.6; // Adjust threshold based on testing

                // Convert the user's faceDescriptor to array if it's an object with numeric keys
                let storedDescriptorArray;
                if (typeof user.faceDescriptor === 'object' && !Array.isArray(user.faceDescriptor)) {
                    storedDescriptorArray = [];
                    const keys = Object.keys(user.faceDescriptor).sort((a, b) => parseInt(a) - parseInt(b));
                    for (const key of keys) {
                        storedDescriptorArray.push(user.faceDescriptor[key]);
                    }
                } else if (Array.isArray(user.faceDescriptor)) {
                    storedDescriptorArray = user.faceDescriptor;
                } else {
                    return res.status(400).json({
                        message: 'Invalid face descriptor format stored for user',
                        verified: false
                    });
                }

                // Calculate Euclidean distance between descriptors
                const distance = calculateDistance(descriptor, storedDescriptorArray);
                console.log("Distance:", distance);

                // Determine if the face matches based on distance threshold
                const isMatch = distance < THRESHOLD;
                const confidence = 1 - (distance / THRESHOLD);

                if (isMatch) {
                    res.status(200).json({
                        message: 'Face verification successful',
                        verified: true,
                        confidence: confidence
                    });
                } else {
                    res.status(401).json({
                        message: 'Face verification failed',
                        verified: false,
                        confidence: confidence
                    });
                }
            })
            .catch((err) => {
                console.error('Error during face verification:', err);
                res.status(500).json({
                    message: 'Face verification error',
                    verified: false,
                    error: err.message
                });
            });
    } catch (err) {
        console.error('Token verification error:', err);
        res.status(401).json({ message: 'Invalid or expired token', verified: false });
    }
});

// Helper function to calculate Euclidean distance between two descriptors
function calculateDistance(descriptor1, descriptor2) {
    console.log(descriptor1.length, descriptor2.length);

    if (descriptor1.length !== descriptor2.length) {
        throw new Error('Descriptor dimensions do not match');
    }

    let sum = 0;
    for (let i = 0; i < descriptor1.length; i++) {
        const diff = descriptor1[i] - descriptor2[i];
        sum += diff * diff;
    }

    return Math.sqrt(sum);
}

// Add face descriptor for a user
router.post('/register-face', (req, res) => {
    // Extract token from headers
    const token = req.headers['x-auth-token'];

    if (!token) {
        return res.status(401).json({ message: 'Authorization token required' });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Get the submitted face descriptor
        let { descriptor } = req.body;

        // Convert descriptor object to array if needed
        if (descriptor && typeof descriptor === 'object' && !Array.isArray(descriptor)) {
            // Convert object with numeric keys to array
            const descriptorArray = [];
            const keys = Object.keys(descriptor).sort((a, b) => parseInt(a) - parseInt(b));

            for (const key of keys) {
                descriptorArray.push(descriptor[key]);
            }
            descriptor = descriptorArray;
        }

        if (!descriptor || !Array.isArray(descriptor)) {
            return res.status(400).json({
                message: 'Invalid face descriptor format'
            });
        }

        // Find and update the user with the new face descriptor
        Model.findByIdAndUpdate(
            decoded.id,
            {
                $push: { faceDescriptor: descriptor }
            },
            { new: true }
        )
            .then((result) => {
                if (result) {
                    res.status(200).json({
                        message: 'Face descriptor registered successfully'
                    });
                } else {
                    res.status(404).json({ message: 'User not found' });
                }
            })
            .catch((err) => {
                console.error('Error registering face descriptor:', err);
                res.status(500).json({
                    message: 'Error registering face descriptor',
                    error: err.message
                });
            });
    } catch (err) {
        console.error('Token verification error:', err);
        res.status(401).json({ message: 'Invalid or expired token' });
    }
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

router.get('/authorise', (req, res) => {
    res.status(200).json({ allowed: true })
})

module.exports = router;