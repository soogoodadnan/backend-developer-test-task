const express = require('express');
const router = express.Router();
const ListingsController = require('../controllers/listingsController');

/**
 * @route   GET /listings
 * @desc    Get all listings
 * @access  Public
 */
router.get('/', ListingsController.getAllListings);

/**
 * @route   GET /listings/:id
 * @desc    Get single listing by ID
 * @access  Public
 */
router.get('/:id', ListingsController.getListingById);

/**
 * @route   POST /listings
 * @desc    Create a new listing
 * @access  Public
 */
router.post('/', ListingsController.createListing);

/**
 * @route   PUT /listings/:id
 * @desc    Update an existing listing
 * @access  Public
 */
router.put('/:id', ListingsController.updateListing);

/**
 * @route   DELETE /listings/:id
 * @desc    Delete a listing
 * @access  Public
 */
router.delete('/:id', ListingsController.deleteListing);

module.exports = router;
