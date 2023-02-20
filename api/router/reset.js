const express = require("express")
const router = express.Router();
const resetControllers = require('../controllers/reset');

router.post('/request-forgot-password',resetControllers.requestForgotPassword);
router.post('/forgot-password',resetControllers.forgotPassword);

module.exports = router;