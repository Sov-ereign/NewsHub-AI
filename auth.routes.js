const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('./controller');

router.post('/signup', registerUser);
router.post('/login', loginUser);

module.exports = router;





