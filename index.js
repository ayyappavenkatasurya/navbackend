require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Connect to Database
connectDB();

const app = express();

// Set security headers
app.use(helmet());

// Configure CORS for production readiness
const allowedOrigins = [
    'http://localhost:5173', // Vite dev server
    'http://127.0.0.1:5173',
    // Add your production domain here: e.g., 'https://your-vision-ai-app.com'
];

app.use(cors({
    origin: function (origin, callback) {
        // allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    }
}));

// Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// --- API Routes ---
app.get('/', (req, res) => res.json({ status: "VisionAI API is healthy" }));
app.use('/api', require('./routes/apiRoutes'));

// --- Error Handler ---
// This must be the last piece of middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Listen on 0.0.0.0 to be accessible from other devices on the network
app.listen(PORT, '0.0.0.0', () => console.log(`🚀 Server running on port ${PORT}`));