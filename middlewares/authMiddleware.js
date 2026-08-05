const cekAutentikasi = (req, res, next) => {
    // Anggap saja kita mengecek ID dari header yang dikirim pengguna
    const userId = req.header('User-ID');
    
    console.log(`[MIDDLEWARE] Mengecek keamanan ID pengguna...`);

    if (userId === 'KARYAWAN-001') {
        console.log(`[MIDDLEWARE] "Oke, orang ini punya akses. Silakan masuk ke Controller."`);
        next(); // Lolos, silakan lanjut ke fungsi Controller!
    } else {
        console.log(`[MIDDLEWARE] "Akses ditolak! Jangan coba-coba masuk."`);
        res.status(401).json({ error: 'Akses Ditolak. Anda bukan karyawan yang sah.' });
    }
};

module.exports = cekAutentikasi;