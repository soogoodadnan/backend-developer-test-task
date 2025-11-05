const express = require('express');
const router = express.Router();
const StatsController = require('../controllers/statsController');

/**
 * @route   GET /stats/active-agents
 * @desc    Get statistics for active agents
 * @note    Returns active agents with listings count and total views
 *          Only includes listings priced above 300,000
 *          Includes agents with 0 listings or 0 views
 *          Sorted by totalViews descending
 */

router.get('/active-agents', StatsController.getActiveAgentsStats);

module.exports = router;
