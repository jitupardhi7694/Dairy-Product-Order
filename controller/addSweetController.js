const { Op } = require('sequelize');
const SweetModel = require('../models/addSweetModel');
const moment = require('moment');
const logger = require('../helpers/winston');

// Sweets Registration Form Page

const getSweet = async (req, res) => {
    const rows = await SweetModel.findAll();
    await res.render('product/addSweets', {
        rows,
        img: null,
    });
};

const deleteSweetTable = async (req, res) => {
    await deleteSweet(req, res);
};

const saveSweet = async (req, res) => {
    const { name, introduction, price, rating } = req.body;

    try {
        if (!req.file) {
            // Handle the case where no file was uploaded
            const errors = [{ msg: 'Please upload a product image' }];
            console.log('error', errors);

            return res.render('product/addSweets', {
                errors,
            });
        }

        const { originalname, filename } = req.file;

        // Check for duplicate Sweet name before inserting
        const existingSweet = await SweetModel.findOne({
            where: { name },
        });

        if (existingSweet) {
            // Already exists, return back to the form
            const errors = [{ msg: 'This Sweet is already saved' }];
            return res.render('product/addSweets', {
                errors,
            });
        }

        // Create a new Sweet record
        const newSweet = await SweetModel.create({
            name,
            introduction,
            price,
            rating,
            product_image: originalname,
            img_data: filename,
        });

        req.flash('success_msg', `Sweet ${newSweet.name} is saved.`);
        return res.redirect('/sweet/add-sweet');
    } catch (error) {
        console.error(error);
        // Handle the error appropriately, e.g., render an error page or return a 500 response.
        res.status(500).send('Internal Server Error');
    }
};

// Controller

const updateSweet = async (req, res) => {
    const { id } = req.params;
    //  const rows = req.body;
    const { name, introdction, price, rating } = req.body;
    const imageData = await SweetModel.findByPk(id);
    const { originalname, filename } = req.file || {};
    const errors = req.ValidateErrors;
    if (errors.length > 0) {
        // return to form with errors
        return res.render('product/addSweets', {
            errors,
            rows: req.body,
            img: imageData.img_data,
        });
    }

    // check for duplicate religion name before inserting/updating
    const Sweet = await SweetModel.findOne({
        where: { name, id: { [Op.ne]: id } },
    });
    console.log('Sweet error', Sweet);
    if (Sweet) {
        // Already Exists, return back to form
        errors.push({ msg: 'This Sweet is already saved' });
        return res.render('product/addSweets', {
            errors,
            id,
            rows: req.body,
            img: imageData.img_data,
        });
    }

    try {
        if (id !== '') {
            const updatedSweet = await SweetModel.update(
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
            //   console.log('updatedSweet', updatedSweet);
            if (updatedSweet) {
                req.flash('success_msg', 'Data Successfully updated.');
            }
            return res.redirect('/sweet/add-sweet');
        }
    } catch (err) {
        logger.error(err);
    }
    return null;
};

// edit

const editSweet = async (req, res) => {
    const { id } = req.params;
    try {
        const rows = await SweetModel.findByPk(id);
        if (rows === null) {
            //  console.log('inside blank');
            req.flash('error_msg', `No record found for editing`);
            return res.redirect('/sweet/add-sweet-table');
        }
        const img = rows.img_data;
        res.render('product/addSweets', {
            rows,
            img,
        });
    } catch (error) {
        return error.message;
    }
    return null;
};

async function deleteSweet(req, res) {
    const { id } = req.params;
    try {
        await SweetModel.destroy({
            where: {
                id,
            },
        });

        req.flash('success_msg', 'Data Deleted successfully.');
        return res.redirect('/sweet/add-sweet-table');
    } catch (error) {
        return error.message;
    }
}

const SweetTable = async (req, res) => {
    const SweetTable = await SweetModel.findAll(); // search for the Sweet data
    res.render('product/addSweetsTable', {
        SweetTable,
        moment,
    });
    return null;
};

module.exports = {
    saveSweet,
    editSweet,
    updateSweet,
    deleteSweetTable,
    getSweet,
    SweetTable,
};
