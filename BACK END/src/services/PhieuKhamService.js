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
            NgayKham: pk.NgayKham ? (new Date(pk.NgayKham)).toISOString().split('T')[0] : null,
            SoThuTu: pk.SoThuTu,
            TenBN: pk.TenBN,
            GioiTinh: pk.GioiTinh,
            NgaySinh: pk.NgaySinh ? (new Date(pk.NgaySinh)).toISOString().split('T')[0] : null,
            CCCD: pk.CCCD || null,
            SoDienThoai: pk.SDT || null
        }));
    }

    async GetHistoryByPatient(MaBN, years = 5) {
        const rows = await PhieuKhamRepo.GetHistoryByPatient(MaBN, years);
        return rows.map(r => ({
            MaPK: r.MaPK,
            NgayKham: r.NgayKham.toISOString().split('T')[0],
            TenBenh: r.TenBenh
        }));
    }

    async GetDiseasesByMaPK(MaPK) {
        const rows = await PhieuKhamRepo.GetDiseasesByMaPK(MaPK);
        return rows.map(r => ({
            MaLoaiBenh: r.MaLoaiBenh,
            TenBenh: r.TenBenh,
            TrieuChung: r.TrieuChung,
            GhiChu: r.GhiChu
        }));
    }

    async GetPrescriptionsByMaPK(MaPK) {
        const rows = await PhieuKhamRepo.GetPrescriptionsByMaPK(MaPK);
        return rows.map(r => ({
            MaThuoc: r.MaThuoc,
            TenThuoc: r.TenThuoc,
            SoLuongThuoc: r.SoLuongThuoc,
            DonGiaBan: r.DonGiaBan,
            ThanhTien: r.ThanhTien,
            DonVi: r.DonVi,
            CachDung: r.CachDung
        }));
    }

    async DeletePrescription(MaPK, MaThuoc) {
        await PhieuKhamRepo.DeletePrescription(MaPK, MaThuoc);
        return true;
    }
}

module.exports = new PhieuKhamService();