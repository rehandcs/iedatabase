// config/db.js
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

pool.connect((err, client, release) => {
    if (err) {
        console.error('[DATABASE] Gagal terhubung ke Neon DB:', err.stack);
    } else {
        console.log('[DATABASE] Berhasil terhubung ke PostgreSQL (Neon)!');
    }
});

module.exports = pool;