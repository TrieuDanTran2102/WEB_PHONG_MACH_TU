const { sql, poolPromise } = require('../config/database');

class BenhNhanRepo {
    // Lấy danh sách toàn bộ bệnh nhân (Cho Lễ tân xem)
    async GetAll() {
        const pool = await poolPromise;
        const result = await pool.request()
            .query('SELECT * FROM BENHNHAN');
        return result.recordset;
    }

    // Lấy thông tin 1 bệnh nhân theo ID (Rất cần thiết cho Service)
    async GetById(MaBN) {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('MaBN', sql.Int, MaBN)
            .query('SELECT * FROM BENHNHAN WHERE MaBN = @MaBN');
        return result.recordset[0];
    }

    // Kiểm tra bệnh nhân đã tồn tại qua CCCD
    async CheckExists(cccd) {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('cccd', sql.VarChar, cccd)
            .query('SELECT MaBN FROM BENHNHAN WHERE CCCD = @cccd');
        return result.recordset.length > 0;
    }

    // Thêm bệnh nhân mới
    async Create(data) {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('TenBN', sql.NVarChar, data.TenBN)
            .input('CCCD', sql.VarChar, data.CCCD)
            .input('GioiTinh', sql.VarChar, data.GioiTinh)
            .input('NgaySinh', sql.Date, data.NgaySinh)
            .input('DiaChi', sql.NVarChar, data.DiaChi)
            .input('SDT', sql.VarChar, data.SDT)
            .input('Email', sql.VarChar, data.Email)
            .query(`
                INSERT INTO BENHNHAN (TenBN, CCCD, GioiTinh, NgaySinh, DiaChi, SDT, Email)
                OUTPUT INSERTED.MaBN 
                VALUES (@TenBN, @CCCD, @GioiTinh, @NgaySinh, @DiaChi, @SDT, @Email)
            `);
        return result.recordset[0].MaBN;
    }

    // Kiểm tra xem bệnh nhân đã từng khám bệnh chưa (Đổi input tên cột cho chuẩn DB)
    async CheckCoPhieuKham(MaBN) {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('MaBN', sql.Int, MaBN)
            .query('SELECT COUNT(*) as SoLanKham FROM PHIEUKHAM WHERE MaBN = @MaBN');
        return result.recordset[0].SoLanKham > 0;
    }

    // Cập nhật thông tin bệnh nhân (Sửa lại tên cột cho ĐÚNG VỚI DATABASE)
    async Update(MaBN, dataUpdate) {
        const pool = await poolPromise;
        await pool.request()
            .input('MaBN', sql.Int, MaBN)
            .input('TenBN', sql.NVarChar, dataUpdate.TenBN)
            .input('GioiTinh', sql.VarChar, dataUpdate.GioiTinh)
            .input('NgaySinh', sql.Date, dataUpdate.NgaySinh)
            .input('DiaChi', sql.NVarChar, dataUpdate.DiaChi)
            .input('SDT', sql.VarChar, dataUpdate.SDT)
            .input('Email', sql.VarChar, dataUpdate.Email)
            .query(`
                UPDATE BENHNHAN 
                SET TenBN = @TenBN, GioiTinh = @GioiTinh, NgaySinh = @NgaySinh, 
                    DiaChi = @DiaChi, SDT = @SDT, Email = @Email
                WHERE MaBN = @MaBN
            `);
    }

    // Xóa bệnh nhân
    async Remove(MaBN) {
        const pool = await poolPromise;
        await pool.request()
            .input('MaBN', sql.Int, MaBN)
            .query('DELETE FROM BENHNHAN WHERE MaBN = @MaBN');
    }
}

module.exports = new BenhNhanRepo();