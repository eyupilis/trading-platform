const express = require('express');
const router = express.Router();
const tradesRoutes = require('./trades');

router.use('/trades', tradesRoutes);

module.exports = router;
