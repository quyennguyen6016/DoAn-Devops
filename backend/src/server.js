require('dotenv').config();
const express = require('express');
const orderRoutes = require('./routes/orderRoutes');

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware parse JSON (cần cho POST/PUT sau này)
app.use(express.json());

// ROUTE HEALTH CHECK
app.get('/api/health' , (req, res) => {
    res.json({ ok: true});
});

// Order routes
app.use('/api/orders', orderRoutes);

// Route gốc để kiểm tra nhanh
app.get('/', (req, res) => {
    res.send('Order Tracking System Backend is running');
  });

// Error handling middleware (sẽ hoàn thiện sau)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
  });
  
  // === START SERVER ===
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });