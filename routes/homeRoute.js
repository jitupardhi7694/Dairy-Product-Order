const express = require('express');
const router = express.Router();
const bakery = require('../models/addBakeryModel');

router.get('/', async (req, res) => {
    const Bakery = await bakery.findAll();

    await res.render('home', {
        Bakery,
    });
});
router.get('/about', async (req, res) => {
    await res.render('product/addToCart');
});

module.exports = router;
