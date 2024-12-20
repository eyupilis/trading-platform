const logger = require('../utils/logger');
const axios = require('axios');
const { sequelize } = require('../models');

// API endpoints
const BINANCE_API_BASE = 'https://api.binance.com/api/v3';
const TRADINGVIEW_API_BASE = 'https://scanner.tradingview.com/crypto/scan';
const NEWS_API_BASE = 'https://cryptopanic.com/api/v1';

// Market verilerini getir
const getMarkets = async (req, res) => {
    try {
        const { limit = 20, offset = 0, sort = 'volume', order = 'desc' } = req.query;

        // Binance'den tüm market verilerini al
        const response = await axios.get(`${BINANCE_API_BASE}/ticker/24hr`);
        
        // Verileri işle ve sırala
        let markets = response.data.map(item => ({
            symbol: item.symbol,
            lastPrice: parseFloat(item.lastPrice),
            priceChange: parseFloat(item.priceChange),
            priceChangePercent: parseFloat(item.priceChangePercent),
            volume: parseFloat(item.volume),
            quoteVolume: parseFloat(item.quoteVolume),
            high: parseFloat(item.highPrice),
            low: parseFloat(item.lowPrice)
        }));

        // Sıralama uygula
        markets.sort((a, b) => {
            const multiplier = order === 'desc' ? -1 : 1;
            return multiplier * (a[sort] - b[sort]);
        });

        // Pagination uygula
        markets = markets.slice(offset, offset + limit);

        res.json({
            success: true,
            data: markets,
            pagination: {
                total: markets.length,
                limit,
                offset
            }
        });
    } catch (error) {
        logger.error('Error fetching markets:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch markets' });
    }
};

// Market detayını getir
const getMarketDetail = async (req, res) => {
    try {
        const { symbol } = req.params;

        // Binance'den market detayını al
        const [ticker, depth] = await Promise.all([
            axios.get(`${BINANCE_API_BASE}/ticker/24hr`, { params: { symbol } }),
            axios.get(`${BINANCE_API_BASE}/depth`, { params: { symbol, limit: 5 } })
        ]);

        const marketDetail = {
            symbol: ticker.data.symbol,
            lastPrice: parseFloat(ticker.data.lastPrice),
            priceChange: parseFloat(ticker.data.priceChange),
            priceChangePercent: parseFloat(ticker.data.priceChangePercent),
            high24h: parseFloat(ticker.data.highPrice),
            low24h: parseFloat(ticker.data.lowPrice),
            volume24h: parseFloat(ticker.data.volume),
            quoteVolume24h: parseFloat(ticker.data.quoteVolume),
            openPrice: parseFloat(ticker.data.openPrice),
            closePrice: parseFloat(ticker.data.lastPrice),
            orderBook: {
                bids: depth.data.bids.slice(0, 5),
                asks: depth.data.asks.slice(0, 5)
            }
        };

        res.json({ success: true, data: marketDetail });
    } catch (error) {
        logger.error('Error fetching market detail:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch market detail' });
    }
};

// Order book verilerini getir
const getOrderBook = async (req, res) => {
    try {
        const { symbol } = req.params;
        const { limit = 100 } = req.query;

        const response = await axios.get(`${BINANCE_API_BASE}/depth`, {
            params: { symbol, limit }
        });

        const orderBook = {
            lastUpdateId: response.data.lastUpdateId,
            bids: response.data.bids.map(([price, quantity]) => ({
                price: parseFloat(price),
                quantity: parseFloat(quantity)
            })),
            asks: response.data.asks.map(([price, quantity]) => ({
                price: parseFloat(price),
                quantity: parseFloat(quantity)
            }))
        };

        res.json({ success: true, data: orderBook });
    } catch (error) {
        logger.error('Error fetching order book:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch order book' });
    }
};

// Son işlemleri getir
const getRecentTrades = async (req, res) => {
    try {
        const { symbol } = req.params;
        const { limit = 100 } = req.query;

        const response = await axios.get(`${BINANCE_API_BASE}/trades`, {
            params: { symbol, limit }
        });

        const trades = response.data.map(trade => ({
            id: trade.id,
            price: parseFloat(trade.price),
            quantity: parseFloat(trade.qty),
            time: new Date(trade.time),
            isBuyerMaker: trade.isBuyerMaker,
            isBestMatch: trade.isBestMatch
        }));

        res.json({ success: true, data: trades });
    } catch (error) {
        logger.error('Error fetching recent trades:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch recent trades' });
    }
};

// Teknik analiz verilerini getir
const getTechnicalAnalysis = async (req, res) => {
    try {
        const { symbol } = req.params;
        const { indicators = ['RSI', 'MACD', 'MA'] } = req.query;

        // TradingView'dan teknik analiz verilerini al
        const response = await axios.post(TRADINGVIEW_API_BASE, {
            symbols: { tickers: [`BINANCE:${symbol}`] },
            columns: indicators.map(ind => `TECH|${ind}`)
        });

        const analysis = {
            symbol,
            indicators: response.data.data[0].d
        };

        res.json({ success: true, data: analysis });
    } catch (error) {
        logger.error('Error fetching technical analysis:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch technical analysis' });
    }
};

// Teknik göstergeleri getir
const getTechnicalIndicators = async (req, res) => {
    try {
        const { symbol } = req.params;
        const { indicator, period = 14 } = req.query;

        // TradingView'dan gösterge verilerini al
        const response = await axios.post(TRADINGVIEW_API_BASE, {
            symbols: { tickers: [`BINANCE:${symbol}`] },
            columns: [`TECH|${indicator}|${period}`]
        });

        const indicators = {
            symbol,
            indicator,
            period,
            value: response.data.data[0].d[0]
        };

        res.json({ success: true, data: indicators });
    } catch (error) {
        logger.error('Error fetching technical indicators:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch technical indicators' });
    }
};

// Fiyat verilerini getir
const getPrice = async (req, res) => {
    try {
        const { symbol } = req.params;

        const response = await axios.get(`${BINANCE_API_BASE}/ticker/price`, {
            params: { symbol }
        });

        const price = {
            symbol: response.data.symbol,
            price: parseFloat(response.data.price)
        };

        res.json({ success: true, data: price });
    } catch (error) {
        logger.error('Error fetching price:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch price' });
    }
};

// Fiyat geçmişini getir
const getPriceHistory = async (req, res) => {
    try {
        const { symbol } = req.params;
        const { interval = '1h', limit = 100, startTime, endTime } = req.query;

        const response = await axios.get(`${BINANCE_API_BASE}/klines`, {
            params: { symbol, interval, limit, startTime, endTime }
        });

        const history = response.data.map(k => ({
            openTime: k[0],
            open: parseFloat(k[1]),
            high: parseFloat(k[2]),
            low: parseFloat(k[3]),
            close: parseFloat(k[4]),
            volume: parseFloat(k[5]),
            closeTime: k[6],
            quoteVolume: parseFloat(k[7]),
            trades: k[8]
        }));

        res.json({ success: true, data: history });
    } catch (error) {
        logger.error('Error fetching price history:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch price history' });
    }
};

// OHLCV verilerini getir
const getOHLCV = async (req, res) => {
    try {
        const { symbol } = req.params;
        const { interval = '1h', limit = 100 } = req.query;

        const response = await axios.get(`${BINANCE_API_BASE}/klines`, {
            params: { symbol, interval, limit }
        });

        const ohlcv = response.data.map(k => ({
            timestamp: k[0],
            open: parseFloat(k[1]),
            high: parseFloat(k[2]),
            low: parseFloat(k[3]),
            close: parseFloat(k[4]),
            volume: parseFloat(k[5])
        }));

        res.json({ success: true, data: ohlcv });
    } catch (error) {
        logger.error('Error fetching OHLCV data:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch OHLCV data' });
    }
};

// Haberleri getir
const getNews = async (req, res) => {
    try {
        const { limit = 20, offset = 0, category = 'market' } = req.query;

        const response = await axios.get(`${NEWS_API_BASE}/posts/`, {
            params: {
                limit,
                offset,
                currencies: 'BTC,ETH',
                filter: category
            }
        });

        const news = response.data.results.map(item => ({
            id: item.id,
            title: item.title,
            url: item.url,
            source: item.source.title,
            category: item.categories[0],
            published_at: item.published_at
        }));

        res.json({
            success: true,
            data: news,
            pagination: {
                total: response.data.count,
                limit,
                offset
            }
        });
    } catch (error) {
        logger.error('Error fetching news:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch news' });
    }
};

// Haber detayını getir
const getNewsDetail = async (req, res) => {
    try {
        const { id } = req.params;

        const response = await axios.get(`${NEWS_API_BASE}/posts/${id}/`);

        const newsDetail = {
            id: response.data.id,
            title: response.data.title,
            content: response.data.content,
            url: response.data.url,
            source: response.data.source.title,
            author: response.data.author,
            published_at: response.data.published_at,
            categories: response.data.categories
        };

        res.json({ success: true, data: newsDetail });
    } catch (error) {
        logger.error('Error fetching news detail:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch news detail' });
    }
};

// Etkinlikleri getir
const getEvents = async (req, res) => {
    try {
        const { limit = 20, offset = 0, type = 'all' } = req.query;

        // TODO: Implement events API integration
        const events = [];

        res.json({
            success: true,
            data: events,
            pagination: {
                total: events.length,
                limit,
                offset
            }
        });
    } catch (error) {
        logger.error('Error fetching events:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch events' });
    }
};

// Ekonomik takvimi getir
const getCalendar = async (req, res) => {
    try {
        const { startDate, endDate, importance = 'all', country } = req.query;

        // TODO: Implement economic calendar API integration
        const calendar = [];

        res.json({ success: true, data: calendar });
    } catch (error) {
        logger.error('Error fetching calendar:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch calendar' });
    }
};

// TradingView verilerini getir
const getTradingViewData = async (req, res) => {
    try {
        const { symbol } = req.params;

        // TradingView'dan veri al
        const response = await axios.post(TRADINGVIEW_API_BASE, {
            symbols: { tickers: [`BINANCE:${symbol}`] },
            columns: ['Recommend.All', 'Recommend.MA', 'Recommend.Other', 'Volatility.D', 'ROC', 'RSI']
        });

        const data = {
            symbol,
            recommendations: {
                all: response.data.data[0].d[0],
                ma: response.data.data[0].d[1],
                other: response.data.data[0].d[2]
            },
            volatility: response.data.data[0].d[3],
            roc: response.data.data[0].d[4],
            rsi: response.data.data[0].d[5]
        };

        res.json({ success: true, data });
    } catch (error) {
        logger.error('Error fetching TradingView data:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch TradingView data' });
    }
};

// TradingView grafik verilerini getir
const getTradingViewChart = async (req, res) => {
    try {
        const { symbol } = req.params;

        // TradingView'dan grafik verilerini al
        const response = await axios.post(TRADINGVIEW_API_BASE, {
            symbols: { tickers: [`BINANCE:${symbol}`] },
            columns: ['time', 'open', 'high', 'low', 'close', 'volume']
        });

        const chartData = response.data.data[0].d.map(point => ({
            time: point[0],
            open: point[1],
            high: point[2],
            low: point[3],
            close: point[4],
            volume: point[5]
        }));

        res.json({ success: true, data: chartData });
    } catch (error) {
        logger.error('Error fetching TradingView chart:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch TradingView chart' });
    }
};

// Kripto piyasalarını getir
const getCryptoMarkets = async (req, res) => {
    try {
        // Binance'den tüm kripto piyasalarını al
        const response = await axios.get(`${BINANCE_API_BASE}/ticker/24hr`);

        const markets = response.data
            .filter(item => item.symbol.endsWith('USDT')) // Sadece USDT çiftlerini al
            .map(item => ({
                symbol: item.symbol,
                lastPrice: parseFloat(item.lastPrice),
                priceChange: parseFloat(item.priceChange),
                priceChangePercent: parseFloat(item.priceChangePercent),
                volume: parseFloat(item.volume),
                quoteVolume: parseFloat(item.quoteVolume),
                high: parseFloat(item.highPrice),
                low: parseFloat(item.lowPrice)
            }));

        res.json({ success: true, data: markets });
    } catch (error) {
        logger.error('Error fetching crypto markets:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch crypto markets' });
    }
};

// Kripto fiyatını getir
const getCryptoPrice = async (req, res) => {
    try {
        const { symbol } = req.params;

        const response = await axios.get(`${BINANCE_API_BASE}/ticker/price`, {
            params: { symbol: `${symbol}USDT` }
        });

        const price = {
            symbol: response.data.symbol,
            price: parseFloat(response.data.price)
        };

        res.json({ success: true, data: price });
    } catch (error) {
        logger.error('Error fetching crypto price:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch crypto price' });
    }
};

// Kripto fiyat geçmişini getir
const getCryptoPriceHistory = async (req, res) => {
    try {
        const { symbol } = req.params;
        const { interval = '1d', limit = 30 } = req.query;

        const response = await axios.get(`${BINANCE_API_BASE}/klines`, {
            params: {
                symbol: `${symbol}USDT`,
                interval,
                limit
            }
        });

        const history = response.data.map(k => ({
            time: k[0],
            open: parseFloat(k[1]),
            high: parseFloat(k[2]),
            low: parseFloat(k[3]),
            close: parseFloat(k[4]),
            volume: parseFloat(k[5]),
            closeTime: k[6],
            quoteVolume: parseFloat(k[7]),
            trades: k[8]
        }));

        res.json({ success: true, data: history });
    } catch (error) {
        logger.error('Error fetching crypto price history:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch crypto price history' });
    }
};

module.exports = {
    getMarkets,
    getMarketDetail,
    getOrderBook,
    getRecentTrades,
    getTechnicalAnalysis,
    getTechnicalIndicators,
    getPrice,
    getPriceHistory,
    getOHLCV,
    getNews,
    getNewsDetail,
    getEvents,
    getCalendar,
    getTradingViewData,
    getTradingViewChart,
    getCryptoMarkets,
    getCryptoPrice,
    getCryptoPriceHistory
};
