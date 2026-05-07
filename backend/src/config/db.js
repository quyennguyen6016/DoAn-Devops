const Database = require('better-sqlite3');
const path = require('path');

// Đường dẫn file database (nằm trong backend/database/orders.db)
const dbPath = path.join(__dirname, '..', '..', 'database', 'orders.db');

// Mở kết nối (tạo file nếu chưa có)
const db = new Database(dbPath, { verbose: console.log });

// Bật chế độ WAL để hiệu năng tốt hơn
db.pragma('journal_mode = WAL');

// Tạo bảng orders nếu chưa tồn tại
db.exec(`
  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    product_name VARCHAR(150) NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    total_price DECIMAL(10,2) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'pending',
    note TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

module.exports = db;