const PhieuKhamService = require('../services/PhieuKhamService');

class PhieuKhamController {
    async Create(req, res) {
        try {
            // MaBN lấy từ frontend gửi lên
            const { MaBN } = req.body; 
            
            // MaNV lấy từ chính Token của người đang đăng nhập (nhờ authMiddleware)
            const MaNV = req.user.maNV; 

            if (!MaBN) {
                return res.status(400).json({ status: 'error', message: 'Vui lòng cung cấp Mã bệnh nhân!' });
            }

            const result = await PhieuKhamService.CreatePhieuKham(MaNV, MaBN);

            res.status(201).json({
                status: 'success',
                message: 'Lập phiếu khám thành công!',
                data: result
            });
        } catch (error) {
            res.status(400).json({
                status: 'error',
                message: error.message
            });
        }
    }
}

module.exports = new PhieuKhamController();