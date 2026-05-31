const PhieuKhamRepo = require('../repositories/PhieuKhamRepo');
const ThamSoRepo = require('../repositories/ThamSoRepo'); // Tận dụng lại repo tham số

class PhieuKhamService {
    async CreatePhieuKham(MaNV, MaBN) {
        // Lấy ngày hiện tại (Format: YYYY-MM-DD để khớp kiểu DATE trong SQL)
        const today = new Date().toISOString().split('T')[0];

        // 1. Lấy quy định "Số bệnh nhân tối đa" từ DB
        const maxBenhNhan = await ThamSoRepo.GetByName('SoBenhNhanToiDa');
        
        if (!maxBenhNhan) {
            throw new Error('Chưa cấu hình quy định Số Bệnh Nhân Tối Đa trong hệ thống!');
        }

        // 2. Đếm số lượng phiếu khám đã lập trong ngày hôm nay
        const countToday = await PhieuKhamRepo.CountByDate(today);

        // 3. Kiểm tra logic cốt lõi
        if (countToday >= maxBenhNhan) {
            throw new Error(`Phòng mạch đã đạt giới hạn tối đa ${maxBenhNhan} bệnh nhân trong ngày hôm nay. Không thể tiếp nhận thêm!`);
        }

        // 4. Nếu qua được cửa kiểm tra, tiến hành lưu phiếu khám (repo sẽ tính SoThuTu)
        const pkData = await PhieuKhamRepo.Create(MaNV, MaBN, today);
        
        return {
            MaPK: pkData.MaPK,
            MaNV,
            MaBN,
            NgayKham: today,
            SoThuTu: pkData.SoThuTu // Lấy SoThuTu từ database
        };
    }

    async GetAllPhieuKham() {
        // Lấy tất cả phiếu khám từ DB (đã sắp xếp theo NgayKham và SoThuTu)
        const phieuKhamList = await PhieuKhamRepo.GetAll();

        // Chế thế ngày thành chuỗi đăng DATE
        return phieuKhamList.map(pk => ({
            MaPK: pk.MaPK,
            MaNV: pk.MaNV,
            MaBN: pk.MaBN,
            NgayKham: pk.NgayKham.toISOString().split('T')[0], // YYYY-MM-DD format
            SoThuTu: pk.SoThuTu
        }));
    }
}

module.exports = new PhieuKhamService();