const BenhNhanRepo = require('../repositories/BenhNhanRepo');
const PhieuKhamService = require('./PhieuKhamService');

class BenhNhanService {
    async GetAll() {
        return await BenhNhanRepo.GetAll();
    }

    // MaNV: lấy từ token (req.user.maNV) truyền vào từ Controller
    async Create(data, MaNV) {
        // Validate các trường bắt buộc
        if (!data.TenBN || !data.CCCD || !data.GioiTinh || !data.SDT) {
            throw { status: 400, message: 'Vui lòng cung cấp đầy đủ: Họ tên, CCCD, Giới tính, Số điện thoại!' };
        }
        // Kiểm tra CCCD đã tồn tại chưa
        const isExisted = await BenhNhanRepo.CheckExists(data.CCCD);
        if (isExisted) {
            throw { status: 409, message: 'Bệnh nhân với CCCD này đã tồn tại!' };
        }
        // Email không bắt buộc — nếu trống thì truyền null (Repo đã xử lý)
        const maBN = await BenhNhanRepo.Create(data);

        // Tự động tạo phiếu khám ngay sau khi lập hồ sơ
        const phieuKham = await PhieuKhamService.CreatePhieuKham(MaNV || null, maBN);

        return { maBN, maPK: phieuKham.MaPK, soThuTu: phieuKham.SoThuTu };
    }

    async Update(MaBN, dataUpdate) {
        const check = await BenhNhanRepo.GetById(MaBN);
        if (!check) throw { status: 404, message: 'Không tìm thấy bệnh nhân!' };
        
        await BenhNhanRepo.Update(MaBN, dataUpdate);
        return { message: 'Cập nhật thành công' };
    }

    async Delete(MaBN) {
        const check = await BenhNhanRepo.GetById(MaBN);
        if (!check) throw { status: 404, message: 'Không tìm thấy bệnh nhân!' };

        // Kiểm tra xem đã từng khám chưa
        const daKham = await BenhNhanRepo.CheckCoPhieuKham(MaBN);
        if (daKham) {
            throw { status: 400, message: 'Bệnh nhân đã có lịch sử khám, không thể xóa!' };
        }
        // Gọi đúng tên method trong Repo (Remove, không phải Delete)
        return await BenhNhanRepo.Remove(MaBN);
    }
}
module.exports = new BenhNhanService();