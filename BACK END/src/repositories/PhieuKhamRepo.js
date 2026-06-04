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

    async GetFullDetail(MaPK) {
        const pool = await poolPromise;

        // 1. Thông tin phiếu khám + bệnh nhân
        const pkResult = await pool.request()
            .input('MaPK', sql.Int, MaPK)
            .query(`
                SELECT 
                    pk.MaPK, pk.MaNV, pk.MaBN, pk.NgayKham, pk.SoThuTu,
                    bn.TenBN, bn.CCCD, bn.GioiTinh, bn.NgaySinh, bn.DiaChi, bn.SDT, bn.Email
                FROM PHIEUKHAM pk
                JOIN BENHNHAN bn ON bn.MaBN = pk.MaBN
                WHERE pk.MaPK = @MaPK
            `);
        if (!pkResult.recordset[0]) return null;

        // 2. Hóa đơn liên kết (nếu đã có)
        const hdResult = await pool.request()
            .input('MaPK', sql.Int, MaPK)
            .query(`
                SELECT MaHD, NgayLap, TongTienThuoc, TienKham, TongTien
                FROM HOADON WHERE MaPK = @MaPK
            `);

        // 3. Chi tiết đơn thuốc
        const ctResult = await pool.request()
            .input('MaPK', sql.Int, MaPK)
            .query(`
                SELECT 
                    ct.MaThuoc, t.TenThuoc, ct.SoLuongThuoc, ct.DonGiaBan, ct.ThanhTien,
                    dvt.TenDVT, cd.MoTaCachDung AS CachDung
                FROM CT_PHIEUKHAM ct
                JOIN THUOC t ON t.MaThuoc = ct.MaThuoc
                LEFT JOIN DONVITINH dvt ON dvt.MaDVT = t.MaDVT
                LEFT JOIN CACHDUNG cd ON cd.MaCachDung = t.MaCachDung
                WHERE ct.MaPK = @MaPK
                ORDER BY ct.MaThuoc
            `);

        return {
            phieuKham: pkResult.recordset[0],
            hoaDon: hdResult.recordset[0] || null,
            chiTietThuoc: ctResult.recordset
        };
    }

    async GetAll() {
        const pool = await poolPromise;
        const result = await pool.request()
            .query(`
                  SELECT pk.MaPK, pk.MaNV, pk.MaBN, pk.NgayKham, pk.SoThuTu,
                      b.TenBN, b.GioiTinh, b.NgaySinh, b.CCCD, b.SDT
                FROM PHIEUKHAM pk
                LEFT JOIN BENHNHAN b ON b.MaBN = pk.MaBN
                ORDER BY pk.NgayKham ASC, pk.SoThuTu ASC
            `);
        return result.recordset;
    }

    async GetHistoryByPatient(MaBN, years = 5) {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('MaBN', sql.Int, MaBN)
            .input('Years', sql.Int, years)
            .query(`
                SELECT pk.MaPK, pk.NgayKham,
                    STRING_AGG(lb.TenBenh, ', ') AS TenBenh
                FROM PHIEUKHAM pk
                LEFT JOIN CT_LOAIBENH ctlb ON ctlb.MaPK = pk.MaPK
                LEFT JOIN LOAIBENH lb ON lb.MaLoaiBenh = ctlb.MaLoaiBenh
                WHERE pk.MaBN = @MaBN
                  AND pk.NgayKham >= DATEADD(year, -@Years, GETDATE())
                GROUP BY pk.MaPK, pk.NgayKham
                ORDER BY pk.NgayKham DESC;
            `);
        return result.recordset;
    }

    // Get diseases and symptoms for a specific MaPK
    async GetDiseasesByMaPK(MaPK) {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('MaPK', sql.Int, MaPK)
            .query(`
                SELECT ctlb.MaLoaiBenh, lb.TenBenh, ctlb.TrieuChung, ctlb.GhiChu
                FROM CT_LOAIBENH ctlb
                LEFT JOIN LOAIBENH lb ON lb.MaLoaiBenh = ctlb.MaLoaiBenh
                WHERE ctlb.MaPK = @MaPK
            `);
        return result.recordset;
    }

    async GetPrescriptionsByMaPK(MaPK) {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('MaPK', sql.Int, MaPK)
            .query(`
                SELECT ct.MaThuoc, t.TenThuoc, ct.SoLuongThuoc, ct.DonGiaBan, ct.ThanhTien,
                       dvt.TenDVT as DonVi, cd.MoTaCachDung as CachDung
                FROM CT_PHIEUKHAM ct
                LEFT JOIN THUOC t ON t.MaThuoc = ct.MaThuoc
                LEFT JOIN DONVITINH dvt ON dvt.MaDVT = t.MaDVT
                LEFT JOIN CACHDUNG cd ON cd.MaCachDung = t.MaCachDung
                WHERE ct.MaPK = @MaPK
                ORDER BY ct.MaThuoc
            `);
        return result.recordset;
    }

    async DeletePrescription(MaPK, MaThuoc) {
        const pool = await poolPromise;
        await pool.request()
            .input('MaPK', sql.Int, MaPK)
            .input('MaThuoc', sql.Int, MaThuoc)
            .query('DELETE FROM CT_PHIEUKHAM WHERE MaPK = @MaPK AND MaThuoc = @MaThuoc');
        return true;
    }

    /**
     * Save / update details for a phieu kham inside a transaction.
     * payload: { symptoms, diagnosis, diseases: [{MaLoaiBenh, TenBenh, TrieuChung, GhiChu}],
     *            prescriptions: [{MaThuoc, TenThuoc, SoLuongThuoc, CachDung}] }
     */
    async SaveDetails(MaPK, MaNV, payload) {
        const pool = await poolPromise;
        const transaction = new sql.Transaction(pool);
        try {
            await transaction.begin();

            const request = transaction.request();

            // 1) Update CT_LOAIBENH: remove existing, then insert new ones
            await request.input('MaPK', sql.Int, MaPK).query('DELETE FROM CT_LOAIBENH WHERE MaPK = @MaPK');

            if (Array.isArray(payload.diseases)) {
                for (const d of payload.diseases) {
                    let maLoai = d.MaLoaiBenh ? parseInt(d.MaLoaiBenh, 10) : null;
                    const tenBenh = (d.TenBenh || '').trim();

                    if (!maLoai) {
                        // Try to find an existing LOAIBENH by name (reuse if exists)
                        if (tenBenh) {
                            const found = await transaction.request()
                                .input('TenBenhLookup', sql.NVarChar, tenBenh)
                                .query('SELECT MaLoaiBenh FROM LOAIBENH WHERE TenBenh = @TenBenhLookup');
                            if (found.recordset[0]) {
                                maLoai = found.recordset[0].MaLoaiBenh;
                            }
                        }

                        // If still not found, create new LOAIBENH
                        if (!maLoai) {
                            // Determine next sequential MaLoaiBenh (max + 1)
                            const maxRes = await transaction.request().query('SELECT ISNULL(MAX(MaLoaiBenh), 0) AS maxId FROM LOAIBENH');
                            const nextId = (maxRes.recordset[0] && maxRes.recordset[0].maxId) ? (Number(maxRes.recordset[0].maxId) + 1) : 1;

                            // Insert with explicit MaLoaiBenh so IDs remain contiguous
                            const insSql = `SET IDENTITY_INSERT LOAIBENH ON; INSERT INTO LOAIBENH (MaLoaiBenh, TenBenh) VALUES (${nextId}, @TenBenh); SET IDENTITY_INSERT LOAIBENH OFF; SELECT ${nextId} AS MaLoaiBenh;`;
                            const ins = await transaction.request()
                                .input('TenBenh', sql.NVarChar, tenBenh || 'Không rõ')
                                .query(insSql);
                            maLoai = ins.recordset[0].MaLoaiBenh;

                            // Reseed identity to keep future identity inserts consistent
                            try {
                                await transaction.request().query(`DBCC CHECKIDENT('LOAIBENH', RESEED, ${maLoai})`);
                            } catch (e) {
                                // ignore reseed errors but log if needed
                            }
                        }
                    } else if (tenBenh) {
                        // If MaLoaiBenh provided and TenBenh given, update name if different
                        await transaction.request()
                            .input('MaLoaiBenh', sql.Int, maLoai)
                            .input('TenBenh', sql.NVarChar, tenBenh)
                            .query('UPDATE LOAIBENH SET TenBenh = @TenBenh WHERE MaLoaiBenh = @MaLoaiBenh');
                    }

                    await transaction.request()
                        .input('MaPK', sql.Int, MaPK)
                        .input('MaLoaiBenh', sql.Int, maLoai)
                        .input('TrieuChung', sql.NVarChar, d.TrieuChung || '')
                        .input('GhiChu', sql.NVarChar, d.GhiChu || '')
                        .query('INSERT INTO CT_LOAIBENH (MaPK, MaLoaiBenh, TrieuChung, GhiChu) VALUES (@MaPK, @MaLoaiBenh, @TrieuChung, @GhiChu)');
                }
            }

            // 2) Update CT_PHIEUKHAM (prescriptions): remove existing then insert provided
            await transaction.request().input('MaPK', sql.Int, MaPK).query('DELETE FROM CT_PHIEUKHAM WHERE MaPK = @MaPK');

            if (Array.isArray(payload.prescriptions)) {
                for (const p of payload.prescriptions) {
                    let maThuoc = p.MaThuoc ? parseInt(p.MaThuoc, 10) : null;
                    // If MaThuoc not provided, try to find by name
                    if (!maThuoc && p.TenThuoc) {
                        const found = await transaction.request().input('TenThuoc', sql.NVarChar, p.TenThuoc).query('SELECT MaThuoc, DonGiaBan FROM THUOC WHERE TenThuoc = @TenThuoc');
                        if (found.recordset[0]) {
                            maThuoc = found.recordset[0].MaThuoc;
                        }
                    }

                    if (!maThuoc) {
                        // skip unknown medicine
                        continue;
                    }

                    // Get current price
                    const priceRes = await transaction.request().input('MaThuocVal', sql.Int, maThuoc).query('SELECT DonGiaBan FROM THUOC WHERE MaThuoc = @MaThuocVal');
                    const donGia = priceRes.recordset[0] ? Number(priceRes.recordset[0].DonGiaBan) : (p.DonGiaBan || 0);
                    const soLuong = Number(p.SoLuongThuoc || p.quantity || 1);
                    const thanhTien = donGia * soLuong;

                    await transaction.request()
                        .input('MaPK', sql.Int, MaPK)
                        .input('MaThuoc', sql.Int, maThuoc)
                        .input('SoLuongThuoc', sql.Int, soLuong)
                        .input('DonGia', sql.Float, donGia)
                        .input('ThanhTien', sql.Float, thanhTien)
                        .query('INSERT INTO CT_PHIEUKHAM (MaPK, MaThuoc, SoLuongThuoc, DonGiaBan, ThanhTien) VALUES (@MaPK, @MaThuoc, @SoLuongThuoc, @DonGia, @ThanhTien)');
                }
            }

            // 3) Update HOADON totals if exists
            const totalRes = await transaction.request().input('MaPK', sql.Int, MaPK).query('SELECT SUM(ThanhTien) AS TongTienThuoc FROM CT_PHIEUKHAM WHERE MaPK = @MaPK');
            const tongThuoc = totalRes.recordset[0] && totalRes.recordset[0].TongTienThuoc ? Number(totalRes.recordset[0].TongTienThuoc) : 0;

            const hd = await transaction.request().input('MaPK', sql.Int, MaPK).query('SELECT MaHD, TienKham FROM HOADON WHERE MaPK = @MaPK');
            if (hd.recordset[0]) {
                const tienKham = Number(hd.recordset[0].TienKham || 0);
                const tong = tongThuoc + tienKham;
                await transaction.request()
                    .input('TongTienThuoc', sql.Float, tongThuoc)
                    .input('TongTien', sql.Float, tong)
                    .input('MaPK', sql.Int, MaPK)
                    .query('UPDATE HOADON SET TongTienThuoc = @TongTienThuoc, TongTien = @TongTien WHERE MaPK = @MaPK');
            }

            await transaction.commit();
            return { MaPK, updated: true };
        } catch (err) {
            try { await transaction.rollback(); } catch (e) { /* ignore */ }
            throw err;
        }
    }
}
module.exports = new PhieuKhamRepo();