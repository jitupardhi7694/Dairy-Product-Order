const express = require('express');
const router = express.Router();
const SweetController = require('../controller/addSweetController');
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

// Sweet
router.get('/add-sweet', async (req, res) => {
    await SweetController.getSweet(req, res);
});

router.post(
    '/add-sweet',
    upload.single('product_image'),
    productValidationRules(),
    validate,
    async (req, res) => {
        await SweetController.saveSweet(req, res);
    }
);

router.get('/add-sweet-table', async (req, res) => {
    await SweetController.SweetTable(req, res);
});

module.exports = router;
