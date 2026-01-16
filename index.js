require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const morgan = require('morgan');

const connectDB = require('./config/db');
const logger = require('./config/logger');
const errorHandler = require('./middleware/errorHandler');

// Connect to Database
connectDB();

const app = express();

// --- Core Middleware ---
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(helmet());

// --- Security Middleware ---
// Sanitize user-supplied data to prevent MongoDB operator injection
app.use(mongoSanitize());

// CORS Configuration
const allowedOrigins = [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    // Add your production domain here: e.g., 'https://your-vision-ai-app.com'
];
app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    }
}));

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
    message: 'Too many requests from this IP, please try again after 15 minutes',
});
app.use(limiter);

// --- Logging ---
// Use morgan to log HTTP requests to the winston logger
app.use(morgan('combined', { stream: logger.stream }));

// --- API Routes ---
app.get('/', (req, res) => res.json({ status: "VisionAI API is healthy" }));
app.use('/api', require('./routes/apiRoutes'));

// --- Error Handler ---
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => logger.info(`🚀 Server running on port ${PORT}`));