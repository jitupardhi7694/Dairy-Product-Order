const { Op } = require('sequelize');
const MilkModel = require('../models/addMilkModel');
const moment = require('moment');
const logger = require('../helpers/winston');

// Milks Registration Form Page

const getMilk = async (req, res) => {
    const rows = await MilkModel.findAll();
    await res.render('product/addMilk', {
        rows,
        img: null,
    });
};

const deleteMilkTable = async (req, res) => {
    await deleteMilk(req, res);
};

const saveMilk = async (req, res) => {
    const { name, introduction, price, rating } = req.body;

    try {
        if (!req.file) {
            // Handle the case where no file was uploaded
            const errors = [{ msg: 'Please upload a product image' }];
            console.log('error', errors);

            return res.render('product/addMilk', {
                errors,
            });
        }

        const { originalname, filename } = req.file;

        // Check for duplicate Milk name before inserting
        const existingMilk = await MilkModel.findOne({
            where: { name },
        });

        if (existingMilk) {
            // Already exists, return back to the form
            const errors = [{ msg: 'This Milk is already saved' }];
            return res.render('product/addMilk', {
                errors,
            });
        }

        // Create a new Milk record
        const newMilk = await MilkModel.create({
            name,
            introduction,
            price,
            rating,
            product_image: originalname,
            img_data: filename,
        });

        req.flash('success_msg', `Milk ${newMilk.name} is saved.`);
        return res.redirect('/milk/add-milk');
    } catch (error) {
        console.error(error);
        // Handle the error appropriately, e.g., render an error page or return a 500 response.
        res.status(500).send('Internal Server Error');
    }
};

// Controller

const updateMilk = async (req, res) => {
    const { id } = req.params;
    //  const rows = req.body;
    const { name, introdction, price, rating } = req.body;
    const imageData = await MilkModel.findByPk(id);
    const { originalname, filename } = req.file || {};
    const errors = req.ValidateErrors;
    if (errors.length > 0) {
        // return to form with errors
        return res.render('product/addMilk', {
            errors,
            rows: req.body,
            img: imageData.img_data,
        });
    }

    // check for duplicate religion name before inserting/updating
    const Milk = await MilkModel.findOne({
        where: { name, id: { [Op.ne]: id } },
    });
    console.log('Milk error', Milk);
    if (Milk) {
        // Already Exists, return back to form
        errors.push({ msg: 'This Milk is already saved' });
        return res.render('product/addMilk', {
            errors,
            id,
            rows: req.body,
            img: imageData.img_data,
        });
    }

    try {
        if (id !== '') {
            const updatedMilk = await MilkModel.update(
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
            //   console.log('updatedMilk', updatedMilk);
            if (updatedMilk) {
                req.flash('success_msg', 'Data Successfully updated.');
            }
            return res.redirect('/milk/add-milk');
        }
    } catch (err) {
        logger.error(err);
    }
    return null;
};

// edit

const editMilk = async (req, res) => {
    const { id } = req.params;
    try {
        const rows = await MilkModel.findByPk(id);
        if (rows === null) {
            //  console.log('inside blank');
            req.flash('error_msg', `No record found for editing`);
            return res.redirect('/milk/add-milk-table');
        }
        const img = rows.img_data;
        res.render('product/addMilk', {
            rows,
            img,
        });
    } catch (error) {
        return error.message;
    }
    return null;
};

async function deleteMilk(req, res) {
    const { id } = req.params;
    try {
        await MilkModel.destroy({
            where: {
                id,
            },
        });

        req.flash('success_msg', 'Data Deleted successfully.');
        return res.redirect('/milk/add-milk-table');
    } catch (error) {
        return error.message;
    }
}

const MilkTable = async (req, res) => {
    const MilkTable = await MilkModel.findAll(); // search for the Milk data
    res.render('product/addMilkTable', {
        MilkTable,
        moment,
    });
    return null;
};

module.exports = {
    saveMilk,
    editMilk,
    updateMilk,
    deleteMilkTable,
    getMilk,
    MilkTable,
};
