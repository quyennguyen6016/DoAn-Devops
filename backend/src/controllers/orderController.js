const db  = require('../config/db');

// lấy danh sách tất cả đơn hàng
const getAllOrders = (req, res) => {
    try {
        const orders = db.prepare('SELECT * FROM orders ORDER BY created_at DESC').all();
        res.json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// POST create order
const createOrder = (req, res) => {
    try{
        const { customer_name, phone, product_name, quantity, total_price, status, note } = req.body;
        // validate cơ bản
        if (!customer_name || !product_name || quantity == null || total_price == null) {
            return res.status(400).json({ error: 'Missing required fields : customer_name, product_name, quantity, total_price' });
        } 
        const stmt = db.prepare(`
            INSERT INTO orders (customer_name, phone, product_name, quantity, total_price, status, note)
            VALUES (?, ?, ?, ?, ?, ?, ?)
          `);
          const result = stmt.run(
            customer_name,
            phone || null,
            product_name,
            quantity,
            total_price,
            status || 'pending',
            note || null
          );
          res.status(201).json({
            id: result.lastInsertRowid,
            ...req.body,
            status: status || 'pending',
            created_at: new Date().toISOString()
          });
        } catch (error) {
          console.error('Error creating order:', error.message);
          res.status(500).json({ error: 'Internal server error' });
        }
};
module.exports = {
    getAllOrders,
    createOrder
};