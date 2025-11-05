const ListingService = require('../services/listingService');

class ListingsController {
  /**
   * Get all listings
   * GET /listings
   */
  static async getAllListings(req, res) {
    try {
      const listings = await ListingService.getAllListings();
      res.json(listings);
    } catch (error) {
      console.error('Get all listings error:', error);
      res.status(500).json({ error: true, message: 'Failed to fetch listings' });
    }
  }

  /**
   * Get single listing by ID
   * GET /listings/:id
   */
  static async getListingById(req, res) {
    try {
      const listing = await ListingService.getListingById(req.params.id);
      
      if (!listing) {
        return res.status(404).json({ error: true, message: 'Listing not found' });
      }

      res.json(listing);
    } catch (error) {
      if (error.message === 'Invalid listing ID') {
        return res.status(400).json({ error: true, message: error.message });
      }

      console.error('Get listing by ID error:', error);
      res.status(500).json({ error: true, message: 'Failed to fetch listing' });
    }
  }

  /**
   * Create a new listing
   * POST /listings
   */
  static async createListing(req, res) {
    try {
      const listing = await ListingService.createListing(req.body);
      res.status(201).json(listing);
    } catch (error) {
      if (error.message.includes('Missing required') || 
          error.message.includes('must be')) {
        return res.status(400).json({ error: true, message: error.message });
      }

      console.error('Create listing error:', error);
      res.status(500).json({ error: true, message: 'Failed to create listing' });
    }
  }

  /**
   * Update an existing listing
   * PUT /listings/:id
   */
  static async updateListing(req, res) {
    try {
      const listing = await ListingService.updateListing(req.params.id, req.body);
      res.json(listing);
    } catch (error) {
      if (error.message === 'Invalid listing ID') {
        return res.status(400).json({ error: true, message: error.message });
      }

      if (error.message === 'Listing not found') {
        return res.status(404).json({ error: true, message: error.message });
      }

      if (error.message.includes('must be')) {
        return res.status(400).json({ error: true, message: error.message });
      }

      console.error('Update listing error:', error);
      res.status(500).json({ error: true, message: 'Failed to update listing' });
    }
  }

  /**
   * Delete a listing
   * DELETE /listings/:id
   */
  static async deleteListing(req, res) {
    try {
      await ListingService.deleteListing(req.params.id);
      res.json({ message: 'Listing deleted successfully' });
    } catch (error) {
      if (error.message === 'Invalid listing ID') {
        return res.status(400).json({ error: true, message: error.message });
      }

      if (error.message === 'Listing not found') {
        return res.status(404).json({ error: true, message: error.message });
      }

      console.error('Delete listing error:', error);
      res.status(500).json({ error: true, message: 'Failed to delete listing' });
    }
  }
}

module.exports = ListingsController;

