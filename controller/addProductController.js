// Products Registration Form Page

const { Op } = require('sequelize');
const AddProduct = require('../models/addProductModel');
const moment = require('moment');
const logger = require('../helpers/winston');
const milk = require('../models/addMilkModel');
const bakery = require('../models/addBakeryModel');
const icecreame = require('../models/addIcecreameModel');
const sweet = require('../models/addSweetModel');

const getProductPage = async (req, res) => {
    const rows = await AddProduct.findAll();

    const Milk = await milk.findAll();
    const Bakery = await bakery.findAll();
    const Icecreame = await icecreame.findAll();
    const Sweet = await sweet.findAll();

    await res.render('home', {
        Milk,
        Bakery,
        Icecreame,
        Sweet,
        rows,
    });
};

const deleteProductTable = async (req, res) => {
    await deleteProduct(req, res);
};

// save

const saveProduct = async (req, res) => {
    const { name, introduction, price, rating } = req.body;

    try {
        const Milk = await milk.findAll();
        const Bakery = await bakery.findAll();
        const Icecreame = await icecreame.findAll();
        const Sweet = await sweet.findAll();

        if (!req.file) {
            // Handle the case where no file was uploaded
            const errors = [{ msg: 'Please upload a product image' }];
            console.log('error', errors);

            return res.render('home', {
                errors,
                Milk,
                Bakery,
                Icecreame,
                Sweet,
            });
        }

        const { originalname, filename } = req.file;

        // Check for duplicate Product name before inserting
        const existingProduct = await AddProduct.findOne({
            where: { name },
        });

        if (existingProduct) {
            // Already exists, return back to the form
            const errors = [{ msg: 'This Product is already saved' }];
            return res.render('home', {
                errors,
                Milk,
                Bakery,
                Icecreame,
                Sweet,
            });
        }

        // Create a new Product record
        const newProduct = await AddProduct.create({
            name,
            introduction,
            price,
            rating,
            product_image: originalname,
            img_data: filename,
        });
        // console.log('created on db...', newProduct);
        req.flash(
            'success_msg',
            `Product Add Cart ${newProduct.name} is saved.`
        );
        return res.redirect('/#milk');
    } catch (error) {
        console.error(error);
        // Handle the error appropriately, e.g., render an error page or return a 500 response.
        res.status(500).send('Internal Server Error');
    }
};

// Controller

const updateProduct = async (req, res) => {
    const { id } = req.params;
    //  const rows = req.body;
    const { name, introdction, price, rating } = req.body;
    const imageData = await AddProduct.findByPk(id);
    const { originalname, filename } = req.file || {};
    const errors = req.ValidateErrors;
    if (errors.length > 0) {
        // return to form with errors
        return res.render('home', {
            errors,
            rows: req.body,
            // img: imageData.img_data,
        });
    }

    // check for duplicate religion name before inserting/updating
    const Product = await AddProduct.findOne({
        where: { name, id: { [Op.ne]: id } },
    });
    console.log('Product error', Product);
    if (Product) {
        // Already Exists, return back to form
        errors.push({ msg: 'This Product product is already saved' });
        return res.render('home', {
            errors,
            id,
            rows: req.body,
            // img: imageData.img_data,
        });
    }

    try {
        if (id !== '') {
            const updatedProduct = await AddProduct.update(
                {
                    name,
                    introdction,
                    price,
                    rating,
                    product_image: originalname || req.body.product_image,
                    img_data: filename || imageData.img_data,
                },
                { where: { id } }
            );
            //   console.log('updatedProduct', updatedProduct);
            if (updatedProduct) {
                req.flash(
                    'success_msg',
                    'Product product Data Successfully updated.'
                );
            }
            return res.redirect('/Product/add-Product');
        }
    } catch (err) {
        logger.error(err);
    }
    return null;
};

// edit

const editProduct = async (req, res) => {
    const { id } = req.params;
    try {
        const rows = await AddProduct.findByPk(id);
        if (rows === null) {
            //  console.log('inside blank');
            req.flash('error_msg', `No record found for editing`);
            return res.redirect('/Product/add-Product-table');
        }
        const img = rows.img_data;
        res.render('home', {
            rows,
            img,
        });
    } catch (error) {
        return error.message;
    }
    return null;
};

async function deleteProduct(req, res) {
    const { id } = req.params;
    try {
        await AddProduct.destroy({
            where: {
                id,
            },
        });

        req.flash('success_msg', 'Data Deleted successfully.');
        return res.redirect('/product/add-cart');
    } catch (error) {
        return error.message;
    }
}

const ProductTable = async (req, res) => {
    const ProductTable = await AddProduct.findAll(); // search for the Product data
    res.render('homeTable', {
        ProductTable,
        moment,
    });
    return null;
};

module.exports = {
    saveProduct,
    editProduct,
    updateProduct,
    deleteProductTable,
    getProductPage,
    ProductTable,
};
