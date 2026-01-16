const Joi = require('joi');
const Log = require('../models/Log');
const asyncHandler = require('../middleware/asyncHandler');

// Validation schema for logging a hazard
const hazardSchema = Joi.object({
    lat: Joi.number().required(),
    lng: Joi.number().required(),
    note: Joi.string().min(2).max(50).required(),
});

// Validation schema for an SOS signal
const sosSchema = Joi.object({
    lat: Joi.number().required(),
    lng: Joi.number().required(),
});

// @desc    Log a detected hazard
// @route   POST /api/log-hazard
// @access  Public
exports.logHazard = asyncHandler(async (req, res, next) => {
    const { error, value } = hazardSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    const log = await Log.create({ ...value, type: 'hazard' });
    res.status(201).json({ msg: "Hazard logged successfully", data: log });
});

// @desc    Receive an SOS signal
// @route   POST /api/sos
// @access  Public
exports.sendSOS = asyncHandler(async (req, res, next) => {
    const { error, value } = sosSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    console.log("⚠️ SOS TRIGGERED ⚠️", value);

    const log = await Log.create({
        ...value,
        type: 'sos',
        note: 'SOS Triggered by user',
    });

    // Future enhancement: Integrate with Twilio, SendGrid, etc., to send SMS/email alerts.

    res.status(200).json({ msg: "SOS signal received and logged" });
});