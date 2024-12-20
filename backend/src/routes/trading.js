const express = require('express');
const { validateRequest } = require('../middleware/validation');
const { tradingController } = require('../controllers/trading');
const { tradingSchema } = require('../validators/trading');

const router = express.Router();

// Positions
router.post('/positions', validateRequest(tradingSchema.createPosition), tradingController.createPosition);
router.get('/positions', tradingController.getPositions);
router.get('/positions/:id', tradingController.getPosition);
router.put('/positions/:id', validateRequest(tradingSchema.updatePosition), tradingController.updatePosition);
router.delete('/positions/:id', tradingController.closePosition);

// Take profit & Stop loss
router.post('/positions/:id/take-profit', validateRequest(tradingSchema.setTakeProfit), tradingController.setTakeProfit);
router.post('/positions/:id/stop-loss', validateRequest(tradingSchema.setStopLoss), tradingController.setStopLoss);

// History
router.get('/history', tradingController.getTradeHistory);
router.get('/positions/:id/history', tradingController.getPositionHistory);

// Statistics
router.get('/statistics', tradingController.getStatistics);
router.get('/performance', tradingController.getPerformanceMetrics);

// Watchlist
router.get('/watchlist', tradingController.getWatchlist);
router.post('/watchlist', validateRequest(tradingSchema.addToWatchlist), tradingController.addToWatchlist);
router.delete('/watchlist/:symbol', tradingController.removeFromWatchlist);

module.exports = router;
