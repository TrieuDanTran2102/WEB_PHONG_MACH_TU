const express = require('express');
const router = express.Router();
const PhieuKhamController = require('../controllers/PhieuKhamController');
const {XacThuc, PhanQuyen} = require('../middlewares/AuthMiddleware');

router.post(
    '/', 
    XacThuc, 
    PhanQuyen('BacSi'), 
    PhieuKhamController.Create
);

module.exports = router;