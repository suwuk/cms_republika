const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/cms_republika');
    console.log('Database berhasil terhubung');
  } catch (err) {
    console.error('Gagal menghubungkan database:', err);
    process.exit(1); // Keluar dari aplikasi jika koneksi gagal
  }
};

module.exports = connectDB;
