const mongoose = require('mongoose');

const LogSchema = new mongoose.Schema({
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    note: { type: String, required: true },
    type: {
        type: String,
        enum: ['hazard', 'sos', 'nav'],
        required: true,
    },
    timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Log', LogSchema);