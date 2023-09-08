const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    await res.render('userPages/dashboard');
});
router.get('/add-icecreame', async (req, res) => {
    await res.render('product/addIcecreame');
});
router.get('/add-bakery', async (req, res) => {
    await res.render('product/addBakery');
});
router.get('/add-milk', async (req, res) => {
    await res.render('product/addMilk');
});
router.get('/add-mithai', async (req, res) => {
    await res.render('product/addSweets');
});

module.exports = router;
