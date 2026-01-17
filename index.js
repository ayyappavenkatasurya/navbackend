require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression'); // Added
const mongoSanitize = require('express-mongo-sanitize');
const connectDB = require('./config/db');

connectDB();
const app = express();

app.use(express.json());
app.use(helmet());
app.use(mongoSanitize());
app.use(compression()); // Compress all responses (GZIP)

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || origin.startsWith('http://localhost') || origin.startsWith('http://192.168.')) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    }
}));

app.get('/', (req, res) => res.send('VisionAI API Ready'));
app.use('/api', require('./routes/apiRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => console.log(`🚀 Server on port ${PORT}`));