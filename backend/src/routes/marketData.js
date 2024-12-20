const express = require('express');
const { validateRequest } = require('../middleware/validation');
const marketDataController = require('../controllers/marketData');
const { marketDataSchema } = require('../validators/marketData');
const { auth } = require('../middleware/auth');
const logger = require('../utils/logger');
const axios = require('axios');

const router = express.Router();

// TradingView data
router.get('/tradingview/:symbol', marketDataController.getTradingViewData);
router.get('/tradingview/:symbol/chart', marketDataController.getTradingViewChart);
router.get('/tradingview/indicators/:symbol', marketDataController.getTechnicalIndicators);

// Market data endpoints
router.get('/markets', auth, marketDataController.getMarkets);
router.get('/markets/:symbol', auth, marketDataController.getMarketDetail);
router.get('/markets/:symbol/orderbook', auth, marketDataController.getOrderBook);
router.get('/markets/:symbol/trades', auth, marketDataController.getRecentTrades);

// Technical analysis endpoints
router.get('/analysis/:symbol', auth, marketDataController.getTechnicalAnalysis);
router.get('/analysis/:symbol/indicators', auth, marketDataController.getTechnicalIndicators);

// Price data endpoints
router.get('/price/:symbol', auth, marketDataController.getPrice);
router.get('/price/:symbol/history', auth, marketDataController.getPriceHistory);
router.get('/price/:symbol/ohlcv', auth, marketDataController.getOHLCV);

// Market news and events
router.get('/news', auth, marketDataController.getNews);
router.get('/news/:id', auth, marketDataController.getNewsDetail);
router.get('/events', auth, marketDataController.getEvents);
router.get('/calendar', auth, marketDataController.getCalendar);

// Cryptocurrency specific
router.get('/crypto/markets', marketDataController.getCryptoMarkets);
router.get('/crypto/:symbol/price', marketDataController.getCryptoPrice);
router.get('/crypto/:symbol/history', marketDataController.getCryptoPriceHistory);

// Binance API için temel URL (ücretsiz, API key gerektirmez)
const BINANCE_API_URL = 'https://api.binance.com/api/v3';

// CryptoCompare API için temel URL (ücretsiz, API key gerektirmez)
const CRYPTOCOMPARE_API_URL = 'https://min-api.cryptocompare.com/data/v2';

// CryptoPanic API için temel URL (ücretsiz haberler)
const CRYPTOPANIC_API_URL = 'https://cryptopanic.com/api/v1';

// Market verileri endpoint'i
router.get('/prices', auth, async (req, res) => {
    try {
        const response = await axios.get(`${BINANCE_API_URL}/ticker/24hr`);
        const marketData = response.data.map(item => ({
            symbol: item.symbol,
            price: item.lastPrice,
            priceChange: item.priceChange,
            priceChangePercent: item.priceChangePercent,
            volume: item.volume,
            high: item.highPrice,
            low: item.lowPrice
        }));
        
        res.json(marketData);
    } catch (error) {
        logger.error('Error fetching market data:', error);
        res.status(500).json({ message: 'Error fetching market data' });
    }
});

// Detaylı market verileri endpoint'i
router.get('/market/:symbol', auth, async (req, res) => {
    try {
        const { symbol } = req.params;
        const response = await axios.get(`${CRYPTOCOMPARE_API_URL}/coin/generalinfo`, {
            params: {
                fsyms: symbol,
                tsym: 'USD'
            }
        });
        
        res.json(response.data.Data);
    } catch (error) {
        logger.error('Error fetching market details:', error);
        res.status(500).json({ message: 'Error fetching market details' });
    }
});

// Kripto haberleri endpoint'i
router.get('/crypto-news', auth, async (req, res) => {
    try {
        const response = await axios.get(`${CRYPTOPANIC_API_URL}/posts`, {
            params: {
                auth_token: process.env.CRYPTOPANIC_API_KEY, // Ücretsiz API key
                public: true,
                kind: 'news'
            }
        });
        
        const news = response.data.results.map(item => ({
            title: item.title,
            url: item.url,
            source: item.source.title,
            published_at: item.published_at,
            currencies: item.currencies?.map(c => c.code) || []
        }));
        
        res.json(news);
    } catch (error) {
        logger.error('Error fetching news:', error);
        res.status(500).json({ message: 'Error fetching news' });
    }
});

module.exports = router;
