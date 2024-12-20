const axios = require('axios');
const NodeCache = require('node-cache');
const config = require('../config');
const { logger } = require('../utils/logger');

const cache = new NodeCache({ stdTTL: config.cache.ttl });

class TradingViewService {
  constructor() {
    this.api = axios.create({
      baseURL: config.tradingView.baseUrl,
      headers: {
        'Authorization': `Bearer ${config.tradingView.apiKey}`,
        'Content-Type': 'application/json',
      },
    });
  }

  async getChartData(symbol, interval = '1D', limit = 100) {
    const cacheKey = `chart_${symbol}_${interval}_${limit}`;
    const cachedData = cache.get(cacheKey);

    if (cachedData) {
      return cachedData;
    }

    try {
      const response = await this.api.get('/chart', {
        params: {
          symbol,
          interval,
          limit,
        },
      });

      cache.set(cacheKey, response.data);
      return response.data;
    } catch (error) {
      logger.error('TradingView API error:', error);
      throw error;
    }
  }

  async getTechnicalAnalysis(symbol) {
    const cacheKey = `ta_${symbol}`;
    const cachedData = cache.get(cacheKey);

    if (cachedData) {
      return cachedData;
    }

    try {
      const response = await this.api.get('/technical-analysis', {
        params: { symbol },
      });

      cache.set(cacheKey, response.data);
      return response.data;
    } catch (error) {
      logger.error('TradingView Technical Analysis API error:', error);
      throw error;
    }
  }

  async getIndicators(symbol, indicators = ['RSI', 'MACD', 'BB']) {
    const cacheKey = `indicators_${symbol}_${indicators.join('_')}`;
    const cachedData = cache.get(cacheKey);

    if (cachedData) {
      return cachedData;
    }

    try {
      const response = await this.api.get('/indicators', {
        params: {
          symbol,
          indicators: indicators.join(','),
        },
      });

      cache.set(cacheKey, response.data);
      return response.data;
    } catch (error) {
      logger.error('TradingView Indicators API error:', error);
      throw error;
    }
  }

  async getMarketOverview(symbols) {
    const cacheKey = `overview_${symbols.join('_')}`;
    const cachedData = cache.get(cacheKey);

    if (cachedData) {
      return cachedData;
    }

    try {
      const response = await this.api.get('/market-overview', {
        params: {
          symbols: symbols.join(','),
        },
      });

      cache.set(cacheKey, response.data);
      return response.data;
    } catch (error) {
      logger.error('TradingView Market Overview API error:', error);
      throw error;
    }
  }
}

module.exports = new TradingViewService();
