const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: String,
  passwordHash: String,
  savedArticles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'SavedArticle' }]
});

module.exports = mongoose.model('User', UserSchema);





