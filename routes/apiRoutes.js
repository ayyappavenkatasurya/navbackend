const express = require('express');
const { logHazard, sendSOS } = require('../controllers/logController');
const router = express.Router();

router.post('/log-hazard', logHazard);
router.post('/sos', sendSOS);

module.exports = router;