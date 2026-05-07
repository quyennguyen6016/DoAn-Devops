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

// Lấy chi tiết đơn hàng theo ID
const getOrderById = (req, res) => {
    try {
        const { id } = req.params;
        const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(id);
        if(!order) {
            return res.status(404).json({ error: 'Order not found' });
        }
        res.json(order);
    } catch (error) {
        console.error('Error fetching order:', error);
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

// PUT update status 
const updateOrderStatus = (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        // validate status
        const allowedStatus = ['pending', 'processing', 'shipping', 'completed', 'cancelled'];
        if(!status || !allowedStatus.includes(status)) {
            return res.status(400).json({ error: `Invalid status. Allowed: ${allowedStatus.join(', ')}` });
        }

        // kiểm tra order có tồn tại không
        const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(id);
        if(!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        const stmt = db.prepare('UPDATE orders SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?');
        stmt.run(status, id);

        // quay lại cập nhật order
        const updatedOrder = db.prepare('SELECT * FROM orders WHERE id = ?').get(id);
        res.json(updatedOrder);    
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Xóa đơn hàng
const deleteOrder = (req, res) => {
    try {
        const { id } = req.params;
        const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(id);
        if(!order) {
            return res.status(404).json({ error: 'Order not found' });
        }
        db.prepare('DELETE FROM orders WHERE id = ?').run(id);
        res.json({ message: 'Order deleted successfully' });
    } catch (error) {
        console.error('Error deleting order:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


module.exports = {
    getAllOrders,
    getOrderById,
    createOrder,
    updateOrderStatus,
    deleteOrder
};