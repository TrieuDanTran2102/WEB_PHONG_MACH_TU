CREATE DATABASE QuanLyPhongMachTu;
USE QuanLyPhongMachTu;

CREATE TABLE CHUCVU
(
	MaCV int IDENTITY(1,1) primary key, 
	TenCV NVARCHAR(50) NOT NULL
);

CREATE TABLE CHUYENKHOA
(
	MaCK int IDENTITY(1,1) primary key, 
	TenCK NVARCHAR(50) NOT NULL
);

CREATE TABLE NHANVIEN
(
	MaNV int IDENTITY(1,1) Primary key,
	TenNV nvarchar(100) NOT NULL,
	CCCD VARCHAR(12) UNIQUE,
	GioiTinh NVARCHAR(3) NOT NULL,
	NgaySinh Date NOT NULL,
	NgayBatDauLamViec Date NOT NULL,
	BangCapChungChi NVARCHAR(255),
	DiaChi NVARCHAR(255),
	SDT varchar(10) NOT NULL,
	Email VARCHAR(100),
	MaCV int,
	MaCK int,
	CONSTRAINT fk_nv_cv FOREIGN KEY (MaCV) REFERENCES CHUCVU(MaCV),
	CONSTRAINT fk_nv_ck FOREIGN KEY (MaCK) REFERENCES CHUYENKHOA(MaCK)
);

CREATE TABLE TAIKHOAN
(
	TenDangNhap VARCHAR(50) PRIMARY KEY,
	MatKhau VARCHAR(10) NOT NULL,
	MaNV INT UNIQUE,
	CONSTRAINT fk_tk_nv FOREIGN KEY (MaNV) REFERENCES NHANVIEN(MaNV)
);

CREATE TABLE BENHNHAN
(
	MaBN INT IDENTITY(1,1) Primary Key,
	TenBN NVARCHAR(100) NOT NULL,
	CCCD VARCHAR(12) UNIQUE,
	GioiTinh NVARCHAR(3) NOT NULL,
	NgaySinh Date NOT NULL,
	DiaChi NVARCHAR(255),
	SDT VARCHAR(10) NOT NULL,
	Email VARCHAR(100)
);


CREATE TABLE PHIEUKHAM
(
	MaPK INT IDENTITY(1,1) PRIMARY KEY,
	MaNV INT,
	MaBN INT,
	NgayKham DATE NOT NULL,
	SoThuTu INT NOT NULL DEFAULT 1,
	CONSTRAINT fk_pk_nv FOREIGN KEY (MaNV) REFERENCES NHANVIEN(MaNV),
	CONSTRAINT fk_pk_bn FOREIGN KEY (MaBN) REFERENCES BENHNHAN(MaBN)
);

CREATE TABLE DONVITINH
(
	MaDVT INT IDENTITY(1,1) PRIMARY KEY,
	TenDVT NVARCHAR(20) NOT NULL
);

CREATE TABLE CACHDUNG
(
	MaCachDung INT IDENTITY(1,1) PRIMARY KEY,
	MoTaCachDung NVARCHAR(255) NOT NULL
);

CREATE TABLE THUOC
(
	MaThuoc INT IDENTITY(1,1) PRIMARY KEY,
	TenThuoc NVARCHAR(255) NOT NULL,
	DonGiaBan DECIMAL(18,2) NOT NULL,
	SoLuongTon  INT DEFAULT 0,
	MaCachDung INT,
	MaDVT INT,
	CONSTRAINT fk_t_cd FOREIGN KEY (MaCachDung) REFERENCES CACHDUNG(MaCachDung),
	CONSTRAINT fk_t_dvt FOREIGN KEY (MaDVT) REFERENCES DONVITINH(MaDVT)
);

CREATE TABLE CT_PHIEUKHAM
(
	MaPK INT,
	MaThuoc INT,
	SoLuongThuoc INT NOT NULL,
	DonGiaBan DECIMAL(18,2) NOT NULL,
	ThanhTien DECIMAL(18,2) DEFAULT 0,
	CONSTRAINT pk_ctpk PRIMARY KEY(MaPK, MaThuoc),
	CONSTRAINT fk_ctpk_pk FOREIGN KEY (MaPK) REFERENCES PHIEUKHAM(MaPK),
	CONSTRAINT fk_ctpk_t FOREIGN KEY (MaThuoc) REFERENCES THUOC(MaThuoc)
);

CREATE TABLE PHIEUNHAPTHUOC
(
	MaPN INT IDENTITY(1,1) PRIMARY KEY,
	NgayNhap DATE NOT NULL,
	TongTienNhap DECIMAL(18,2) DEFAULT 0,
);

CREATE TABLE CT_PHIEUNHAPTHUOC
(
	MaPN INT,
	MaThuoc INT, 
	DonGiaNhap DECIMAL(18,2) NOT NULL,
	SoLuong INT NOT NULL,
	ThanhTien DECIMAL(18,2) NOT NULL,
	CONSTRAINT pk_pnt PRIMARY KEY(MaPN, MaThuoc),
	CONSTRAINT fk_ctpnt_pn FOREIGN KEY (MaPN) REFERENCES PHIEUNHAPTHUOC(MaPN),
	CONSTRAINT fk_ctpnt_t FOREIGN KEY (MaThuoc) REFERENCES THUOC(MaThuoc)
);

CREATE TABLE LOAIBENH
(
	MaLoaiBenh INT IDENTITY(1,1) PRIMARY KEY,
	TenBenh NVARCHAR(255) NOT NULL
);

CREATE TABLE CT_LOAIBENH
(
	MaPK INT, 
	MaLoaiBenh INT,
	TrieuChung NVARCHAR(255),
	GhiChu NVARCHAR(255),
	CONSTRAINT pk_ctlb PRIMARY KEY(MaPK, MaLoaiBenh),
	CONSTRAINT fk_ctlb_pk FOREIGN KEY (MaPK) REFERENCES PHIEUKHAM(MaPK),
	CONSTRAINT fk_ctlb_b FOREIGN KEY (MaLoaiBenh) REFERENCES LOAIBENH(MaLoaiBenh)
);

CREATE TABLE HOADON
(
	MaHD INT IDENTITY(1,1) PRIMARY KEY,
	MaPK INT,
	NgayLap DATETIME,
	TongTienThuoc DECIMAL(18,2) NOT NULL,
	TienKham DECIMAL(18,2) NOT NULL,
	TongTien DECIMAL(18,2) DEFAULT 0,
	CONSTRAINT fk_hd_pk FOREIGN KEY (MaPK) REFERENCES PHIEUKHAM(MaPK)
);

CREATE TABLE BCDOANHTHU
(
	Thang INT,
	Nam INT,
	TongDoanhThu DECIMAL(18,2) NOT NULL,
	TongSoBenhNhan INT NOT NULL,
	CONSTRAINT pk_bcdt PRIMARY KEY (Thang, Nam)
);

CREATE TABLE CT_BCDOANHTHU
(
	Ngay INT,
	Thang INT, 
	Nam INT,
	SoBenhNhan INT NOT NULL,
	DoanhThu DECIMAL(18,2) DEFAULT 0,
	TyLe DECIMAL(3,2) NOT NULL,
	CONSTRAINT pk_ctbcdt PRIMARY KEY (Ngay, Thang, Nam),
	CONSTRAINT fk_ctbcdt_bcdt FOREIGN KEY (Thang, Nam) REFERENCES BCDOANHTHU(Thang, Nam)
);

CREATE TABLE BCSUDUNGTHUOC
(
	Thang INT,
	Nam INT,
	MaThuoc INT,
	SoLanDung INT NOT NULL,
	SoLuongDung INT NOT NULL,
	SoLuongNhap INT NOT NULL,
	CONSTRAINT pk_bcsdt PRIMARY KEY(Thang, Nam, MaThuoc),
	CONSTRAINT fk_bcsdt_t FOREIGN KEY (MaThuoc) REFERENCES THUOC(MaThuoc)
);

CREATE TABLE THAMSO
(
	TenThamSo NVARCHAR(100) PRIMARY KEY,
	GiaTri DECIMAL(18,2) NOT NULL
);


--1. CHUCVU
INSERT INTO CHUCVU (TenCV) VALUES
(N'Bác sĩ'),
(N'Lễ tân'),
(N'Admin');

--2. CHUYENKHOA
INSERT INTO CHUYENKHOA (TenCK) VALUES
(N'Nội tổng quát'),
(N'Tim mạch'),
(N'Y học cổ truyền'),
(N'Tai mũi họng'),
(N'Nhi khoa');


--3. NHANVIEN
INSERT INTO NHANVIEN (TenNV, CCCD, GioiTinh, NgaySinh, NgayBatDauLamViec, BangCapChungChi, DiaChi, SDT, Email, MaCV, MaCK) VALUES
(N'Trần Minh Phúc', '123456789001', 'Nam', '1988-06-25', '2012-03-01', N'Tiến Sĩ Y Học', N'456 Đường Lê Lợi, TP.HCM', '0912345678', 'tran.minh.phuc@clinic.com', 1, 1),
(N'Nguyễn Vũ Thùy Trâm', '123456789002', 'Nữ', '1995-07-18', '2018-05-12', N'Thạc Sĩ Y Khoa', N'Thủ Đức', '0901234562', 'tram@clinic.com', 1, 2),
(N'Dương Thanh Hiếu', '123456789003', 'Nam', '1992-09-12', '2017-08-01', N'Bác Sĩ Chuyên Khoa I', N'Quận 3', '0901234563', 'hieu@clinic.com', 1, 5),
(N'Nguyễn Trần Phương Vy', '123456789004', 'Nữ', '1996-02-20', '2019-11-15', N'Bác Sĩ Đa Khoa', N'Gò Vấp', '0901234565', 'vy@clinic.com', 1, 4),
(N'Trần Triệu Dân', '123456789005', 'Nam', '1994-11-08', '2016-06-20', N'Bác Sĩ Chuyên Khoa II', N'Bình Thạnh', '0901234561', 'dan@clinic.com', 1, 3),
(N'Nguyễn Văn Quản', '987654321098', 'Nam', '1980-01-01', '2010-01-01', NULL, N'456 Đường Lê Lợi, TP.HCM', '0912345678', 'admin@clinic.com', 3, NULL),
(N'Nguyễn Nhâm', '123456789012', 'Nữ', '1995-05-15', '2022-03-01', NULL, N'123 Đường Trần Hưng Đạo, TP.HCM', '0901234567', 'le.thi.thu@clinic.com', 2, NULL);


--4. TAIKHOAN
INSERT INTO TAIKHOAN (TenDangNhap, MatKhau, MaNV) VALUES
('admin', '123', 6),
('bacsi1', '123', 1),
('bacsi2', '123', 2),
('letan1', '123', 7);

--5. BENHNHAN
INSERT INTO BENHNHAN (TenBN, CCCD, GioiTinh, NgaySinh, DiaChi, SDT, Email) VALUES
(N'Nguyễn Thị Mai', '001234567890', 'Nữ', '2000-05-12', N'Thủ Đức', '0911111111', 'mai@gmail.com'),
(N'Trần Văn Nam', '001234567891', 'Nam', '1998-03-15', N'Quận 9', '0911111112', 'nam@gmail.com'),
(N'Lê Thị Hoa', '001234567892', 'Nữ', '2001-09-20', N'Dĩ An', '0911111113', 'hoa@gmail.com'),
(N'Phạm Văn Long', '001234567893', 'Nam', '1995-12-01', N'Bình Thạnh', '0911111114', 'long@gmail.com'),
(N'Đỗ Minh Anh', '001234567894', 'Nữ', '2002-07-25', N'Thủ Đức', '0911111115', 'anh@gmail.com');


--6. LOAIBENH (loại bệnh)
INSERT INTO LOAIBENH (TenBenh) VALUES
-- Nội tổng quát (1-5 cũ + mở rộng)
(N'Cảm cúm'),                       -- 1
(N'Sốt'),                            -- 2
(N'Đau dạ dày'),                     -- 3
(N'Dị ứng'),                         -- 4
(N'Viêm họng'),                      -- 5
(N'Đau đầu'),                        -- 6
(N'Mất ngủ'),                        -- 7
(N'Táo bón'),                        -- 8
(N'Tiêu chảy'),                      -- 9
(N'Viêm loét dạ dày'),               -- 10
(N'Trào ngược dạ dày'),              -- 11
(N'Đái tháo đường'),                 -- 12
(N'Béo phì'),                        -- 13
(N'Thiếu máu'),                      -- 14
(N'Suy nhược cơ thể'),               -- 15
-- Tim Mạch
(N'Tăng huyết áp'),                  -- 16
(N'Hạ huyết áp'),                    -- 17
(N'Rối loạn nhịp tim'),              -- 18
(N'Suy tim'),                        -- 19
(N'Xơ vữa động mạch'),               -- 20
-- Hô Hấp
(N'Hen suyễn'),                      -- 21
(N'Viêm phế quản'),                  -- 22
(N'Viêm phổi'),                      -- 23
(N'COPD'),                           -- 24
(N'Viêm xoang'),                     -- 25
-- Tai Mũi Họng
(N'Viêm tai giữa'),                  -- 26
(N'Viêm amidan'),                    -- 27
(N'Polyp mũi'),                      -- 28
(N'Ù tai'),                          -- 29
-- Nhi Khoa
(N'Sốt xuất huyết'),                 -- 30
(N'Tay chân miệng'),                 -- 31
(N'Sởi'),                            -- 32
(N'Thủy đậu'),                       -- 33
(N'Rối loạn tiêu hóa trẻ em'),       -- 34
-- Thần Kinh
(N'Đau nửa đầu (Migraine)'),         -- 35
(N'Chóng mặt'),                      -- 36
(N'Động kinh'),                      -- 37
(N'Tê liệt'),                        -- 38
-- Y Học Cổ Truyền
(N'Đau lưng'),                       -- 39
(N'Đau cổ vai gáy'),                 -- 40
(N'Đau khớp'),                       -- 41
(N'Thoái hóa cột sống'),             -- 42
-- Mắt
(N'Viêm kết mạc'),                   -- 43
(N'Khô mắt'),                        -- 44
(N'Cận thị'),                        -- 45
-- Nha Khoa
(N'Sâu răng'),                       -- 46
(N'Viêm nướu'),                      -- 47
(N'Viêm nha chu'),                   -- 48
-- Da liễu
(N'Mề đay mãn tính'),                -- 49
(N'Viêm da tiếp xúc'),               -- 50
(N'Nấm da'),                         -- 51
(N'Zona thần kinh'),                 -- 52
-- Nhiễm trùng
(N'Nhiễm khuẩn đường tiết niệu'),    -- 53
(N'Nhiễm giun sán'),                 -- 54
(N'Nhiễm trùng da'),                 -- 55
(N'Viêm gan');                       -- 56

--7. CACHDUNG
INSERT INTO CACHDUNG (MoTaCachDung) VALUES
(N'Uống sau ăn'),
(N'Uống trước ăn'),
(N'Ngày 2 lần'),
(N'Ngày 3 lần'),
(N'Khi cần');

--8. DONVITINH
INSERT INTO DONVITINH (TenDVT) VALUES
(N'Viên'),
(N'Chai'),
(N'Gói'),
(N'Ống'),
(N'Tuýp');


--9. THUOC
INSERT INTO THUOC (TenThuoc, DonGiaBan, SoLuongTon, MaCachDung, MaDVT) VALUES
(N'Paracetamol',       5000, 100, 1, 1),
(N'Amoxicillin',      10000,  80, 3, 1),
(N'Vitamin C',         3000, 200, 5, 1),
(N'Efferalgan',        7000, 120, 2, 1),
(N'Sirô ho',          25000,  50, 4, 2),
(N'Ibuprofen',         2000,  50, 3, 1),
(N'Aspirin',            800,  80, 1, 1),
(N'Metformin',         1500, 120, 3, 1),
(N'Lisinopril',        2500,  90, 1, 1),
(N'Omeprazole',        2000,  75, 1, 1),
(N'Cephalexin',        3500,  55, 5, 1),
(N'Loratadine',        1200, 110, 1, 1),
(N'Fluticasone',       5000,  30, 3, 2),
(N'Salbutamol',        4500,  25, 4, 2),
(N'Dexamethasone',     1800,  40, 3, 1),
(N'Ciprofloxacin',     2200,  65, 3, 1),
(N'Azithromycin',      3200,  50, 1, 1),
(N'Ambroxol',           900, 150, 4, 1),
(N'Guaifenesin',       4000,  35, 3, 2),
(N'Hydrocodone',       4800,  30, 5, 1),
(N'Diphenhydramine',   1100,  85, 1, 1),
(N'Cetirizine',         950, 130, 1, 1),
(N'Acyclovir',         3800,  45, 5, 1),
(N'Nystatin',          5500,  20, 3, 2),
(N'Albendazole',       2300,  55, 3, 1),
(N'Mebendazole',       2100,  60, 4, 1),
(N'Pyrantel Pamoate',  4200,  25, 1, 2),
(N'Tetracycline',      1900,  70, 5, 1),
(N'Doxycycline',       2400,  65, 3, 1),
(N'Clarithromycin',    3100,  50, 3, 1),
(N'Clindamycin',       2600,  55, 4, 1),
(N'Metronidazole',     1400,  80, 4, 1);

--10.PHIEUKHAM
INSERT INTO PHIEUKHAM(MaNV, MaBN, NgayKham) VALUES
(1, 1, '2026-03-10'),
(2, 2, '2026-04-10'),
(3, 3, '2026-05-11'),
(1, 4, '2026-05-11'),
(2, 5, '2026-10-12');

--11. CT_PHIEUKHAM
INSERT INTO CT_PHIEUKHAM (MaPK, MaThuoc, SoLuongThuoc, DonGiaBan, ThanhTien) VALUES
(1, 1, 2, 5000, 10000),
(1, 3, 1, 3000, 3000),
(2, 2, 1, 10000, 10000),
(3, 5, 1, 25000, 25000),
(4, 4, 2, 7000, 14000),
(5, 1, 1, 5000, 5000);

-- Additional sample prescriptions for testing
INSERT INTO CT_PHIEUKHAM (MaPK, MaThuoc, SoLuongThuoc, DonGiaBan, ThanhTien) VALUES
(1, 2, 1, 10000, 10000),
(2, 1, 3, 5000, 15000),
(2, 4, 1, 7000, 7000),
(3, 3, 2, 3000, 6000),
(3, 1, 1, 5000, 5000),
(4, 5, 2, 25000, 50000),
(4, 2, 1, 10000, 10000),
(5, 3, 5, 3000, 15000),
(5, 4, 1, 7000, 7000);


--12. HOADON
INSERT INTO HOADON (MaPK, NgayLap, TongTienThuoc, TienKham, TongTien) VALUES
(1, '2026-03-10', 13000, 30000, 43000),
(2, '2026-04-10', 10000, 30000, 40000),
(3, '2026-05-11', 15000, 30000, 45000),
(4, '2026-05-11', 14000, 30000, 44000),
(5, '2026-10-12', 25000, 30000, 55000);

INSERT INTO THAMSO (TenThamSo, GiaTri) VALUES
('SoBenhNhanToiDa',   40),
('TienKham',          30000),
('TyLeTinhDonGiaBan', 1.5);

--13. CT_LOAIBENH
INSERT INTO CT_LOAIBENH (MaPK, MaLoaiBenh, TrieuChung, GhiChu) VALUES
(1, 1, N'Sốt cao, đau đầu, mệt mỏi', N'Bệnh thường gặp vào mùa đông'),
(2, 2, N'Sốt nhẹ, đau họng', N'Bệnh thường gặp vào mùa hè'),
(3, 3, N'Đau vùng thượng vị, buồn nôn', N'Bệnh thường gặp khi ăn uống không hợp vệ sinh'),
(4, 4, N'Ngứa da, nổi mề đay', N'Bệnh thường gặp khi tiếp xúc với dị nguyên'),
(5, 5, N'Đau họng, khó nuốt', N'Bệnh thường gặp vào mùa lạnh');	

--14. CT_PIEUKHAM