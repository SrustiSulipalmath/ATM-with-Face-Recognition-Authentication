// // const bcrypt = require('bcrypt');
// // const db = require('../config/db');
// // const facialRecognition = require('D:\atm-project\server\services\facialRecognition.js');

// // exports.register = async (req, res) => {
// //     try {
// //         const { name, email, phone, account, pin, faceImage } = req.body;
        
// //         // Validate input
// //         if (faceImage.length > 5 * 1024 * 1024) {
// //             return res.status(400).json({ error: 'Face image too large' });
// //         }

// //         // Hash PIN
// //         const hashedPin = await bcrypt.hash(pin, 10);
        
// //         // Register face
// //         const faceId = await facialRecognition.register(faceImage);
        
// //         // Save to database
// //         const [result] = await db.query(
// //             `INSERT INTO users 
// //             (name, email, phone, account_number, pin, face_id, balance) 
// //             VALUES (?, ?, ?, ?, ?, ?, 0)`,
// //             [name, email, phone, account, hashedPin, faceId]
// //         );

// //         res.status(201).json({ message: 'User registered' });
// //     } catch (error) {
// //         console.error('Registration error:', error);
// //         res.status(500).json({ error: 'Internal server error' });
// //     }
// // };

// // exports.verifyFace = async (req, res) => {
// //     try {
// //         const { image } = req.body;
// //         const result = await facialRecognition.verify(image);
        
// //         if (result.confidence > 0.8) {
// //             req.session.faceVerified = true;
// //             req.session.userId = result.userId;
// //             res.json({ success: true });
// //         } else {
// //             res.status(401).json({ error: 'Face verification failed' });
// //         }
// //     } catch (error) {
// //         res.status(500).json({ error: 'Face verification error' });
// //     }
// // };


// // exports.register = async (req, res) => {
// //     try {
// //       const { name, email, phone, account, pin, facialId } = req.body;
      
// //       // Hash PIN
// //       const hashedPin = await bcrypt.hash(pin, 10);
      
// //       // Store in database
// //       const [result] = await db.query(
// //         `INSERT INTO users 
// //         (name, email, phone, account_number, pin, facial_id) 
// //         VALUES (?, ?, ?, ?, ?, ?)`,
// //         [name, email, phone, account, hashedPin, facialId]
// //       );
  
// //       res.status(201).json({ 
// //         success: true,
// //         userId: result.insertId
// //       });
// //     } catch (error) {
// //       console.error('Registration error:', error);
// //       res.status(500).json({ error: 'Registration failed' });
// //     }
// //   };

// // exports.login = async (req, res) => {
// //     try {
// //       const { facialId, pin } = req.body;
      
// //       // Get user from DB
// //       const [user] = await db.query(
// //         'SELECT * FROM users WHERE facial_id = ?',
// //         [facialId]
// //       );
      
// //       // Verify PIN
// //       const pinMatch = await bcrypt.compare(pin, user.pin);
      
// //       if(pinMatch) {
// //         // Create session
// //         const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
// //         res.json({ 
// //           success: true,
// //           token: token,
// //           user: {
// //             name: user.name,
// //             email: user.email,
// //             account: user.account_number,
// //             balance: user.balance
// //           }
// //         });
// //       }
// //     } catch (error) {
// //       res.status(401).json({ error: 'Authentication failed' });
// //     }
// //   };

// //   exports.resetFace = async (req, res) => {
// //     try {
// //         const userId = req.userId;
// //         const { faceImage } = req.body;
        
// //         // Update face in database
// //         await db.query(
// //             'UPDATE users SET face_image = ? WHERE id = ?',
// //             [faceImage, userId]
// //         );
        
// //         res.json({ success: true });
// //     } catch (error) {
// //         res.status(500).json({ error: 'Face reset failed' });
// //     }
// // };

// // exports.resetPin = async (req, res) => {
// //     try {
// //         const userId = req.userId;
// //         const { currentPin, newPin } = req.body;
        
// //         // Verify current PIN
// //         const [user] = await db.query(
// //             'SELECT pin FROM users WHERE id = ?',
// //             [userId]
// //         );
        
// //         const pinMatch = await bcrypt.compare(currentPin, user.pin);
        
// //         if (!pinMatch) {
// //             return res.status(401).json({ error: 'Incorrect current PIN' });
// //         }
        
// //         // Hash new PIN
// //         const hashedPin = await bcrypt.hash(newPin, 10);
        
// //         // Update PIN
// //         await db.query(
// //             'UPDATE users SET pin = ? WHERE id = ?',
// //             [hashedPin, userId]
// //         );
        
// //         res.json({ success: true });
// //     } catch (error) {
// //         res.status(500).json({ error: 'PIN reset failed' });
// //     }
// // };

// // // Generic Update Handler
// // const handleAccountUpdate = async (req, res, field) => {
// //   try {
// //       const userId = req.userId;
// //       const { newValue, pin } = req.body;

// //       // Verify PIN first
// //       const [user] = await db.query(
// //           'SELECT pin FROM users WHERE id = ?',
// //           [userId]
// //       );
      
// //       const pinMatch = await bcrypt.compare(pin, user.pin);
// //       if (!pinMatch) return res.status(401).json({ error: 'Invalid PIN' });

// //       // Update field
// //       await db.query(
// //           `UPDATE users SET ${field} = ? WHERE id = ?`,
// //           [newValue, userId]
// //       );

// //       res.json({ success: true });
// //   } catch (error) {
// //       res.status(500).json({ error: `Failed to update ${field}` });
// //   }
// // };

// // exports.updateUsername = (req, res) => handleAccountUpdate(req, res, 'name');
// // exports.updateEmail = (req, res) => handleAccountUpdate(req, res, 'email');
// // exports.updatePhone = (req, res) => handleAccountUpdate(req, res, 'phone');

// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const db = require('../config/db');
// const facialRecognition = require('../services/facialRecognition');

// // Registration with validation
// exports.register = async (req, res) => {
//     try {
//         const { name, email, phone, account, pin, faceImage } = req.body;

//         // Validate face image size
//         if (faceImage.length > 5 * 1024 * 1024) {
//             return res.status(400).json({ error: 'Face image too large' });
//         }

//         // Hash PIN
//         const hashedPin = await bcrypt.hash(pin, 10);
        
//         // Register face
//         const faceId = await facialRecognition.register(faceImage);
        
//         // Save to database
//         const [result] = await db.query(
//             `INSERT INTO users 
//             (name, email, phone, account_number, pin, face_id, balance) 
//             VALUES (?, ?, ?, ?, ?, ?, 0)`,
//             [name, email, phone, account, hashedPin, faceId]
//         );

//         res.status(201).json({ 
//             success: true,
//             userId: result.insertId
//         });
//     } catch (error) {
//         console.error('Registration error:', error);
//         res.status(500).json({ error: 'Registration failed' });
//     }
// };

// // Login handler
// exports.login = async (req, res) => {
//     try {
//         const { facialId, pin } = req.body;
        
//         // Get user from DB
//         const [user] = await db.query(
//             'SELECT * FROM users WHERE face_id = ?',
//             [facialId]
//         );
        
//         // Verify PIN
//         const pinMatch = await bcrypt.compare(pin, user[0].pin);
        
//         if(pinMatch) {
//             // Create JWT token
//             const token = jwt.sign({ userId: user[0].id }, process.env.JWT_SECRET);
//             res.json({ 
//                 success: true,
//                 token: token,
//                 user: {
//                     name: user[0].name,
//                     email: user[0].email,
//                     account: user[0].account_number,
//                     balance: user[0].balance
//                 }
//             });
//         } else {
//             res.status(401).json({ error: 'Authentication failed' });
//         }
//     } catch (error) {
//         res.status(500).json({ error: 'Login error' });
//     }
// };

// // Account update handlers
// const handleAccountUpdate = async (req, res, field) => {
//     try {
//         const userId = req.userId;
//         const { newValue, pin } = req.body;

//         // Verify PIN
//         const [user] = await db.query(
//             'SELECT pin FROM users WHERE id = ?',
//             [userId]
//         );
        
//         const pinMatch = await bcrypt.compare(pin, user[0].pin);
//         if (!pinMatch) return res.status(401).json({ error: 'Invalid PIN' });

//         // Update field
//         await db.query(
//             `UPDATE users SET ${field} = ? WHERE id = ?`,
//             [newValue, userId]
//         );

//         res.json({ success: true });
//     } catch (error) {
//         res.status(500).json({ error: `Failed to update ${field}` });
//     }
// };

// exports.updateUsername = (req, res) => handleAccountUpdate(req, res, 'name');
// exports.updateEmail = (req, res) => handleAccountUpdate(req, res, 'email');
// exports.updatePhone = (req, res) => handleAccountUpdate(req, res, 'phone');

// // Face/PIN reset handlers
// exports.resetFace = async (req, res) => {
//     try {
//         const userId = req.userId;
//         const { faceImage } = req.body;
        
//         // Update face in database
//         await db.query(
//             'UPDATE users SET face_id = ? WHERE id = ?',
//             [await facialRecognition.register(faceImage), userId]
//         );
//         res.json({ success: true });
//     } catch (error) {
//         res.status(500).json({ error: 'Face reset failed' });
//     }
// };

// exports.resetPin = async (req, res) => {
//     try {
//         const userId = req.userId;
//         const { currentPin, newPin } = req.body;
        
//         // Verify current PIN
//         const [user] = await db.query(
//             'SELECT pin FROM users WHERE id = ?',
//             [userId]
//         );
        
//         const pinMatch = await bcrypt.compare(currentPin, user[0].pin);
//         if (!pinMatch) return res.status(401).json({ error: 'Incorrect PIN' });
        
//         // Update PIN
//         await db.query(
//             'UPDATE users SET pin = ? WHERE id = ?',
//             [await bcrypt.hash(newPin, 10), userId]
//         );
//         res.json({ success: true });
//     } catch (error) {
//         res.status(500).json({ error: 'PIN reset failed' });
//     }
// };

// exports.getUser = async (req, res) => {
//     try {
//         const [user] = await db.query(
//             `SELECT id, name, email, phone, 
//              account_number AS account, 
//              face_id AS faceImage, 
//              balance 
//              FROM users WHERE id = ?`,
//             [req.userId]
//         );
        
//         if (!user.length) return res.status(404).json({ error: 'User not found' });
        
//         res.json(user[0]);
//     } catch (error) {
//         console.error('User fetch error:', error);
//         res.status(500).json({ error: 'Failed to fetch user data' });
//     }
// };


const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const facialRecognition = require('../services/facialRecognition');

// Registration with validation
exports.register = async (req, res) => {
    try {
        const { name, email, phone, account, pin, faceImage } = req.body;

        if (!/^[0-9]{4}$/.test(pin)) {
            return res.status(400).json({ error: 'PIN must be a 4-digit number' });
        }

        if (!faceImage || faceImage.length > 5 * 1024 * 1024) {
            return res.status(400).json({ error: 'Face image is required and must be under 5MB' });
        }

        const hashedPin = await bcrypt.hash(pin, 10);
        const faceId = await facialRecognition.register(faceImage);
        
        const [result] = await db.query(
            `INSERT INTO users 
            (name, email, phone, account_number, pin, face_id, balance) 
            VALUES (?, ?, ?, ?, ?, ?, 0)`,
            [name, email, phone, account, hashedPin, faceId]
        );

        res.status(201).json({ 
            success: true,
            userId: result.insertId
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Registration failed' });
    }
};

// Login handler
exports.login = async (req, res) => {
    try {
        const { facialId, pin } = req.body;

        const [user] = await db.query(
            'SELECT * FROM users WHERE face_id = ?',
            [facialId]
        );

        if (!user.length) return res.status(401).json({ error: 'User not found' });

        const pinMatch = await bcrypt.compare(pin, user[0].pin);
        if (!pinMatch) return res.status(401).json({ error: 'Invalid PIN' });

        const token = jwt.sign({ userId: user[0].id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ 
            success: true,
            token,
            user: {
                name: user[0].name,
                email: user[0].email,
                account: user[0].account_number,
                balance: user[0].balance
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Login error' });
    }
};

// Common handler for updating user details
const handleAccountUpdate = async (req, res, field) => {
    try {
        const userId = req.userId;
        const { newValue, pin } = req.body;

        const [user] = await db.query('SELECT pin FROM users WHERE id = ?', [userId]);
        if (!user.length) return res.status(404).json({ error: 'User not found' });

        const pinMatch = await bcrypt.compare(pin, user[0].pin);
        if (!pinMatch) return res.status(401).json({ error: 'Invalid PIN' });

        await db.query(`UPDATE users SET ${field} = ? WHERE id = ?`, [newValue, userId]);
        res.json({ success: true });
    } catch (error) {
        console.error(`Failed to update ${field}:`, error);
        res.status(500).json({ error: `Failed to update ${field}` });
    }
};

exports.updateUsername = (req, res) => handleAccountUpdate(req, res, 'name');
exports.updateEmail = (req, res) => handleAccountUpdate(req, res, 'email');
exports.updatePhone = (req, res) => handleAccountUpdate(req, res, 'phone');

// Face/PIN reset handlers
exports.resetFace = async (req, res) => {
    try {
        const userId = req.userId;
        const { faceImage } = req.body;

        if (!faceImage) return res.status(400).json({ error: 'Face image is required' });
        
        const faceId = await facialRecognition.register(faceImage);
        await db.query('UPDATE users SET face_id = ? WHERE id = ?', [faceId, userId]);
        res.json({ success: true });
    } catch (error) {
        console.error('Face reset failed:', error);
        res.status(500).json({ error: 'Face reset failed' });
    }
};

exports.resetPin = async (req, res) => {
    try {
        const userId = req.userId;
        const { currentPin, newPin } = req.body;

        if (!/^[0-9]{4}$/.test(newPin)) {
            return res.status(400).json({ error: 'New PIN must be a 4-digit number' });
        }

        const [user] = await db.query('SELECT pin FROM users WHERE id = ?', [userId]);
        if (!user.length) return res.status(404).json({ error: 'User not found' });

        const pinMatch = await bcrypt.compare(currentPin, user[0].pin);
        if (!pinMatch) return res.status(401).json({ error: 'Incorrect PIN' });

        const hashedNewPin = await bcrypt.hash(newPin, 10);
        await db.query('UPDATE users SET pin = ? WHERE id = ?', [hashedNewPin, userId]);
        res.json({ success: true });
    } catch (error) {
        console.error('PIN reset failed:', error);
        res.status(500).json({ error: 'PIN reset failed' });
    }
};

exports.getUser = async (req, res) => {
    try {
        const [user] = await db.query(
            `SELECT id, name, email, phone, 
             account_number AS account, 
             face_id AS faceImage, 
             balance 
             FROM users WHERE id = ?`,
            [req.userId]
        );

        if (!user.length) return res.status(404).json({ error: 'User not found' });
        res.json(user[0]);
    } catch (error) {
        console.error('User fetch error:', error);
        res.status(500).json({ error: 'Failed to fetch user data' });
    }
};

console.log(AuthController);

