# Hướng Dẫn Chức Năng Đặt Lịch Khám

## 📋 Tổng Quan
Chức năng "Đặt Lịch Khám" cho phép bệnh nhân (khách vãng lai) đặt lịch khám trực tuyến. Hệ thống sẽ tự động:
1. Tạo bệnh nhân mới (nếu chưa tồn tại) hoặc sử dụng bệnh nhân hiện tại
2. Tạo phiếu khám mới với ngày khám được đặt
3. Đảm bảo tính nhất quán dữ liệu bằng transaction

---

## 🔧 Yêu Cầu Kỹ Thuật

### Backend
- **Framework:** Express.js (Node.js)
- **Database:** SQL Server
- **Thư viện:** mssql (v12.5.2+)

### Frontend
- **HTML5:** Form semantic
- **JavaScript:** ES6+ (Vanilla JS)
- **Library:** Sweet Alert 2 (hiển thị thông báo)
- **CSS:** Custom responsive design

---

## 🚀 Cài Đặt & Thiết Lập

### 1. Backend Setup

#### 1.1 Kiểm tra database schema
```sql
-- Các bảng cần tồn tại:
-- - BENHNHAN (bệnh nhân)
-- - PHIEUKHAM (phiếu khám)

-- Bảng BENHNHAN:
-- Columns: MaBN (PK, IDENTITY), TenBN, CCCD, GioiTinh, NgaySinh, DiaChi, SDT, Email

-- Bảng PHIEUKHAM:
-- Columns: MaPK (PK, IDENTITY), MaNV (FK), MaBN (FK), NgayKham
```

#### 1.2 Các file backend được tạo:
```
src/
├── controllers/
│   └── AppointmentController.js
├── services/
│   └── AppointmentService.js
├── repositories/
│   └── AppointmentRepo.js
└── routes/
    └── AppointmentRoutes.js
```

#### 1.3 Server configuration
File `server.js` đã được cập nhật:
```javascript
app.use('/api/appointments', require('./src/routes/AppointmentRoutes'));
```

### 2. Frontend Setup

#### 2.1 Các file frontend:
```
js/
├── appointmentBooking.js
css/
├── appointmentBooking.css
module/pages/
└── BookingPage.html
```

#### 2.2 Thêm vào trang HTML của bạn:
```html
<!-- Styles -->
<link rel="stylesheet" href="css/appointmentBooking.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.css">

<!-- Sweet Alert 2 -->
<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.all.min.js"></script>

<!-- Custom JS -->
<script src="js/appointmentBooking.js"></script>
```

---

## 📝 API Documentation

### Endpoint: POST `/api/appointments/book`

**URL:** `http://localhost:5000/api/appointments/book`

**Method:** `POST`

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "TenBN": "Nguyễn Văn A",
  "CCCD": "123456789012",
  "SDT": "0912345678",
  "Email": "user@example.com",
  "GioiTinh": "Nam",
  "NgayKham": "2026-06-15",
  "DiaChi": "123 Đường A, Quận 1, TPHCM",
  "NgaySinh": "1990-05-20"
}
```

**Parameters:**
| Field | Type | Required | Format | Description |
|-------|------|----------|--------|-------------|
| TenBN | String | ✓ | Max 100 chars | Họ và tên bệnh nhân |
| CCCD | String | ✓ | 12 digits | CCCD/CMND |
| SDT | String | ✓ | 0xxxxxxxxx | Số điện thoại Việt Nam |
| Email | String | ✓ | valid email | Email |
| GioiTinh | String | ✓ | Nam/Nữ/Khác | Giới tính |
| NgayKham | Date | ✓ | YYYY-MM-DD | Ngày khám (>= ngày hôm nay) |
| DiaChi | String | ✗ | Max 255 chars | Địa chỉ |
| NgaySinh | Date | ✗ | YYYY-MM-DD | Ngày sinh |

**Success Response (201):**
```json
{
  "status": "success",
  "message": "Đặt lịch khám thành công! Chúng tôi sẽ liên hệ xác nhận sớm nhất.",
  "data": {
    "maBN": 1,
    "maPK": 1
  }
}
```

**Error Response (400/500):**
```json
{
  "status": "error",
  "message": "Dữ liệu không hợp lệ",
  "errors": [
    "Email không hợp lệ",
    "Ngày khám không được nhỏ hơn ngày hôm nay"
  ]
}
```

---

## ✅ Validation Rules

### Server-side Validation (AppointmentService.js)

1. **Họ tên (TenBN)**
   - Bắt buộc
   - Max 100 ký tự
   - Không được trống

2. **CCCD**
   - Bắt buộc
   - Phải là 12 chữ số
   - Kiểm tra trùng lặp (nếu chưa tồn tại thì thêm mới)

3. **Số điện thoại (SDT)**
   - Bắt buộc
   - Định dạng: 0xxxxxxxxx hoặc +84xxxxxxxxx
   - Phải có đúng 10 chữ số sau 0

4. **Email**
   - Bắt buộc
   - Phải đúng định dạng email
   - RegEx: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`

5. **Giới tính**
   - Bắt buộc
   - Giá trị: "Nam", "Nữ", "Khác"

6. **Ngày khám (NgayKham)**
   - Bắt buộc
   - Phải là ngày hợp lệ
   - Không được nhỏ hơn ngày hôm nay (ít nhất là hôm nay)

7. **Ngày sinh (NgaySinh)**
   - Tùy chọn
   - Nếu có thì phải là ngày hợp lệ

### Client-side Validation (appointmentBooking.js)
Tương tự server-side, validate trước khi gửi request để cải thiện UX

---

## 🔄 Quy Trình Xử Lý

```
┌─────────────────────────────────────┐
│ 1. Frontend gửi form                │
│    (appointmentBooking.js)          │
└─────────────────┬───────────────────┘
                  │
                  ↓
┌─────────────────────────────────────┐
│ 2. Validate dữ liệu (Client-side)   │
│    Nếu lỗi → Hiển thị lỗi           │
└─────────────────┬───────────────────┘
                  │
                  ↓
┌─────────────────────────────────────┐
│ 3. POST /api/appointments/book      │
│    (AppointmentController)          │
└─────────────────┬───────────────────┘
                  │
                  ↓
┌─────────────────────────────────────┐
│ 4. Validate dữ liệu (Server-side)   │
│    (AppointmentService)             │
│    Nếu lỗi → Trả response 400       │
└─────────────────┬───────────────────┘
                  │
                  ↓
┌─────────────────────────────────────┐
│ 5. Kiểm tra bệnh nhân tồn tại       │
│    (AppointmentRepo)                │
│    - Nếu có → Dùng MaBN cũ          │
│    - Nếu không → Tạo mới            │
└─────────────────┬───────────────────┘
                  │
                  ↓
┌─────────────────────────────────────┐
│ 6. Transaction:                     │
│    a) INSERT BENHNHAN (nếu mới)    │
│       → Lấy MaBN từ IDENTITY        │
│    b) INSERT PHIEUKHAM              │
│       Nếu lỗi → ROLLBACK            │
└─────────────────┬───────────────────┘
                  │
                  ↓
┌─────────────────────────────────────┐
│ 7. Return response 201              │
│    - MaBN (tự động tăng)            │
│    - MaPK (tự động tăng)            │
│    - Thông báo thành công           │
└─────────────────┬───────────────────┘
                  │
                  ↓
┌─────────────────────────────────────┐
│ 8. Frontend:                        │
│    - Hiển thị modal thành công      │
│    - Đặt lại form                   │
│    - Redirect (tùy chọn)            │
└─────────────────────────────────────┘
```

---

## 🔐 Tính Năng Bảo Mật

### Transaction (SQL Server)
```javascript
// Đảm bảo tính ACID:
// - Nếu INSERT BENHNHAN thất bại → ROLLBACK
// - Nếu INSERT PHIEUKHAM thất bại → ROLLBACK
// - Cả hai thành công → COMMIT
```

### Kiểm Tra CCCD
```javascript
// Nếu bệnh nhân đã từng đến:
// - Dùng lại MaBN cũ
// - Tạo phiếu khám mới
// - Không bị trùng dữ liệu bệnh nhân
```

### Input Validation
- Loại bỏ khoảng trắng đầu/cuối (`.trim()`)
- Kiểm tra định dạng email, SĐT, CCCD
- Ngày khám phải >= ngày hôm nay

---

## 🧪 Test API

### Sử dụng Postman hoặc cURL:

**cURL:**
```bash
curl -X POST http://localhost:5000/api/appointments/book \
  -H "Content-Type: application/json" \
  -d '{
    "TenBN": "Nguyễn Văn A",
    "CCCD": "123456789012",
    "SDT": "0912345678",
    "Email": "user@example.com",
    "GioiTinh": "Nam",
    "NgayKham": "2026-06-15"
  }'
```

**JavaScript (Fetch):**
```javascript
const formData = {
    TenBN: "Nguyễn Văn A",
    CCCD: "123456789012",
    SDT: "0912345678",
    Email: "user@example.com",
    GioiTinh: "Nam",
    NgayKham: "2026-06-15"
};

fetch('http://localhost:5000/api/appointments/book', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData)
})
.then(res => res.json())
.then(data => console.log(data))
.catch(err => console.error(err));
```

---

## 📱 Frontend Usage

### 1. HTML Form Structure
```html
<form id="appointmentForm">
    <input type="text" name="fullName" placeholder="Họ tên">
    <input type="text" name="cccd" placeholder="CCCD">
    <input type="tel" name="phone" placeholder="SĐT">
    <input type="email" name="email" placeholder="Email">
    <select name="gender">
        <option value="Nam">Nam</option>
        <option value="Nữ">Nữ</option>
        <option value="Khác">Khác</option>
    </select>
    <input type="date" name="appointmentDate">
    <button type="submit">Đặt Lịch Khám</button>
</form>
```

### 2. JavaScript Initialization
```javascript
<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.all.min.js"></script>
<script src="appointmentBooking.js"></script>

<script>
    // Tự động khởi tạo khi DOM ready
    document.addEventListener('DOMContentLoaded', () => {
        new AppointmentBooking('#appointmentForm');
    });
</script>
```

### 3. Custom Configuration
```javascript
// Thay đổi API URL
const booking = new AppointmentBooking('#appointmentForm');
booking.apiUrl = 'http://your-domain.com/api/appointments/book';
```

---

## 🐛 Troubleshooting

### Lỗi CORS
**Vấn đề:** Response bị chặn do CORS policy

**Giải pháp:**
- Kiểm tra `cors` middleware trong `server.js` đã kích hoạt
- Thêm CORS headers nếu cần:
```javascript
app.use(cors({
    origin: ['http://localhost:3000', 'http://your-domain.com'],
    credentials: true
}));
```

### Lỗi 404 - API Not Found
**Giải pháp:**
- Kiểm tra route đã được đăng ký trong `server.js`
- Kiểm tra URL API đúng: `http://localhost:5000/api/appointments/book`
- Kiểm tra method: `POST`

### Lỗi Database Connection
**Giải pháp:**
- Kiểm tra `.env` file có config database đúng
- Kiểm tra SQL Server đang chạy
- Kiểm tra credentials: `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_SERVER`

### MaBN/MaPK không tăng tự động
**Vấn đề:** ID không phải số thứ tự

**Giải pháp:**
- Kiểm tra column `MaBN` và `MaPK` đã set `IDENTITY(1,1)`
- Reset IDENTITY nếu cần:
```sql
DBCC CHECKIDENT (BENHNHAN, RESEED, 0);
DBCC CHECKIDENT (PHIEUKHAM, RESEED, 0);
```

---

## 📊 Database Queries (Helper)

### Xem tất cả bệnh nhân đặt lịch hôm nay
```sql
SELECT 
    pk.MaPK,
    bn.MaBN,
    bn.TenBN,
    bn.SDT,
    bn.Email,
    pk.NgayKham
FROM PHIEUKHAM pk
JOIN BENHNHAN bn ON pk.MaBN = bn.MaBN
WHERE CAST(pk.NgayKham AS DATE) = CAST(GETDATE() AS DATE)
ORDER BY pk.NgayKham;
```

### Kiểm tra bệnh nhân theo CCCD
```sql
SELECT * FROM BENHNHAN WHERE CCCD = '123456789012';
```

### Reset IDENTITY counter
```sql
-- Reset MaBN
DBCC CHECKIDENT (BENHNHAN, RESEED, 0);

-- Reset MaPK
DBCC CHECKIDENT (PHIEUKHAM, RESEED, 0);
```

---

## 📞 Support

Nếu gặp vấn đề:
1. Kiểm tra console browser (F12)
2. Kiểm tra backend logs
3. Kiểm tra SQL Server logs
4. Đọc lại documentation này

---

**Cập nhật lần cuối:** 31/05/2026
