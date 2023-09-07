const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    await res.render('home');
});
router.get('/about', async (req, res) => {
    await res.render('product/addToCart');
});

module.exports = router;
