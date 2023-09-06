const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    await res.render('home');
});
router.get('/dash', async (req, res) => {
    await res.render('userPages/dashboard');
});

module.exports = router;
