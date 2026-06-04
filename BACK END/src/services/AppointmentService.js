const AppointmentRepo = require('../repositories/AppointmentRepo');

class AppointmentService {
    validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
    validatePhoneNumber(phone) {
        return /^(0|\+84)[0-9]{9}$/.test(phone);
    }
    validateCCCD(cccd) {
        return /^[0-9]{12}$/.test(cccd);
    }
    validateDate(dateString) {
        return !isNaN(new Date(dateString).getTime());
    }
    isValidAppointmentDate(dateString) {
        const d = new Date(dateString); d.setHours(0,0,0,0);
        const today = new Date();       today.setHours(0,0,0,0);
        return d >= today;
    }
    validateBookingData(data) {
        const errors = [];
        if (!data.TenBN?.trim())  errors.push('Họ tên bệnh nhân không được để trống');
        if (!data.CCCD?.trim())   errors.push('CCCD không được để trống');
        else if (!this.validateCCCD(data.CCCD)) errors.push('CCCD phải là 12 chữ số');
        if (!data.SDT?.trim())    errors.push('Số điện thoại không được để trống');
        else if (!this.validatePhoneNumber(data.SDT)) errors.push('Số điện thoại không hợp lệ');
        if (data.Email?.trim() && !this.validateEmail(data.Email)) errors.push('Email không hợp lệ');
        if (!data.GioiTinh?.trim()) errors.push('Giới tính không được để trống');
        else if (!['Nam','Nữ','Khác'].includes(data.GioiTinh)) errors.push('Giới tính không hợp lệ');
        if (!data.NgayKham?.trim()) errors.push('Ngày khám không được để trống');
        else if (!this.validateDate(data.NgayKham)) errors.push('Ngày khám không hợp lệ');
        else if (!this.isValidAppointmentDate(data.NgayKham)) errors.push('Ngày khám không được nhỏ hơn ngày hôm nay');
        if (data.NgaySinh?.trim() && !this.validateDate(data.NgaySinh)) errors.push('Ngày sinh không hợp lệ');
        return { isValid: errors.length === 0, errors };
    }

    async BookAppointment(data) {
        try {
            // 1. Validate
            const validation = this.validateBookingData(data);
            if (!validation.isValid) {
                throw { status: 400, message: 'Dữ liệu không hợp lệ', errors: validation.errors };
            }

            const emailValue = (data.Email && String(data.Email).trim() !== '') ? data.Email.trim() : null;

            // 2. Luôn tạo BN MỚI và PK MỚI — không bao giờ update/ghi đè BN cũ
            //    Nếu CCCD đã tồn tại → báo lỗi rõ ràng để frontend xử lý
            const existingPatient = await AppointmentRepo.CheckPatientByCCCD(data.CCCD);

            let maBN, maPK;

            if (existingPatient) {
                // BN đã có trong hệ thống → chỉ tạo thêm phiếu khám mới, KHÔNG update BN
                maBN = existingPatient.MaBN;
                maPK = await AppointmentRepo.CreateAppointmentForExistingPatient(
                    maBN,
                    data.NgayKham,
                    data.MaNV || null
                );
                console.log(`[AppointmentService] BN đã tồn tại MaBN=${maBN}, tạo PK mới MaPK=${maPK}`);
            } else {
                // BN hoàn toàn mới → tạo BN + PK trong transaction
                const result = await AppointmentRepo.BookAppointment({
                    TenBN:    data.TenBN.trim(),
                    CCCD:     data.CCCD.trim(),
                    GioiTinh: data.GioiTinh.trim(),
                    SDT:      data.SDT.trim(),
                    Email:    emailValue,
                    DiaChi:   data.DiaChi?.trim() || '',
                    NgaySinh: data.NgaySinh || null,
                    NgayKham: data.NgayKham,
                    MaNV:     data.MaNV || null
                });
                maBN = result.maBN;
                maPK = result.maPK;
                console.log(`[AppointmentService] Tạo BN mới MaBN=${maBN}, MaPK=${maPK}`);
            }

            return {
                success: true,
                data: { maBN, maPK },
                message: 'Đặt lịch khám thành công! Chúng tôi sẽ liên hệ xác nhận sớm nhất.'
            };

        } catch (error) {
            console.error('[AppointmentService] Lỗi:', error);
            throw {
                status: error.status || 500,
                message: error.message || 'Lỗi đặt lịch khám',
                errors: error.errors || []
            };
        }
    }
}

module.exports = new AppointmentService();