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

// New endpoint for face descriptor verification
router.post('/verify-face', (req, res) => {
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
                message: 'Invalid face descriptor format',
                verified: false
            });
        }

        // console.log("Descriptor length:", descriptor.length);
        console.log(decoded);
        
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
                if (!user.faceDescriptors || user.faceDescriptors.length === 0) {
                    return res.status(400).json({
                        message: 'No face descriptors registered for this user',
                        verified: false
                    });
                }

                // Compare submitted descriptor with stored descriptors
                // Using Euclidean distance for face descriptor comparison
                // A lower distance means more similar faces
                const THRESHOLD = 0.4; // Adjust threshold based on testing

                // Check against all stored descriptors (user might have multiple)
                let isMatch = false;
                let bestMatchDistance = Infinity;

                for (const storedDescriptor of user.faceDescriptors) {
                    // Ensure stored descriptor is also an array
                    let storedDescriptorArray = storedDescriptor;
                    
                    if (typeof storedDescriptor === 'object' && !Array.isArray(storedDescriptor)) {
                        storedDescriptorArray = [];
                        const keys = Object.keys(storedDescriptor).sort((a, b) => parseInt(a) - parseInt(b));
                        for (const key of keys) {
                            storedDescriptorArray.push(storedDescriptor[key]);
                        }
                    }

                    // Calculate Euclidean distance between descriptors
                    const distance = calculateDistance(descriptor, storedDescriptorArray);
                    console.log("Distance:", distance);

                    if (distance < bestMatchDistance) {
                        bestMatchDistance = distance;
                    }

                    // Check if distance is below threshold
                    if (distance < THRESHOLD) {
                        isMatch = true;
                        break;
                    }
                }

                if (isMatch) {
                    res.status(200).json({
                        message: 'Face verification successful',
                        verified: true,
                        confidence: 1 - (bestMatchDistance / THRESHOLD)
                    });
                } else {
                    res.status(401).json({
                        message: 'Face verification failed',
                        verified: false,
                        confidence: 1 - (bestMatchDistance / THRESHOLD)
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
                $push: { faceDescriptors: descriptor }
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

router.delete('/delete/:id', (req, res) => {
    Model.findByIdAndDelete(req.params.id)
        .then((result) => {
            if (result) res.status(200).json(result);
            else res.status(404).json({ message: 'user not found' });
        }).catch((err) => {
            res.status(500).json(err);
        });
});

router.get('/authorise', (req, res) => {
    res.status(200).json({ allowed: true })
})

module.exports = router;