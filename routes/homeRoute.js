const express = require('express');
const router = express.Router();
const {
    productValidationRules,
    validate,
} = require('../helpers/validators/addProductsValidation');
const productController = require('../controller/addProductController');
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

router.get('/', async (req, res) => {
    await productController.getProductPage(req, res);
});

router.post(
    '/',
    upload.single('product_image'),
    productValidationRules(),
    validate,
    async (req, res) => {
        await productController.saveProduct(req, res);
    }
);

router.get('/about', async (req, res) => {
    await res.render('product/addToCart');
});

module.exports = router;
