const mongoose = require('mongoose');

const SavedArticleSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  articleId: String,
  summary: String,
  savedAt: Date
});

module.exports = mongoose.model('SavedArticle', SavedArticleSchema);