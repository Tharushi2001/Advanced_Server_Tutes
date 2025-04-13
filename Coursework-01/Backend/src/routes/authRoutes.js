const express = require('express');
const AuthController = require('../controllers/AuthController');

const router = express.Router();

router.post('/register', AuthController.register); //register router
router.post('/login', AuthController.login);       //login
router.post('/logout', AuthController.logout);     //logout

module.exports = router;