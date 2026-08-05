// routes/productionRoutes.js
const express = require('express');
const router = express.Router();

const authMiddleware = require('../middlewares/authMiddleware');
const productionController = require('../controllers/productionController');

// GET: Hitung target mesin
router.get('/target/:idMesin', (req, res, next) => {
    console.log(`\n[ROUTES] Request Kalkulasi Target untuk Mesin: ${req.params.idMesin}`);
    next();
}, authMiddleware, productionController.hitungTargetMesin);

// POST: Simpan data produksi (Dari input.html)
router.post('/produksi', (req, res, next) => {
    console.log(`\n[ROUTES] Request Simpan Data Produksi Baru`);
    next();
}, authMiddleware, productionController.simpanDataProduksi);

// GET: Ambil semua data produksi untuk tabel index.html
router.get('/produksi', (req, res, next) => {
    console.log(`\n[ROUTES] Request Ambil Semua Data Produksi`);
    next();
}, authMiddleware, productionController.dapatkanSemuaData);

module.exports = router;