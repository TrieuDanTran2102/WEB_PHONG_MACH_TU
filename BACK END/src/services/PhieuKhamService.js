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

        // 4. Nếu qua được cửa kiểm tra, tiến hành lưu phiếu khám
        const MaPK = await PhieuKhamRepo.Create(MaNV, MaBN, today);
        
        return {
            MaPK,
            MaNV,
            MaBN,
            NgayKham: today,
            SoThuTu: countToday + 1 // Cung cấp luôn số thứ tự cho bệnh nhân
        };
    }
}

module.exports = new PhieuKhamService();