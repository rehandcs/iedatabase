// models/machineModel.js
const pool = require('../config/db');

const MachineModel = {
    // Fungsi untuk GET (mencari spesifikasi mesin)
    cariSpesifikasiMesin: async (namaMesin) => {
        console.log(`[MODEL] Mencari data mesin '${namaMesin}' di database PostgreSQL...`);
        try {
            const result = await pool.query(
                'SELECT * FROM production_data WHERE machine = $1 LIMIT 1', 
                [namaMesin]
            );
            
            if (result.rows.length > 0) {
                console.log(`[MODEL] Data ditemukan: ${result.rows[0].machine}`);
                return result.rows[0];
            }
            return null; // Return null jika tidak ada
        } catch (err) {
            console.error('[MODEL] Error saat query spesifikasi mesin:', err);
            throw err;
        }
    },

    // Fungsi untuk POST (menyimpan data dari input.html)
    // Fungsi untuk POST (menyimpan data dari input.html)
    tambahDataProduksi: async (data) => {
        console.log(`[MODEL] Menyimpan data mesin '${data.machineType}' ke database...`);
        try {
            const queryText = `
                INSERT INTO production_data (model, area, sub_area, process, machine_type, cycle_time, allowance, target_hour) 
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *
            `;
            // Pastikan penamaan properti objek data ini selaras dengan JSON yang dikirim Frontend (di index.html/input.html)
            const values = [
                data.model, 
                data.area, 
                data.subArea, 
                data.process, 
                data.machineType, 
                data.ct, 
                data.allowance, 
                data.targetHour
            ];
            
            const result = await pool.query(queryText, values);
            return result.rows[0];
        } catch (err) {
            console.error('[MODEL] Error saat insert data produksi:', err);
            throw err; // Lempar ke controller agar bisa di-handle
        }
    },

    // Ambil semua data produksi (Untuk tabel index.html)
    ambilSemuaData: async () => {
        console.log(`[MODEL] Mengambil seluruh data produksi...`);
        try {
            const result = await pool.query('SELECT * FROM production_data ORDER BY created_at DESC');
            return result.rows;
        } catch (err) {
            console.error('[MODEL] Error ambil semua data produksi:', err);
            throw err;
        }
    }
};

module.exports = MachineModel;