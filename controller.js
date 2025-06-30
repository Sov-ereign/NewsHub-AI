const SavedArticle = require('./savedArticle.model');

const saveSummary = async (req, res) => {
  try {
    const { articleId, summary } = req.body;
    const saved = await SavedArticle.create({
      userId: req.user.id,
      articleId,
      summary,
      savedAt: new Date()
    });
    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({ error: 'Failed to save summary.' });
  }
};

module.exports = { saveSummary };

