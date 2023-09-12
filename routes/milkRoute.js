const express = require('express');
const router = express.Router();
const milkController = require('../controller/addMilkController');
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

// milk
router.get('/add-milk', async (req, res) => {
    await milkController.getMilk(req, res);
});

router.post(
    '/add-milk',
    upload.single('product_image'),
    productValidationRules(),
    validate,
    async (req, res) => {
        await milkController.saveMilk(req, res);
    }
);

router.get('/add-milk-table', async (req, res) => {
    await milkController.MilkTable(req, res);
});

module.exports = router;
