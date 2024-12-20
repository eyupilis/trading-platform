const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const logger = require('../utils/logger');

// Apply auth middleware to all private routes
router.use(auth);

// Import protected routes
router.use('/users', require('./users'));
router.use('/signals', require('./signals'));
router.use('/trades', require('./trades'));
router.use('/education', require('./education'));
router.use('/market-data', require('./marketData'));

module.exports = router;
