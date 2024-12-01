const express = require('express');
const { login } = require('../Controller/authController');
const router = express.Router();

router.post('/auth', login);

module.exports = router;
