const express = require('express');
const router = express.Router();
const authRoutes = require('./auth');
const signalsRoutes = require('./signals');

router.use('/auth', authRoutes);
router.use('/signals', signalsRoutes);

module.exports = router;
