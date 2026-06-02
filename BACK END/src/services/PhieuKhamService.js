const PhieuKhamRepo = require('../repositories/PhieuKhamRepo');
const ThamSoRepo = require('../repositories/ThamSoRepo');

// Giá trị mặc định nếu chưa cấu hình THAMSO
const DEFAULT_SO_BENH_NHAN_TOI_DA = 40;

class PhieuKhamService {
    async CreatePhieuKham(MaNV, MaBN) {
        const today = new Date().toISOString().split('T')[0];

        // 1. Lấy quy định "Số bệnh nhân tối đa" từ DB
        //    Nếu chưa cấu hình → dùng giá trị mặc định (không throw lỗi)
        let maxBenhNhan = await ThamSoRepo.GetByName('SoBenhNhanToiDa');
        if (!maxBenhNhan || isNaN(Number(maxBenhNhan))) {
            maxBenhNhan = DEFAULT_SO_BENH_NHAN_TOI_DA;
        } else {
            maxBenhNhan = Number(maxBenhNhan);
        }

        // 2. Đếm số lượng phiếu khám đã lập trong ngày hôm nay
        const countToday = await PhieuKhamRepo.CountByDate(today);

        // 3. Kiểm tra giới hạn
        if (countToday >= maxBenhNhan) {
            throw new Error(
                `Phòng mạch đã đạt giới hạn tối đa ${maxBenhNhan} bệnh nhân trong ngày hôm nay. Không thể tiếp nhận thêm!`
            );
        }

        // 4. Lưu phiếu khám (Trigger DB tự tính SoThuTu)
        const pkData = await PhieuKhamRepo.Create(MaNV, MaBN, today);

        return {
            MaPK: pkData.MaPK,
            MaNV,
            MaBN,
            NgayKham: today,
            SoThuTu: pkData.SoThuTu
        };
    }

    async GetAllPhieuKham() {
        const phieuKhamList = await PhieuKhamRepo.GetAll();
        return phieuKhamList.map(pk => ({
            MaPK: pk.MaPK,
            MaNV: pk.MaNV,
            MaBN: pk.MaBN,
            NgayKham: pk.NgayKham.toISOString().split('T')[0],
            SoThuTu: pk.SoThuTu
        }));
    }
}

module.exports = new PhieuKhamService();