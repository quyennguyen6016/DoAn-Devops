require('dotenv').config();
const express = require('express');
const cors = require('cors');
const orderRoutes = require('./routes/orderRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 4000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// CORS middleware
app.use(cors({
    origin: FRONTEND_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

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

// Error handling middleware
app.use(errorHandler);
  
  // === START SERVER ===
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Frontend URL: ${FRONTEND_URL}`);
  });