const express = require('express');
const router = express.Router();
const PhieuKhamController = require('../controllers/PhieuKhamController');
const {XacThuc, PhanQuyen} = require('../middlewares/AuthMiddleware');

router.get(
    '/',
    XacThuc,
    PhieuKhamController.GetAll
);

router.post(
    '/', 
    XacThuc, 
    PhanQuyen('BacSi'), 
    PhieuKhamController.Create
);

// Tạo phiếu khám cho bệnh nhân đã có (roles: LeTan, BacSi, Admin)
router.post(
    '/create-for-patient',
    XacThuc,
    PhanQuyen('LeTan', 'BacSi', 'Admin'),
    PhieuKhamController.CreateForPatient
);

module.exports = router;