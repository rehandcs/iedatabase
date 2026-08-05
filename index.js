// index.js
const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const productionRoutes = require('./routes/productionRoutes');

const app = express();

// Middleware
app.use(cors()); // Mencegah error CORS saat di Vercel
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MENYAJIKAN FILE STATIS DARI FOLDER "public"
app.use(express.static(path.join(__dirname, 'public')));

// Hubungkan Routes API ke endpoint /api
app.use('/api', productionRoutes);

// Fallback route: Jika user mengakses URL utama (/), arahkan ke index.html di public
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// SETUP UNTUK VERCEL & LOKAL
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`\n========================================`);
        console.log(`🚀 Server Backend Berjalan!`);
        console.log(`👉 Buka di browser: http://localhost:${PORT}`);
        console.log(`========================================\n`);
    });
}

// WAJIB ADA UNTUK VERCEL: Export aplikasi Express
module.exports = app;