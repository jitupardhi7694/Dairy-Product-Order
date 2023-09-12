const express = require('express');
const router = express.Router();
const IcecreameController = require('../controller/addIcecreameController');
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

// Icecreame
router.get('/add-icecreame', async (req, res) => {
    await IcecreameController.getIcecreame(req, res);
});

router.post(
    '/add-icecreame',
    upload.single('product_image'),
    productValidationRules(),
    validate,
    async (req, res) => {
        await IcecreameController.saveIcecreame(req, res);
    }
);

router.get('/add-icecreame-table', async (req, res) => {
    await IcecreameController.IcecreameTable(req, res);
});

module.exports = router;
