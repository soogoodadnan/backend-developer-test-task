const express = require('express');
const router = express.Router();

const listingsRoutes = require('./listings');
const statsRoutes = require('./stats');

router.use('/listings', listingsRoutes);
router.use('/stats', statsRoutes);

module.exports = router;

