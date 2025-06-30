const express = require('express');
const router = express.Router();
const { getUserSavedArticles } = require('./controller');
const { saveSummary } = require('./controller');
const authMiddleware = require('./authMiddleware');

router.get('/saved', authMiddleware, getUserSavedArticles);
router.post('/saved', authMiddleware, saveSummary);

module.exports = router;





