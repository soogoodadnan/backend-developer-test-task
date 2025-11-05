const StatsService = require('../services/statsService');

class StatsController {
  /**
   * Get active agents statistics
   * GET /stats/active-agents
   */
  static async getActiveAgentsStats(req, res) {
    try {
      const stats = await StatsService.getActiveAgentsStats();
      res.json(stats);
    } catch (error) {
      console.error('Get active agents stats error:', error);
      res.status(500).json({ 
        error: true, 
        message: 'Failed to fetch active agents statistics' 
      });
    }
  }
}

module.exports = StatsController;

