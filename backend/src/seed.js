const db = require('./config/db');

const insertSample = () => {
  const count = db.prepare('SELECT COUNT(*) AS count FROM orders').get().count;
  if (count === 0) {
    const stmt = db.prepare(`
      INSERT INTO orders (customer_name, phone, product_name, quantity, total_price, status, note)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run('Từ Nguyễn Huyền Trang', '0901234567', 'Sách DevOps', 2, 200000, 'pending', 'Giao hàng nhanh');
    stmt.run('Trương Thị Kim Ngân', '0987654321', 'Docker Container', 1, 150000, 'confirmed', null);
    stmt.run('Nguyễn Ngọc Quyền', '0912345678', 'Khóa học CI/CD', 1, 500000, 'shipping', 'Đóng gói cẩn thận');
    console.log('Sample data inserted');
  } else {
    console.log('Database already has data, skipping seed');
  }
};

insertSample();