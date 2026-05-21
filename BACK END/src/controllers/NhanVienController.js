const NhanVienService = require('../services/NhanVienService');

class NhanVienController {
    async GetAll(req, res) {
        try {
            const data = await NhanVienService.GetAll();
            res.status(200).json({ status: 'success', data });
        } catch (error) {
            res.status(500).json({ status: 'error', message: error.message });
        }
    }

    async Create(req, res) {
        try {
            const id = await NhanVienService.Create(req.body);
            res.status(201).json({ status: 'success', message: 'Thêm nhân viên thành công', MaNV: id });
        } catch (error) {
            res.status(error.status || 500).json({ status: 'error', message: error.message });
        }
    }

    async Update(req, res) {
        try {
            const result = await NhanVienService.Update(req.params.id, req.body);
            res.status(200).json({ status: 'success', data: result });
        } catch (error) {
            res.status(error.status || 500).json({ status: 'error', message: error.message });
        }
    }

    async Delete(req, res) {
        try {
            const result = await NhanVienService.Delete(req.params.id);
            res.status(200).json({ status: 'success', data: result });
        } catch (error) {
            res.status(error.status || 500).json({ status: 'error', message: error.message });
        }
    }
}
module.exports = new NhanVienController();