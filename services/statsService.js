const { getDb } = require('../config/mongodb');

class StatsService {
  /**
   * Get active agents statistics using MongoDB aggregation pipeline
   * Returns statistics for active agents including:
   * - Agent name
   * - Total listings (priced above 300,000)
   * - Total views across their listings
   * - Includes agents with 0 listings or 0 views
   * - Sorted by totalViews descending
   */
  static async getActiveAgentsStats() {
    const db = await getDb();
    const agentsCollection = db.collection('agents');

    // MongoDB aggregation pipeline
    const pipeline = [
      // Stage 1: Match only active agents
      {
        $match: {
          active: true
        }
      },
      
      // Stage 2: Lookup listings for this agent with price > 300000
      {
        $lookup: {
          from: 'listings',
          let: { agentId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$agentId', '$$agentId'] },
                    { $gt: ['$price', 300000] }
                  ]
                }
              }
            }
          ],
          as: 'listings'
        }
      },
      
      // Stage 3: Lookup views for the filtered listings
      {
        $lookup: {
          from: 'views',
          let: { listingIds: '$listings._id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $in: ['$listingId', '$$listingIds']
                }
              }
            }
          ],
          as: 'views'
        }
      },
      
      // Stage 4: Calculate totals and format output
      {
        $project: {
          _id: 0,
          agent: '$name',
          listings: {
            $size: '$listings'
          },
          totalViews: {
            $sum: '$views.views'
          }
        }
      },
      
      // Stage 5: Sort by totalViews descending
      {
        $sort: {
          totalViews: -1
        }
      }
    ];

    // Execute aggregation pipeline
    const stats = await agentsCollection.aggregate(pipeline).toArray();

    return stats;
  }
}

module.exports = StatsService;

