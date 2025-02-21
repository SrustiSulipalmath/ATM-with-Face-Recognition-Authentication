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