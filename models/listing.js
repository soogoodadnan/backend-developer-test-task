const db = require('../config/database');

class Listing {
  static async create(listingData) {
    const { title, city, price, bedrooms, agentId } = listingData;
    const sql = `INSERT INTO listings (title, city, price, bedrooms, agentId) 
                 VALUES (?, LOWER(?), ?, ?, ?)`;
    const result = await db.query(sql, [title, city, price, bedrooms, agentId]);
    return this.findById(result.insertId);
  }

  static async findAll() {
    const sql = `SELECT id, title, 
                 CONCAT(UPPER(SUBSTRING(city, 1, 1)), SUBSTRING(LOWER(city), 2)) as city,
                 ROUND(price, 2) as price, 
                 bedrooms, agentId 
                 FROM listings 
                 ORDER BY id`;
    return db.query(sql);
  }

  static async findById(id) {
    const sql = `SELECT id, title, 
                 CONCAT(UPPER(SUBSTRING(city, 1, 1)), SUBSTRING(LOWER(city), 2)) as city,
                 ROUND(price, 2) as price, 
                 bedrooms, agentId 
                 FROM listings 
                 WHERE id = ?`;
    const results = await db.query(sql, [id]);
    return results[0] || null;
  }

  static async update(id, listingData) {
    const { title, city, price, bedrooms, agentId } = listingData;
    const sql = `UPDATE listings 
                 SET title = ?, city = LOWER(?), price = ?, bedrooms = ?, agentId = ? 
                 WHERE id = ?`;
    await db.query(sql, [title, city, price, bedrooms, agentId, id]);
    return this.findById(id);
  }

  static async delete(id) {
    const sql = `DELETE FROM listings WHERE id = ?`;
    const result = await db.query(sql, [id]);
    return result.affectedRows > 0;
  }
}

module.exports = Listing;

