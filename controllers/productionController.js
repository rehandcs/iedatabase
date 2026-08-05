// controllers/productionController.js
const MachineModel = require('../models/machineModel');

// Handler untuk GET /api/target/:idMesin
exports.hitungTargetMesin = async (req, res) => {
    const idMesin = req.params.idMesin;
    
    console.log(`[CONTROLLER] Meminta data spesifikasi mesin ${idMesin}...`);

    try {
        const spesifikasi = await MachineModel.cariSpesifikasiMesin(idMesin);

        if (!spesifikasi) {
            return res.status(404).json({ error: 'Mesin tidak ditemukan di database.' });
        }

        // Validasi pembagian dengan nol agar tidak terjadi Infinity
        const ctValue = parseFloat(spesifikasi.ct);
        if (ctValue <= 0) {
            return res.status(400).json({ error: 'Nilai Cycle Time (CT) tidak valid (0 atau negatif).' });
        }

        const targetPerJam = Math.floor(3600 / ctValue);
        console.log(`[CONTROLLER] Kalkulasi berhasil: ${targetPerJam} pcs/jam.`);

        res.status(200).json({
            pesan: "Kalkulasi berhasil",
            mesin: spesifikasi.machine,
            cycle_time_detik: spesifikasi.ct,
            target_qty_per_jam: targetPerJam
        });
    } catch (error) {
        console.error('[CONTROLLER] Error di hitungTargetMesin:', error);
        res.status(500).json({ error: 'Terjadi kesalahan pada server saat mengkalkulasi.' });
    }
};

// Handler untuk POST /api/produksi (Dari input.html)
exports.simpanDataProduksi = async (req, res) => {
    console.log(`[CONTROLLER] Menerima data produksi baru...`);
    
    try {
        const dataBaru = req.body;
        
        // Validasi input sederhana
        if(!dataBaru.model || !dataBaru.machine || !dataBaru.ct) {
            return res.status(400).json({ error: 'Data penting (Model, Mesin, CT) tidak lengkap!' });
        }

        const hasilInsert = await MachineModel.tambahDataProduksi(dataBaru);
        
        res.status(201).json({
            message: `Data mesin ${hasilInsert.machine} berhasil disimpan.`,
            data: hasilInsert
        });
    } catch (error) {
        // Cek jika errornya adalah karena nama mesin duplicate di PostgreSQL (kode error: 23505)
        if (error.code === '23505') {
            console.warn(`[CONTROLLER] Duplikat data: Mesin ${req.body.machine} sudah ada.`);
            return res.status(409).json({ error: `Mesin dengan nama '${req.body.machine}' sudah terdaftar!` });
        }

        console.error('[CONTROLLER] Error di simpanDataProduksi:', error);
        res.status(500).json({ error: 'Gagal menyimpan data ke database.' });
    }
};

// Handler untuk GET /api/produksi (Untuk tabel di index.html)
exports.dapatkanSemuaData = async (req, res) => {
    try {
        const semuaData = await MachineModel.ambilSemuaData();
        res.status(200).json(semuaData);
    } catch (error) {
        console.error('[CONTROLLER] Error di dapatkanSemuaData:', error);
        res.status(500).json({ error: 'Gagal mengambil data dari database.' });
    }
};