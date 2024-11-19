const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
  news_id: {
    type: String,
    required: true,
    unique: true,
  },
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
    maxlength: 20,
  },
  schedule_date: {
    type: String,
    required: true,
  },
  // publication_date: {
  //   type: Date,
  //   required: true,
  // },
  description: {
    type: String,
    required: true,
  },
  is_headline: {
    type: Boolean,
    required: true,
  },
  is_unggulan: {
    type: Boolean,
    required: true,
  },
  reporter: {
    type: String,
    required: true,
    maxlength: 50,
  },
  penulis_id: {
    type: Number,
    required: true,
  },
  category_id: {
    type: String,
    required: true,
    maxlength: 30,
  },
});
// , { timestamps: true }); // `timestamps` menambahkan `createdAt` dan `updatedAt` secara otomatis

const News = mongoose.model('News', newsSchema);

module.exports = News;
