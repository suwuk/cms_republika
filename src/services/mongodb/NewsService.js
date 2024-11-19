const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const News = require('./models/news'); // Path menuju model
const connectDB = require('./config/database');

connectDB();

class NewsService {
  async addNews({
    title,
    content,
    status,
    scheduleDate,
    description,
    isHeadline,
    isUnggulan,
    reporter,
    userId,
    categoryId,
  }) {

    console.log(title,userId)
    const newsId = `news-${nanoid(16)}`;
    const news = new News({
      news_id: newsId,
      title,
      content,
      status,
      schedule_date: scheduleDate,
      description,
      is_headline: isHeadline,
      is_unggulan: isUnggulan,
      reporter,
      penulis_id: userId,
      category_id: categoryId,
    });
    console.log(news)

    try {
      await news.save();
      return news.newsId;
    } catch (err) {
      throw new InvariantError('Berita gagal ditambahkan');
    }
  }

  async getNews(page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    try {
      const totalItems = await News.countDocuments();
      const totalPages = Math.ceil(totalItems / limit);
      const news = await News.find()
        .sort({ scheduleDate: -1 }) // Sort by scheduleDate DESC
        .skip(skip)
        .limit(limit);

      return {
        news,
        pagination: {
          page,
          limit,
          totalItems,
          totalPages,
        },
      };
    } catch (err) {
      throw new Error('Gagal mengambil data berita');
    }
  }

  async getNewsById(id) {
    const news = await News.findOne({ newsId: id });

    if (!news) {
      throw new NotFoundError('Berita tidak ditemukan');
    }

    return news;
  }

  async editNewsById(
    id,
    {
      title,
      content,
      status,
      scheduleDate,
      description,
      isHeadline,
      isUnggulan,
      reporter,
      categoryId,
    }
  ) {
    const news = await News.findOneAndUpdate(
      { newsId: id },
      {
        title,
        content,
        status,
        scheduleDate,
        description,
        isHeadline,
        isUnggulan,
        reporter,
        categoryId,
      },
      { new: true } // Return the updated document
    );

    if (!news) {
      throw new NotFoundError('Gagal memperbarui Berita. Id tidak ditemukan');
    }

    return news;
  }

  async deleteNewsById(id) {
    const news = await News.findOneAndDelete({ newsId: id });

    if (!news) {
      throw new NotFoundError('Berita gagal dihapus. Id tidak ditemukan');
    }
  }
}

module.exports = NewsService;
