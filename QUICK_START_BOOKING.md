# 🎉 Chức Năng Đặt Lịch Khám - Hoàn Thành ✅

## 📦 Những Gì Đã Tạo

### 1️⃣ Backend (Node.js + Express)

#### Repository Layer (`src/repositories/AppointmentRepo.js`)
- `CheckPatientByCCCD()` - Kiểm tra bệnh nhân tồn tại
- `BookAppointment()` - Transaction xử lý thêm bệnh nhân & phiếu khám
- `CreateAppointmentForExistingPatient()` - Tạo phiếu khám cho bệnh nhân hiện tại

#### Service Layer (`src/services/AppointmentService.js`)
- Validation đầy đủ:
  - Email: `abc@example.com`
  - Phone: `0912345678` hoặc `+84912345678`
  - CCCD: `123456789012` (12 chữ số)
  - Ngày khám: `>= hôm nay`
- Business logic xử lý bệnh nhân mới/cũ

#### Controller Layer (`src/controllers/AppointmentController.js`)
- API endpoint: `POST /api/appointments/book`
- Xử lý request/response

#### Routes (`src/routes/AppointmentRoutes.js`)
- Đăng ký route tự động vào `server.js`

---

### 2️⃣ Frontend (JavaScript + HTML + CSS)

#### JavaScript Handler (`js/appointmentBooking.js`)
- ✅ Client-side validation
- ✅ API call với error handling
- ✅ SweetAlert2 integration (modal thông báo đẹp)
- ✅ Form reset & loading state

#### CSS Styling (`css/appointmentBooking.css`)
- ✅ Responsive design (mobile-friendly)
- ✅ Beautiful form with modern styling
- ✅ Error states & notifications
- ✅ Smooth animations

#### Demo Page (`module/pages/BookingPage.html`)
- ✅ Complete working example
- ✅ Includes navbar & footer
- ✅ All form fields
- ✅ Bootstrap integration
- ✅ Ready to use

---

## 🚀 Cách Sử Dụng

### Step 1: Test Backend API

**Chạy server:**
```bash
cd "BACK END"
npm run dev
```

**Test với Postman (POST):**
```
URL: http://localhost:5000/api/appointments/book

Body (JSON):
{
  "TenBN": "Nguyễn Văn A",
  "CCCD": "123456789012",
  "SDT": "0912345678",
  "Email": "user@example.com",
  "GioiTinh": "Nam",
  "NgayKham": "2026-06-15",
  "DiaChi": "123 Đường A, TPHCM"
}
```

**Success Response:**
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

---

### Step 2: Integrate Frontend

**Option A: Use Demo Page**
- Mở `FRONT END/module/pages/BookingPage.html` trong trình duyệt
- Form đã sẵn sàng

**Option B: Thêm vào trang hiện tại**

1. Thêm CSS:
```html
<link rel="stylesheet" href="css/appointmentBooking.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.css">
```

2. Thêm Form HTML:
```html
<form id="appointmentForm">
    <div class="form-group">
        <label for="fullName">Họ và Tên <span class="required">*</span></label>
        <input type="text" id="fullName" name="fullName" required>
    </div>
    
    <div class="form-group">
        <label for="cccd">CCCD <span class="required">*</span></label>
        <input type="text" id="cccd" name="cccd" required>
    </div>
    
    <div class="form-group">
        <label for="phone">Số Điện Thoại <span class="required">*</span></label>
        <input type="tel" id="phone" name="phone" required>
    </div>
    
    <div class="form-group">
        <label for="email">Email <span class="required">*</span></label>
        <input type="email" id="email" name="email" required>
    </div>
    
    <div class="form-group">
        <label for="gender">Giới Tính <span class="required">*</span></label>
        <select id="gender" name="gender" required>
            <option value="">-- Chọn --</option>
            <option value="Nam">Nam</option>
            <option value="Nữ">Nữ</option>
            <option value="Khác">Khác</option>
        </select>
    </div>
    
    <div class="form-group">
        <label for="appointmentDate">Ngày Khám <span class="required">*</span></label>
        <input type="date" id="appointmentDate" name="appointmentDate" required>
    </div>
    
    <div class="form-group">
        <label for="dob">Ngày Sinh (Tùy chọn)</label>
        <input type="date" id="dob" name="dob">
    </div>
    
    <div class="form-group">
        <label for="address">Địa Chỉ (Tùy chọn)</label>
        <textarea id="address" name="address"></textarea>
    </div>
    
    <div class="form-group">
        <button type="submit">Đặt Lịch Khám</button>
    </div>
</form>
```

3. Thêm JavaScript:
```html
<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.all.min.js"></script>
<script src="js/appointmentBooking.js"></script>
```

---

## ✨ Tính Năng Chính

### ✅ Validation
- Họ tên: không trống
- CCCD: 12 chữ số
- SĐT: định dạng VN (0xxxxxxxxx)
- Email: hợp lệ
- Giới tính: Nam/Nữ/Khác
- Ngày khám: >= hôm nay

### ✅ Database Transaction
```
INSERT INTO BENHNHAN
↓ (lấy MaBN tự động)
INSERT INTO PHIEUKHAM
↓ (lấy MaPK tự động)
COMMIT hoặc ROLLBACK (nếu lỗi)
```

### ✅ Auto-Increment
- `MaBN` tự động tăng: 1, 2, 3, 4, ...
- `MaPK` tự động tăng: 1, 2, 3, 4, ...
- (Không random, không vô chưa gì đã là 1002)

### ✅ Duplicate Patient Check
- Kiểm tra CCCD có tồn tại không
- Nếu có → Dùng MaBN cũ, tạo phiếu khám mới
- Nếu chưa → Tạo bệnh nhân mới

### ✅ User Experience
- Modal thông báo thành công với MaBN & MaPK
- Hiển thị chi tiết lỗi (từng dòng)
- Loading spinner
- Reset form sau thành công

---

## 📚 Documentation

Xem file: `DOCUMENTATION_APPOINTMENT_BOOKING.md`

Bao gồm:
- API Documentation
- Validation Rules
- Database Queries
- Troubleshooting
- Testing Guide

---

## 🔧 File Structure

```
BACK END/
├── src/
│   ├── controllers/
│   │   └── AppointmentController.js ✨ NEW
│   ├── services/
│   │   └── AppointmentService.js ✨ NEW
│   ├── repositories/
│   │   └── AppointmentRepo.js ✨ NEW
│   └── routes/
│       └── AppointmentRoutes.js ✨ NEW
└── server.js [UPDATED - route thêm]

FRONT END/
├── js/
│   └── appointmentBooking.js ✨ NEW
├── css/
│   └── appointmentBooking.css ✨ NEW
└── module/pages/
    └── BookingPage.html ✨ NEW

ROOT/
└── DOCUMENTATION_APPOINTMENT_BOOKING.md ✨ NEW
```

---

## 🧪 Testing Checklist

```
☐ Backend chạy trên port 5000
☐ Test API với Postman (success case)
☐ Test API với Postman (error cases)
☐ Kiểm tra BENHNHAN table có record mới
☐ Kiểm tra PHIEUKHAM table có record mới
☐ MaBN tăng tự động (1, 2, 3...)
☐ MaPK tăng tự động (1, 2, 3...)
☐ Validation email (thử invalid email)
☐ Validation SĐT (thử invalid phone)
☐ Validation CCCD (thử không phải 12 số)
☐ Validation ngày khám (thử ngày quá khứ)
☐ Form reset sau submit
☐ Modal thông báo hiển thị
☐ Responsive design (test trên mobile)
```

---

## ⚠️ Lưu Ý Quan Trọng

1. **Database Schema**
   - Bảng BENHNHAN phải có `MaBN INT IDENTITY(1,1) PRIMARY KEY`
   - Bảng PHIEUKHAM phải có `MaPK INT IDENTITY(1,1) PRIMARY KEY`

2. **Environment Variables**
   - Cập nhật `.env` với credentials database đúng
   - `DB_SERVER`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`

3. **CORS Issues**
   - Nếu gọi từ domain khác, cấu hình CORS trong `server.js`

4. **API URL**
   - Mặc định: `http://localhost:5000/api/appointments/book`
   - Đổi URL nếu deploy lên production

5. **Sweet Alert 2**
   - Dùng CDN từ jsdelivr
   - Có thể swap thành `alert()` nếu không muốn dùng library

---

## 🎯 Done! ✅

- ✅ Backend hoàn chỉnh với transaction
- ✅ Frontend validation & error handling
- ✅ Database auto-increment (1, 2, 3...)
- ✅ Modal notification
- ✅ Responsive design
- ✅ Complete documentation

**Bạn đã có một hệ thống đặt lịch khám chuyên nghiệp!** 🎉

---

**Ngày tạo:** 31/05/2026
