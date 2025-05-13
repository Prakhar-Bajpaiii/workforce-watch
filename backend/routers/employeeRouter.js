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


router.post('/verify-face', verifyToken, async (req, res) => {
  try {
    const { descriptor, minConfidence } = req.body;
    const employeeId = req.user.id;
    
    // Use the client-supplied minConfidence or default to 0.6
    const confidenceThreshold = minConfidence || 0.6;
    console.log(`Confidence threshold: ${confidenceThreshold}`);
    
    if (!descriptor || !employeeId) {
      return res.status(400).json({ 
        verified: false, 
        message: 'Missing descriptor or employee ID' 
      });
    }
    
    // Find the employee
    const employee = await Model.findById(employeeId);
    
    if (!employee || !employee.faceDescriptor) {
      return res.status(400).json({ 
        verified: false, 
        message: 'No face data available for this employee' 
      });
    }
    
    // Handle different storage formats safely
    let storedDescriptor;
    try {
      // Try to parse if it's a JSON string
      if (typeof employee.faceDescriptor === 'string') {
        storedDescriptor = JSON.parse(employee.faceDescriptor);
      } 
      // If it's already an array, use directly
      else if (Array.isArray(employee.faceDescriptor)) {
        storedDescriptor = employee.faceDescriptor;
      }
      // If it's an embedded document/object
      else if (typeof employee.faceDescriptor === 'object') {
        storedDescriptor = Object.values(employee.faceDescriptor);
      }
      // Default case - convert to array if possible
      else {
        return res.status(400).json({
          verified: false,
          message: 'Invalid face descriptor format in database'
        });
      }
    } catch (parseError) {
      console.error('Error parsing face descriptor:', parseError);
      
      // Try handling as array if parsing fails
      if (Array.isArray(employee.faceDescriptor)) {
        storedDescriptor = employee.faceDescriptor;
      } else {
        return res.status(500).json({
          verified: false,
          message: 'Error parsing face descriptor data'
        });
      }
    }
    
    // Make sure both descriptors are arrays of numbers
    const detectedArray = Array.isArray(descriptor) ? descriptor : Object.values(descriptor);
    const storedArray = Array.isArray(storedDescriptor) ? storedDescriptor : Object.values(storedDescriptor);
    
    // Verify both arrays have the same length
    if (detectedArray.length !== storedArray.length) {
      console.error(`Descriptor length mismatch: stored=${storedArray.length}, detected=${detectedArray.length}`);
      return res.status(400).json({
        verified: false,
        message: 'Descriptor format mismatch'
      });
    }
    
    // Calculate distance
    let distance = 0;
    for (let i = 0; i < storedArray.length; i++) {
      distance += Math.pow(storedArray[i] - detectedArray[i], 2);
    }
    distance = Math.sqrt(distance);
    
    // Adjust threshold according to the requested confidence level
    const threshold = 1 - confidenceThreshold; // Convert confidence to distance threshold
    const verified = distance < threshold;
    
    // Calculate confidence level (1 - distance) to return to client
    const confidence = 1 - distance;
    
    console.log(`Face verification for employee ${employeeId}: distance=${distance.toFixed(4)}, confidence=${confidence.toFixed(4)}, threshold=${threshold.toFixed(4)}, verified=${verified}`);
    
    // Return result with confidence level
    return res.json({ 
      verified, 
      confidence,
      threshold,
      message: verified ? 'Face verified' : 'Face verification failed' 
    });
  } catch (error) {
    console.error('Face verification error:', error);
    res.status(500).json({ 
      verified: false, 
      message: 'Server error during face verification',
      error: error.message
    });
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

        // Normalize descriptor to array format
        let descriptorArray;
        if (Array.isArray(descriptor)) {
            descriptorArray = descriptor;
        } else if (descriptor && typeof descriptor === 'object') {
            // Convert object with numeric keys to array
            descriptorArray = [];
            const keys = Object.keys(descriptor).sort((a, b) => parseInt(a) - parseInt(b));
            for (const key of keys) {
                descriptorArray.push(descriptor[key]);
            }
        } else {
            return res.status(400).json({
                message: 'Invalid face descriptor format'
            });
        }

        // Make sure all values are numbers
        if (!descriptorArray.every(val => typeof val === 'number')) {
            return res.status(400).json({
                message: 'Face descriptor must contain only numbers'
            });
        }

        // Store as a stringified JSON array for consistent retrieval
        const descriptorString = JSON.stringify(descriptorArray);

        // Find and update the user with the new face descriptor
        Model.findByIdAndUpdate(
            decoded.id,
            { faceDescriptor: descriptorString },
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

// Add this debug endpoint (remove in production)
router.get('/debug-face-data', verifyToken, async (req, res) => {
  try {
    const employee = await Model.findById(req.user.id);
    if (!employee) return res.status(404).json({ message: 'Employee not found' });
    
    return res.json({
      hasDescriptor: !!employee.faceDescriptor,
      descriptorType: typeof employee.faceDescriptor,
      isArray: Array.isArray(employee.faceDescriptor),
      descriptorPreview: employee.faceDescriptor ? 
        (typeof employee.faceDescriptor === 'string' ? 
          employee.faceDescriptor.substring(0, 50) + '...' : 
          'Non-string descriptor') : 
        null
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;