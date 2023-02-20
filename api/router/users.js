const express = require('express');
const router = express.Router();
const { checkAuth, authorization } = require('../middleware/check-auth');
const userControllers = require('../controllers/users');

router.get('/', checkAuth,authorization,userControllers.getAllUser);
router.get('/detail', checkAuth,authorization,userControllers.getDetailUser);
router.post('/create-dashboard', checkAuth,authorization, userControllers.createUser)
router.post('/create-client', userControllers.createUserClient)
router.put('/updated', checkAuth,authorization,userControllers.updateUser);
router.patch('/delete', checkAuth,authorization, userControllers.deleteUser);
router.get('/verify-email', userControllers.verifyEmail);
router.post('/check-status', userControllers.verifyEmailStatus);
router.patch('/update-password',checkAuth,userControllers.updatePassword);

router.patch('/updated-client', checkAuth,userControllers.updateUserClient);
router.post('/resend-email',userControllers.resendEmail);
// router.patch('/updated-passwordClient', checkAuth,userControllers.updatePasswordClient);
module.exports = router
