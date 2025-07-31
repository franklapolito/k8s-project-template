const express = require('express');
const { Pool } = require('pg');

// --- Database Connection ---
// Explicitly tell the Pool to use the connection string from the environment
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

// Test the database connection on startup
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('🔴 Database connection error:', err.stack);
  } else {
    console.log('🟢 Database connected successfully at:', res.rows[0].now);
  }
});

const app = express();

// --- Middleware ---
app.use(express.json()); // To parse JSON bodies

// --- API Routes ---
// Note: The route is '/reports' because the '/api' prefix is handled by the frontend proxy
app.post('/reports', async (req, res) => {
  const { userId, productId, storeId, price } = req.body;

  if (!userId || !productId || !storeId || !price) {
    return res.status(400).json({ msg: 'Please provide all required fields.' });
  }

  try {
    const queryText = `
      INSERT INTO price_reports (user_id, product_id, store_id, price)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const values = [userId, productId, storeId, price];
    const newReport = await pool.query(queryText, values);

    console.log('✅ Successfully inserted new price report:', newReport.rows[0]);
    res.status(201).json({
        msg: 'Price report submitted successfully!',
        report: newReport.rows[0],
    });

  } catch (err) {
    console.error('🔴 Error submitting price report:', err.stack);
    res.status(500).send('Server Error');
  }
});

// Add this GET route below the app.post('/reports', ...) route

app.get('/reports', async (req, res) => {
  // Get search parameters from the query string
  const { productName, lat, lng } = req.query;

  if (!productName || !lat || !lng) {
    return res.status(400).json({ msg: 'Please provide productName, lat, and lng parameters.' });
  }

  try {
    // This PostGIS query finds stores within a 5-mile radius (8046 meters)
    // that have the specified product, ordering by the cheapest price first.
    const query = `
      SELECT
        r.report_id,
        r.price,
        r.created_at,
        s.store_name,
        s.address,
        ST_X(s.location::geometry) as lng,
        ST_Y(s.location::geometry) as lat
      FROM price_reports r
      JOIN stores s ON r.store_id = s.store_id
      JOIN products p ON r.product_id = p.product_id
      WHERE p.product_name = $1 AND ST_DWithin(
        s.location,
        ST_MakePoint($3, $2)::geography,
        8046 -- Radius in meters (~5 miles)
      )
      ORDER BY r.price ASC;
    `;

    const values = [productName, lat, lng];
    const { rows } = await pool.query(query, values);
    res.json(rows);

  } catch (err) {
    console.error('🔴 Error fetching price reports:', err.stack);
    res.status(500).send('Server Error');
  }
});

module.exports = app;