// const express = require('express');
// const helmet = require('helmet');
// const rateLimit = require('express-rate-limit');
// const session = require('express-session');
// const cors = require('cors');
// const MySQLStore = require('express-mysql-session')(session);

// const authRoutes = require('./routes/authRoutes');
// const transactionRoutes = require('./routes/transactionRoutes');

// const app = express();

// const sessionStore = new MySQLStore({
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME
// });

// // app.js
// app.use(helmet({
//     contentSecurityPolicy: {
//         directives: {
//             defaultSrc: ["'self'"],
//             scriptSrc: ["'self'", "'unsafe-inline'"],
//             styleSrc: ["'self'", "'unsafe-inline'"],
//             imgSrc: ["'self'", "data:", "https://*.face.io"],
//             connectSrc: ["'self'", "https://api.face.io"]
//         }
//     }
// }));
// // // Add to app.js
// // const transactionRoutes = require('./routes/transactionRoutes');


// // Middlewares
// app.use(helmet());
// app.use(cors({
//     origin: ['http://localhost:3000', 'http://127.0.0.1:5500'],
//     credentials: true
//   }));
// app.use(express.json());
// app.use(session({
//     secret: process.env.SESSION_SECRET,
//     resave: false,
//     saveUninitialized: false,
//     cookie: { secure: process.env.NODE_ENV === 'production' }
// }));

// // Rate limiting
// const limiter = rateLimit({
//     windowMs: 15 * 60 * 1000,
//     max: 100
// });
// app.use(limiter);

// // Routes
// app.use('/api/auth', authRoutes);
// app.use('/api/transaction', transactionRoutes);



// module.exports = app;


const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const session = require('express-session');
const cors = require('cors');
const MySQLStore = require('express-mysql-session')(session);

const authRoutes = require('./routes/authRoutes');
const transactionRoutes = require('./routes/transactionRoutes');

const app = express();

// Session Store for MySQL
const sessionStore = new MySQLStore({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// Security Headers
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", "data:", "https://*.face.io"],
            connectSrc: ["'self'", "https://api.face.io"]
        }
    }
}));

// CORS Configuration
app.use(cors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:5500'],
    credentials: true
}));

app.use(express.json());

// Session Configuration
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: sessionStore,  // Corrected missing session store usage
    cookie: { secure: process.env.NODE_ENV === 'production' }
}));

// Rate limiting to prevent abuse
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100
});
app.use(limiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/transaction', transactionRoutes);

// Global Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

module.exports = app;
