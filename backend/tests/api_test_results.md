# API Test Results - Order Tracking System
# Date: 2026-05-07
# Base URL: http://localhost:4000/api/orders

---

## Test 1: Tạo đơn hàng mới (POST /api/orders)

**Command:**
```
POST /api/orders
Content-Type: application/json

{
  "customer_name": "Test User API",
  "phone": "0123456789",
  "product_name": "API Test Product",
  "quantity": 2,
  "total_price": 500000
}
```

**Response:** `201 Created`
```json
{
  "id": 4,
  "customer_name": "Test User API",
  "phone": "0123456789",
  "product_name": "API Test Product",
  "quantity": 2,
  "total_price": 500000,
  "status": "pending",
  "created_at": "2026-05-07T16:34:45.810Z"
}
```

**Status:** ✅ PASS

---

## Test 2: Lấy danh sách đơn hàng (GET /api/orders)

**Command:**
```
GET /api/orders
```

**Response:** `200 OK`
```json
[
  {
    "id": 4,
    "customer_name": "Test User API",
    "phone": "0123456789",
    "product_name": "API Test Product",
    "quantity": 2,
    "total_price": 500000,
    "status": "pending",
    "note": "",
    "created_at": "2026-05-07 16:34:45",
    "updated_at": "2026-05-07 16:34:45"
  },
  {
    "id": 3,
    "customer_name": "Tran Thi B",
    "phone": "0987654321",
    "product_name": "Docker Container",
    "quantity": 1,
    "total_price": 150000,
    "status": "pending",
    "note": "",
    "created_at": "2026-05-07 16:31:39",
    "updated_at": "2026-05-07 16:31:39"
  },
  {
    "id": 2,
    "customer_name": "Tran Thi B",
    "phone": "0987654321",
    "product_name": "Docker Container",
    "quantity": 1,
    "total_price": 150000,
    "status": "pending",
    "note": "",
    "created_at": "2026-05-07 16:23:28",
    "updated_at": "2026-05-07 16:23:28"
  },
  {
    "id": 1,
    "customer_name": "Nguyen Van A",
    "phone": "0901234567",
    "product_name": "Sách DevOps",
    "quantity": 2,
    "total_price": 200000,
    "status": "pending",
    "note": "",
    "created_at": "2026-05-07 13:37:52",
    "updated_at": "2026-05-07 13:37:52"
  }
]
```

**Status:** ✅ PASS

---

## Test 3: Xem chi tiết đơn hàng (GET /api/orders/:id)

**Command:**
```
GET /api/orders/4
```

**Response:** `200 OK`
```json
{
  "id": 4,
  "customer_name": "Test User API",
  "phone": "0123456789",
  "product_name": "API Test Product",
  "quantity": 2,
  "total_price": 500000,
  "status": "pending",
  "note": "",
  "created_at": "2026-05-07 16:34:45",
  "updated_at": "2026-05-07 16:34:45"
}
```

**Status:** ✅ PASS

---

## Test 4: Cập nhật trạng thái (PUT /api/orders/:id/status)

**Command:**
```
PUT /api/orders/6/status
Content-Type: application/json

{
  "status": "processing"
}
```

**Response:** `200 OK`
```json
{
  "id": 6,
  "customer_name": "Status Test",
  "phone": "0555444333",
  "product_name": "Status Test Prod",
  "quantity": 1,
  "total_price": 111111,
  "status": "processing",
  "note": "",
  "created_at": "2026-05-07 16:35:37",
  "updated_at": "2026-05-07 16:35:37"
}
```

**Status:** ✅ PASS

**Lưu ý:** Các giá trị status hợp lệ: `pending`, `processing`, `shipping`, `completed`, `cancelled`

---

## Test 5: Xóa đơn hàng (DELETE /api/orders/:id)

**Command:**
```
DELETE /api/orders/4
```

**Response:** `200 OK`
```json
{
  "message": "Order deleted successfully"
}
```

**Status:** ✅ PASS

---

## Tổng kết

| Test | Endpoint | Method | Status | Ghi chú |
|------|----------|--------|--------|---------|
| 1 | /api/orders | POST | ✅ PASS | Tạo đơn hàng thành công, trả về ID = 4 |
| 2 | /api/orders | GET | ✅ PASS | Trả danh sách 4 đơn hàng |
| 3 | /api/orders/:id | GET | ✅ PASS | Trả chi tiết đơn hàng ID = 4 |
| 4 | /api/orders/:id/status | PUT | ✅ PASS | Cập nhật status thành công (order ID = 6) |
| 5 | /api/orders/:id | DELETE | ✅ PASS | Xóa đơn hàng thành công (order ID = 4) |

**Kết quả: 5/5 PASS**

---

## Các lỗi đã được sửa trong lần test này

### 1. Thiếu import trong `orderRoutes.js`
- **Vấn đề:** File đã có 3 route (`GET /:id`, `PUT /:id/status`, `DELETE /:id`) nhưng dòng import chỉ có 2 function.
- **Sửa:** Cập nhật import đầy đủ 5 function.

### 2. Bug variable trong `orderController.js` - `updateOrderStatus`
- **Vấn đề:** Dòng 71 dùng `allowedStatuses` nhưng biến được định nghĩa là `allowedStatus` (số nhiều/số ít không khớp).
- **Sửa:** Đổi `allowedStatuses` thành `allowedStatus`.
