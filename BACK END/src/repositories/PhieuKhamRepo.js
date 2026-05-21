const { sql, poolPromise } = require('../config/database');

class PhieuKhamRepo {
    async Create(data) {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('MaNV', sql.Int, data.MaNV)
            .input('MaBN', sql.Int, data.MaBN)
            .input('NgayKham', sql.Date, data.NgayKham)
            .query(`
                INSERT INTO PHIEUKHAM (MaNV, MaBN, NgayKham)
                OUTPUT INSERTED.MaPK
                VALUES (@MaNV, @MaBN, @NgayKham)
            `);
        return result.recordset[0].MaPK;
    }

    async CountByDate(date) {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('date', sql.Date, date)
            .query('SELECT COUNT(*) as Count FROM PHIEUKHAM WHERE NgayKham = @date');
        return result.recordset[0].Count;
    }
}
module.exports = new PhieuKhamRepo();