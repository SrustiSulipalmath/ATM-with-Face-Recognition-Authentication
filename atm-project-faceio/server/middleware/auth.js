// const jwt = require('jsonwebtoken');

// module.exports = (req, res, next) => {
//   const token = req.headers.authorization?.split(' ')[1];
  
//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.userId = decoded.userId;
//     next();
//   } catch (error) {
//     res.status(401).json({ error: 'Unauthorized' });
//   }
// };

const jwt = require('jsonwebtoken');

// exports.authMiddleware = (req, res, next) => {
//     const token = req.headers.authorization?.split(' ')[1];
    
//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         req.userId = decoded.userId;
//         next();
//     } catch (error) {
//         res.status(401).json({ error: 'Unauthorized' });
//     }
// };

// In authMiddleware.js
exports.authMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Unauthorized' });
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
};

exports.validateRegistration = (req, res, next) => {
    const { phone, pin, email } = req.body;
    
    if (!/^\d{10}$/.test(phone)) {
        return res.status(400).json({ error: 'Invalid phone number' });
    }
    
    if (!/^\d{4}$/.test(pin)) {
        return res.status(400).json({ error: 'PIN must be 4 digits' });
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ error: 'Invalid email format' });
    }
    
    next();
};

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'login.html';
}

