const { Op } = require('sequelize');
const BakeryModel = require('../models/addBakeryModel');
const moment = require('moment');
const logger = require('../helpers/winston');

// Bakerys Registration Form Page

const getBakery = async (req, res) => {
    const rows = await BakeryModel.findAll();
    await res.render('product/addBakery', {
        rows,
        img: null,
    });
};

const deleteBakeryTable = async (req, res) => {
    await deleteBakery(req, res);
};

// save

const saveBakery = async (req, res) => {
    const { name, introduction, price, rating } = req.body;

    try {
        if (!req.file) {
            // Handle the case where no file was uploaded
            const errors = [{ msg: 'Please upload a product image' }];
            console.log('error', errors);

            return res.render('product/addBakery', {
                errors,
            });
        }

        const { originalname, filename } = req.file;

        // Check for duplicate bakery name before inserting
        const existingBakery = await BakeryModel.findOne({
            where: { name },
        });

        if (existingBakery) {
            // Already exists, return back to the form
            const errors = [{ msg: 'This Bakery is already saved' }];
            return res.render('product/addBakery', {
                errors,
            });
        }

        // Create a new Bakery record
        const newBakery = await BakeryModel.create({
            name,
            introduction,
            price,
            rating,
            product_image: originalname,
            img_data: filename,
        });
        // console.log('created on db...', newBakery);
        req.flash('success_msg', `Bakery product ${newBakery.name} is saved.`);
        return res.redirect('/dashboard/add-bakery');
    } catch (error) {
        console.error(error);
        // Handle the error appropriately, e.g., render an error page or return a 500 response.
        res.status(500).send('Internal Server Error');
    }
};

// Controller

const updateBakery = async (req, res) => {
    const { id } = req.params;
    //  const rows = req.body;
    const { name, introdction, price, rating } = req.body;
    const imageData = await BakeryModel.findByPk(id);
    const { originalname, filename } = req.file || {};
    const errors = req.ValidateErrors;
    if (errors.length > 0) {
        // return to form with errors
        return res.render('product/addBakery', {
            errors,
            rows: req.body,
            img: imageData.img_data,
        });
    }

    // check for duplicate religion name before inserting/updating
    const bakery = await BakeryModel.findOne({
        where: { name, id: { [Op.ne]: id } },
    });
    console.log('bakery error', bakery);
    if (bakery) {
        // Already Exists, return back to form
        errors.push({ msg: 'This Bakery product is already saved' });
        return res.render('product/addBakery', {
            errors,
            id,
            rows: req.body,
            img: imageData.img_data,
        });
    }

    try {
        if (id !== '') {
            const updatedBakery = await BakeryModel.update(
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
            //   console.log('updatedBakery', updatedBakery);
            if (updatedBakery) {
                req.flash(
                    'success_msg',
                    'Bakery product Data Successfully updated.'
                );
            }
            return res.redirect('/bakery/add-bakery');
        }
    } catch (err) {
        logger.error(err);
    }
    return null;
};

// edit

const editBakery = async (req, res) => {
    const { id } = req.params;
    try {
        const rows = await BakeryModel.findByPk(id);
        if (rows === null) {
            //  console.log('inside blank');
            req.flash('error_msg', `No record found for editing`);
            return res.redirect('/bakery/add-bakery-table');
        }
        const img = rows.img_data;
        res.render('product/addBakery', {
            rows,
            img,
        });
    } catch (error) {
        return error.message;
    }
    return null;
};

async function deleteBakery(req, res) {
    const { id } = req.params;
    try {
        await BakeryModel.destroy({
            where: {
                id,
            },
        });

        req.flash('success_msg', 'Data Deleted successfully.');
        return res.redirect('/bakery/add-bakery-table');
    } catch (error) {
        return error.message;
    }
}

const BakeryTable = async (req, res) => {
    const BakeryTable = await BakeryModel.findAll(); // search for the Bakery data
    res.render('product/addBakeryTable', {
        BakeryTable,
        moment,
    });
    return null;
};

module.exports = {
    saveBakery,
    editBakery,
    updateBakery,
    deleteBakeryTable,
    getBakery,
    BakeryTable,
};
