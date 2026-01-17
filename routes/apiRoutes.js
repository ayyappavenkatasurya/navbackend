const express = require('express');
const { logHazard, sendSOS } = require('../controllers/logController');
const { validateApiKey } = require('../middleware/security');
const router = express.Router();

// Apply security to all routes
router.use(validateApiKey);

router.post('/log-hazard', logHazard);
router.post('/sos', sendSOS);

module.exports = router;