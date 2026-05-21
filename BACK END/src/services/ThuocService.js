const ThuocRepo = require('../repositories/ThuocRepo');

exports.GetAllThuoc = async () => {
  return await ThuocRepo.GetAllThuoc();
};

exports.GetThuocById = async (id) => {
  const thuoc = await ThuocRepo.GetThuocById(id);
  if (!thuoc) throw { status: 404, message: 'Không tìm thấy thuốc' };
  return thuoc;
};

exports.SearchThuoc = async (keyword) => {
    if (!keyword || keyword.trim() === '')
        throw { status: 400, message: 'Từ khoá tìm kiếm không được để trống' };
    return ThuocRepo.SearchThuocByName(keyword.trim());
};

exports.CreateThuoc = async (thuoc) => {
  if (!thuoc.TenThuoc)
    throw { status: 400, message: 'Tên thuốc không được để trống' };
  await ThuocRepo.CreateThuoc(thuoc);
  return await ThuocRepo.GetThuocById(thuoc.MaThuoc);
};
 
exports.UpdateThuoc = async (id, thuoc) => {
  const existing = await ThuocRepo.GetThuocById(id);
  if (!existing) 
    throw { status: 404, message: 'Không tìm thấy thuốc' };
  await ThuocRepo.UpdateThuoc(thuoc);
  return await ThuocRepo.GetThuocById(id);
};
 
exports.DeleteThuoc = async (id) => {
  const existing = await ThuocRepo.GetThuocById(id);
  if (!existing) 
    throw { status: 404, message: 'Không tìm thấy thuốc' };
  const used = await ThuocRepo.IsThuocUsed(id);
  if (used) 
    throw { status: 400, message: 'Thuốc đang được sử dụng, không thể xóa' };
  await ThuocRepo.DeleteThuoc(id);
};