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
app.use(mongoSanitize());

// --- Dynamic CORS for Local Network Testing ---
app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        // Allow localhost, local network IPs (192.168.x.x), and production domains
        if (allowedOrigins.indexOf(origin) !== -1 || 
            origin.startsWith('http://192.168.') || 
            origin.startsWith('http://localhost')) {
            callback(null, true);
        } else {
            console.log("Blocked Origin:", origin);
            callback(new Error('Not allowed by CORS'));
        }
    }
}));

const allowedOrigins = [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    // Add production domain here
];

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200, // Increased slightly for navigation polling
    standardHeaders: true,
    legacyHeaders: false,
});
app.use(limiter);

app.use(morgan('combined', { stream: logger.stream }));

// --- API Routes ---
app.get('/', (req, res) => res.json({ status: "VisionAI API is healthy" }));
app.use('/api', require('./routes/apiRoutes'));

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => logger.info(`🚀 Server running on port ${PORT}`));