const express = require('express');
const router = express.Router();
const ThuocController = require('../controllers/ThuocController');
const { XacThuc, PhanQuyen } = require('../middlewares/AuthMiddleware');

// Phân quyền admin, bác sĩ, lễ tân được phép xem danh sách thuốc
router.get(
    '/search',
    XacThuc,
    PhanQuyen('BacSi', 'LeTan'),
    ThuocController.SearchThuoc
);

router.get(
    '/', 
    XacThuc, 
    PhanQuyen('BacSi', 'LeTan'), 
    ThuocController.GetAllThuoc
);

router.get(
    '/:id', 
    XacThuc, 
    PhanQuyen('BacSi', 'LeTan'),  
    ThuocController.GetThuocById
);

router.post(
    '/',
    XacThuc, 
    PhanQuyen('LeTan'), 
    ThuocController.CreateThuoc
);

router.put(
    '/:id',
    XacThuc, PhanQuyen('LeTan'), 
    ThuocController.UpdateThuoc
);

router.delete(
    '/:id', 
    XacThuc, 
    PhanQuyen('LeTan'), 
    ThuocController.DeleteThuoc
);

module.exports = router;