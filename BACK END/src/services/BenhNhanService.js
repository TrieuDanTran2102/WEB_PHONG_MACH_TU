const BenhNhanRepo = require('../repositories/BenhNhanRepo');

class BenhNhanService {
    async GetAll() {
        return await BenhNhanRepo.GetAll();
    }

    async Create(data) {
        // Kiểm tra CCCD đã tồn tại chưa
        const isExisted = await BenhNhanRepo.CheckExists(data.CCCD);
        if (isExisted) {
            throw { status: 409, message: 'Bệnh nhân với CCCD này đã tồn tại!' };
        }
        return await BenhNhanRepo.Create(data);
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
        return await BenhNhanRepo.Delete(MaBN);
    }
}
module.exports = new BenhNhanService();