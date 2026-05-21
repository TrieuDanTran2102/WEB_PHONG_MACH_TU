const { poolPromise } = require('../config/database');
const sql = require('mssql');

exports.CreateChiTietDonThuoc = async (item, transaction) => {
    const request = transaction.request();
    await request
        .input('MaPK', sql.NVarChar, item.MaPK)
        .input('MaThuoc', sql.NVarChar, item.MaThuoc)
        .input('SoLuongThuoc', sql.Int, item.SoLuongThuoc)
        .input('DonGia', sql.Float, item.DonGiaBan)
        .input('ThanhTien', sql.Float, item.ThanhTien)
        .query(
            'INSERT INTO CT_PHIEUKHAM (MaPK, MaThuoc, SoLuongThuoc, DonGiaBan, ThanhTien)\
            VALUES (@MaPK, @MaThuoc, @SoLuongThuoc, @DonGia, @ThanhTien)'
        );
};