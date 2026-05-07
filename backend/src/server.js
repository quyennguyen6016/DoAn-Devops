require('dotenv').config();
const express = require('express');

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware parse JSON (cần cho POST/PUT sau này)
app.use(express.json());

// ROUTE HEALTH CHECK
app.get('/api/health' , (req, res) => {
    res.json({ ok: true});
});

// Route gốc để kiểm tra nhanh
app.get('/', (req, res) => {
    res.send('Order Tracking System Backend is running');
  });
  
  // === START SERVER ===
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });