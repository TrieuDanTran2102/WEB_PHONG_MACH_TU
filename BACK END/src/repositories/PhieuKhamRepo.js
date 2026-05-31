const { sql, poolPromise } = require('../config/database');

class PhieuKhamRepo {
    async Create(MaNV, MaBN, NgayKham) {
        const pool = await poolPromise;
        
        // Thêm phiếu khám - Trigger sẽ tự động tính SoThuTu
        // Dùng INTO clause vì có trigger trên bảng
        const result = await pool.request()
            .input('MaNV', sql.Int, MaNV)
            .input('MaBN', sql.Int, MaBN)
            .input('NgayKham', sql.Date, NgayKham)
            .query(`
                DECLARE @OutputTable TABLE (MaPK INT, SoThuTu INT);
                INSERT INTO PHIEUKHAM (MaNV, MaBN, NgayKham)
                OUTPUT INSERTED.MaPK, INSERTED.SoThuTu INTO @OutputTable
                VALUES (@MaNV, @MaBN, @NgayKham);
                SELECT * FROM @OutputTable;
            `);
        return result.recordset[0];
    }

    async CountByDate(date) {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('date', sql.Date, date)
            .query('SELECT COUNT(*) as Count FROM PHIEUKHAM WHERE NgayKham = @date');
        return result.recordset[0].Count;
    }

    async GetAll() {
        const pool = await poolPromise;
        const result = await pool.request()
            .query(`
                SELECT MaPK, MaNV, MaBN, NgayKham, SoThuTu
                FROM PHIEUKHAM
                ORDER BY NgayKham ASC, SoThuTu ASC
            `);
        return result.recordset;
    }
}
module.exports = new PhieuKhamRepo();