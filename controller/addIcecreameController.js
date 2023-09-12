const { Op } = require('sequelize');
const IcecreameModel = require('../models/addIcecreameModel');

const moment = require('moment');
const logger = require('../helpers/winston');

// Icecreames Registration Form Page

const getIcecreame = async (req, res) => {
    const rows = await IcecreameModel.findAll();
    await res.render('product/addIcecreame', {
        rows,
        img: null,
    });
};

const deleteIcecreameTable = async (req, res) => {
    await deleteIcecreame(req, res);
};

const saveIcecreame = async (req, res) => {
    const { name, introduction, price, rating } = req.body;

    try {
        if (!req.file) {
            // Handle the case where no file was uploaded
            const errors = [{ msg: 'Please upload a product image' }];
            console.log('error', errors);

            return res.render('product/addIcecreame', {
                errors,
            });
        }

        const { originalname, filename } = req.file;

        // Check for duplicate Icecreame name before inserting
        const existingIcecreame = await IcecreameModel.findOne({
            where: { name },
        });

        if (existingIcecreame) {
            // Already exists, return back to the form
            const errors = [{ msg: 'This Icecreame is already saved' }];
            return res.render('product/addIcecreame', {
                errors,
            });
        }

        // Create a new Icecreame record
        const newIcecreame = await IcecreameModel.create({
            name,
            introduction,
            price,
            rating,
            product_image: originalname,
            img_data: filename,
        });

        req.flash('success_msg', `Icecreame ${newIcecreame.name} is saved.`);
        return res.redirect('/icecreame/add-icecreame');
    } catch (error) {
        console.error(error);
        // Handle the error appropriately, e.g., render an error page or return a 500 response.
        res.status(500).send('Internal Server Error');
    }
};

// Controller

const updateIcecreame = async (req, res) => {
    const { id } = req.params;
    //  const rows = req.body;
    const { name, introdction, price, rating } = req.body;
    const imageData = await IcecreameModel.findByPk(id);
    const { originalname, filename } = req.file || {};
    const errors = req.ValidateErrors;
    if (errors.length > 0) {
        // return to form with errors
        return res.render('product/addIcecreame', {
            errors,
            rows: req.body,
            img: imageData.img_data,
        });
    }

    // check for duplicate religion name before inserting/updating
    const Icecreame = await IcecreameModel.findOne({
        where: { name, id: { [Op.ne]: id } },
    });
    console.log('Icecreame error', Icecreame);
    if (Icecreame) {
        // Already Exists, return back to form
        errors.push({ msg: 'This Icecreame is already saved' });
        return res.render('product/addIcecreame', {
            errors,
            id,
            rows: req.body,
            img: imageData.img_data,
        });
    }

    try {
        if (id !== '') {
            const updatedIcecreame = await IcecreameModel.update(
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
            //   console.log('updatedIcecreame', updatedIcecreame);
            if (updatedIcecreame) {
                req.flash('success_msg', 'Data Successfully updated.');
            }
            return res.redirect('/icecreame/add-icecreame');
        }
    } catch (err) {
        logger.error(err);
    }
    return null;
};

// edit

const editIcecreame = async (req, res) => {
    const { id } = req.params;
    try {
        const rows = await IcecreameModel.findByPk(id);
        if (rows === null) {
            //  console.log('inside blank');
            req.flash('error_msg', `No record found for editing`);
            return res.redirect('/icecreame/add-icecreame-table');
        }
        const img = rows.img_data;
        res.render('product/addIcecreame', {
            rows,
            img,
        });
    } catch (error) {
        return error.message;
    }
    return null;
};

async function deleteIcecreame(req, res) {
    const { id } = req.params;
    try {
        await IcecreameModel.destroy({
            where: {
                id,
            },
        });

        req.flash('success_msg', 'Data Deleted successfully.');
        return res.redirect('/icecreame/add-icecreame-table');
    } catch (error) {
        return error.message;
    }
}

const IcecreameTable = async (req, res) => {
    const IcecreameTable = await IcecreameModel.findAll(); // search for the Icecreame data
    res.render('product/addIcecreameTable', {
        IcecreameTable,
        moment,
    });
    return null;
};

module.exports = {
    saveIcecreame,
    editIcecreame,
    updateIcecreame,
    deleteIcecreameTable,
    getIcecreame,
    IcecreameTable,
};
