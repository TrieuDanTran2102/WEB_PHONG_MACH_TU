const { sql, poolPromise } = require('../config/database');

class LoaiBenhRepo {
    async GetAll() {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT * FROM LOAIBENH');
        return result.recordset;
    }

    async Create(tenBenh) {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('TenBenh', sql.NVarChar, tenBenh)
            .query(`
                INSERT INTO LOAIBENH (TenBenh) 
                OUTPUT INSERTED.MaLoaiBenh 
                VALUES (@TenBenh)
            `);
        return result.recordset[0].MaLoaiBenh;
    }

    async Update(maLoaiBenh, tenBenh) {
        const pool = await poolPromise;
        await pool.request()
            .input('MaLoaiBenh', sql.Int, maLoaiBenh)
            .input('TenBenh', sql.NVarChar, tenBenh)
            .query('UPDATE LOAIBENH SET TenBenh = @TenBenh WHERE MaLoaiBenh = @MaLoaiBenh');
    }

    async CheckDaSuDung(maLoaiBenh) {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('MaLoaiBenh', sql.Int, maLoaiBenh)
            .query('SELECT COUNT(*) as SoLan FROM CT_LOAIBENH WHERE MaLoaiBenh = @MaLoaiBenh');
        return result.recordset[0].SoLan > 0;
    }

    async Remove(maLoaiBenh) {
        const pool = await poolPromise;
        await pool.request()
            .input('MaLoaiBenh', sql.Int, maLoaiBenh)
            .query('DELETE FROM LOAIBENH WHERE MaLoaiBenh = @MaLoaiBenh');
    }
}
module.exports = new LoaiBenhRepo();