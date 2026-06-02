const BenhNhanService = require('../services/BenhNhanService');

class BenhNhanController {
    async GetAll(req, res) {
        try {
            const data = await BenhNhanService.GetAll();
            res.status(200).json({ status: 'success', data });
        } catch (error) {
            res.status(500).json({ status: 'error', message: error.message });
        }
    }

    async Create(req, res) {
        try {
            // Lấy MaNV từ JWT token (do XacThuc middleware gắn vào req.user)
            const MaNV = req.user?.maNV || null;

            const result = await BenhNhanService.Create(req.body, MaNV);

            // result = { maBN, maPK, soThuTu }
            res.status(201).json({
                status: 'success',
                message: 'Lập hồ sơ và tạo phiếu khám thành công!',
                maBN: result.maBN,
                maPK: result.maPK,
                soThuTu: result.soThuTu
            });
        } catch (error) {
            res.status(error.status || 500).json({ status: 'error', message: error.message });
        }
    }

    async Update(req, res) {
        try {
            const result = await BenhNhanService.Update(req.params.id, req.body);
            res.status(200).json({ status: 'success', data: result });
        } catch (error) {
            res.status(error.status || 500).json({ status: 'error', message: error.message });
        }
    }

    async Delete(req, res) {
        try {
            await BenhNhanService.Delete(req.params.id);
            res.status(200).json({ status: 'success', message: 'Đã xóa bệnh nhân' });
        } catch (error) {
            res.status(error.status || 500).json({ status: 'error', message: error.message });
        }
    }
}
module.exports = new BenhNhanController();