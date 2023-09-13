const express = require('express');
const router = express.Router();
const milk = require('../models/addMilkModel');
const bakery = require('../models/addBakeryModel');
const icecreame = require('../models/addIcecreameModel');
const sweet = require('../models/addSweetModel');

router.get('/', async (req, res) => {
    const Milk = await milk.findAll();
    const Bakery = await bakery.findAll();
    const Icecreame = await icecreame.findAll();
    const Sweet = await sweet.findAll();

    await res.render('home', {
        Milk,
        Bakery,
        Icecreame,
        Sweet,
    });
});
router.get('/about', async (req, res) => {
    await res.render('product/addToCart');
});

module.exports = router;
