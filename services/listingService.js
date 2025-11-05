const Listing = require('../models/listing');

class ListingService {
  /**
   * Validate listing data
   * @param {Object} listingData - Listing data to validate
   * @param {boolean} isUpdate - Whether this is an update operation
   */
  static validateListingData(listingData, isUpdate = false) {
    const { title, city, price, bedrooms, agentId } = listingData;

    // For create, all fields are required
    if (!isUpdate) {
      if (!title || !city || price === undefined || bedrooms === undefined || !agentId) {
        return {
          isValid: false,
          error: 'Missing required fields: title, city, price, bedrooms, agentId'
        };
      }
    }

    // Validate price
    if (price !== undefined) {
      if (typeof price !== 'number' || price < 0) {
        return {
          isValid: false,
          error: 'Price must be a positive number'
        };
      }
    }

    // Validate bedrooms
    if (bedrooms !== undefined) {
      if (typeof bedrooms !== 'number' || bedrooms < 0 || !Number.isInteger(bedrooms)) {
        return {
          isValid: false,
          error: 'Bedrooms must be a non-negative integer'
        };
      }
    }

    return { isValid: true, error: null };
  }

  /**
   * Validate listing ID
   * @param {string|number} id - ID to validate
   */
  static validateId(id) {
    const parsedId = parseInt(id);
    return isNaN(parsedId) ? null : parsedId;
  }

  /**
   * Get all listings
   * @returns {Promise<Array>}
   */
  static async getAllListings() {
    return await Listing.findAll();
  }

  /**
   * Get listing by ID
   * @param {number} id - Listing ID
   */
  static async getListingById(id) {
    const validatedId = this.validateId(id);
    if (!validatedId) {
      throw new Error('Invalid listing ID');
    }
    return await Listing.findById(validatedId);
  }

  /**
   * Create a new listing
   * @param {Object} listingData - Listing data
   */
  static async createListing(listingData) {
    const validation = this.validateListingData(listingData, false);
    if (!validation.isValid) {
      throw new Error(validation.error);
    }

    return await Listing.create(listingData);
  }

  /**
   * Update an existing listing
   * @param {number} id - Listing ID
   * @param {Object} listingData - Updated listing data
   */
  static async updateListing(id, listingData) {
    const validatedId = this.validateId(id);
    if (!validatedId) {
      throw new Error('Invalid listing ID');
    }

    // Check if listing exists
    const existingListing = await Listing.findById(validatedId);
    if (!existingListing) {
      throw new Error('Listing not found');
    }

    // Validate update data
    const validation = this.validateListingData(listingData, true);
    if (!validation.isValid) {
      throw new Error(validation.error);
    }

    return await Listing.update(validatedId, listingData);
  }

  /**
   * Delete a listing
   * @param {number} id - Listing ID
   */
  static async deleteListing(id) {
    const validatedId = this.validateId(id);
    if (!validatedId) {
      throw new Error('Invalid listing ID');
    }

    const deleted = await Listing.delete(validatedId);
    if (!deleted) {
      throw new Error('Listing not found');
    }

    return true;
  }
}

module.exports = ListingService;

