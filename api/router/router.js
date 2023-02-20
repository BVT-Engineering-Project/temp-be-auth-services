const express = require("express")
const router = express.Router();
const userRouter = require('./users');
const roleRouter = require("./roles");
const resetRouter = require("./reset");
const userControllers = require('../controllers/users');
const { checkAuth } = require("../middleware/check-auth");
const logoutControllers = require("../controllers/logout");

// auth router
router.post('/users/login', userControllers.login);
router.post('/users/login-bg', userControllers.loginBackgroud);
router.post('/refresh-token', userControllers.refreshToken);
router.get('/check-token', userControllers.checkToken);
router.post("/users/logout", checkAuth, logoutControllers.logout);


// USER

router.use('/users', userRouter);

// ROLES 
router.use('/roles', roleRouter);

//RESET
router.use('/reset', resetRouter);

module.exports = router