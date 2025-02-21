// // const express = require('express');
// // const router = express.Router();
// // const authController = require('../controllers/authController');
// // const validation = require('../middleware/validation');

// // router.post('/register', 
// //     validation.validateRegistration,
// //     authController.register
// // );

// // router.post('/verify-face', authController.verifyFace);

// // module.exports = router;
// // // Add these routes
// // router.put('/user/reset-face', authMiddleware, authController.resetFace);
// // router.put('/user/reset-pin', authMiddleware, authController.resetPin);
// // router.put('/user/update-username', authMiddleware, authController.updateUsername);
// // router.put('/user/update-email', authMiddleware, authController.updateEmail);
// // router.put('/user/update-phone', authMiddleware, authController.updatePhone);

// // const express = require('express');
// // const router = express.Router();
// // const authController = require('../controllers/authController');

// // router.post('/register', authController.register);
// // router.post('/login', authController.login);
// // router.get('/user', authMiddleware, authController.getUser);

// // module.exports = router;

// const express = require('express');
// const router = express.Router();
// const { authMiddleware } = require('../middleware/auth');
// const { validateRegistration } = require('../middleware/auth');
// const authController = require('../controllers/authController');

// // Public routes
// //router.post('/register', validateRegistration, authController.register);
// router.post('/login', authController.login);

// // Protected routes
// router.put('/user/reset-face', authMiddleware, authController.resetFace);
// router.put('/user/reset-pin', authMiddleware, authController.resetPin);
// router.put('/user/update-username', authMiddleware, authController.updateUsername);
// router.put('/user/update-email', authMiddleware, authController.updateEmail);
// router.put('/user/update-phone', authMiddleware, authController.updatePhone);

// module.exports = router;

// // authRoutes.js
// router.get('/me', authMiddleware, authController.getUser);
// router.post('/verify-face', authController.verifyFace);

const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const { validateRegistration } = require('../middleware/validation'); // Fixed correct import
const authController = require('../controllers/authController');

// Public routes
router.post('/register', validateRegistration, authController.register);
router.post('/login', authController.login);
router.post('/verify-face', authController.verifyFace);

// Protected routes (Requires Authentication)
router.get('/me', authMiddleware, authController.getUser);
router.put('/user/reset-face', authMiddleware, authController.resetFace);
router.put('/user/reset-pin', authMiddleware, authController.resetPin);
router.put('/user/update-username', authMiddleware, authController.updateUsername);
router.put('/user/update-email', authMiddleware, authController.updateEmail);
router.put('/user/update-phone', authMiddleware, authController.updatePhone);

module.exports = router;
