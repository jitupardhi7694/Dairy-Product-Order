const express = require('express');
const router = express.Router();

router.get('/login', async (req, res) => {
    await res.render('userPages/login');
});
router.get('/register', async (req, res) => {
    await res.render('userPages/register');
});
router.get('/dashboard', async (req, res) => {
    await res.render('userPages/dashboard');
});
router.get('/user-role', async (req, res) => {
    await res.render('userPages/userRole');
});
router.get('/sendResetEmail', async (req, res) => {
    await res.render('userPages/emailVerification');
});
router.get('/forget-password', async (req, res) => {
    await res.render('userPages/forgetPassword');
});
router.get('/sendResetPassword', async (req, res) => {
    await res.render('userPages/resetPasswordEmail');
});

module.exports = router;
