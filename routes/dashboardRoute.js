const express = require('express');
const router = express.Router();
const BakeryController = require('../controller/addBakeryController');
const {
    productValidationRules,
    validate,
} = require('../helpers/validators/addProductsValidation');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: './public/uploads/', // Specify the destination folder for uploaded files
    filename: (req, file, callback) => {
        callback(
            null,
            file.fieldname + '-' + Date.now() + path.extname(file.originalname)
        );
    },
});

const upload = multer({ storage: storage });

// bakery
router.get('/add-bakery', async (req, res) => {
    await BakeryController.getBakery(req, res);
});

router.post(
    '/add-bakery',
    upload.single('product_image'),
    productValidationRules(),
    validate,
    async (req, res) => {
        await BakeryController.saveBakery(req, res);
    }
);

router.get('/add-bakery-table', async (req, res) => {
    await BakeryController.BakeryTable(req, res);
});

// other routes

router.get('/', async (req, res) => {
    await res.render('userPages/dashboard');
});
router.get('/add-icecreame', async (req, res) => {
    await res.render('product/addIcecreame');
});

router.get('/add-milk', async (req, res) => {
    await res.render('product/addMilk');
});
router.get('/add-mithai', async (req, res) => {
    await res.render('product/addSweets');
});

module.exports = router;
