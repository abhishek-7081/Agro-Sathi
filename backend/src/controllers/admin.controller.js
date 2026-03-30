const marketService = require('../services/market.service');
const { fetchMarketPrices } = require('../../scripts/fetchMarketPrices');

// Admin endpoint to manually trigger market price fetch
exports.triggerManualFetch = async (req, res, next) => {
  try {
    console.log('[Admin] Triggering manual market price fetch...');
    await fetchMarketPrices();
    res.json({ message: 'Market price fetch triggered successfully' });
  } catch (error) {
    console.error('[Admin] Error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get latest prices from database (for testing)
exports.getStoredPrices = async (req, res, next) => {
  try {
    const data = await marketService.getLatestPrices(req.query);
    res.json({ 
      count: data.length, 
      prices: data,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
};

// Get price statistics
exports.getPriceStats = async (req, res, next) => {
  try {
    const data = await marketService.getLatestPrices({ limit: 1000 });
    
    const stats = {
      total_records: data.length,
      commodities: [...new Set(data.map(p => p.commodity))].length,
      states: [...new Set(data.map(p => p.state))].length,
      markets: [...new Set(data.map(p => p.market))].length,
      timestamp: new Date().toISOString()
    };
    
    res.json(stats);
  } catch (error) {
    next(error);
  }
};
