const { DataTypes } = require('sequelize');
const sqlize = require('../helpers/init-mysql');

const addMilk = sqlize.define(
    'add_milk',
    {
        id: {
            autoIncrement: true,
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING(85),
            allowNull: true,
        },
        introduction: {
            type: DataTypes.STRING(200),
            allowNull: true,
        },
        price: {
            type: DataTypes.STRING(45),
            allowNull: true,
        },
        rating: {
            type: DataTypes.STRING(45),
            allowNull: true,
        },
        product_image: {
            type: DataTypes.STRING(2000),
            allowNull: false,
            comment: 'kept long for path name',
        },
        img_data: {
            type: DataTypes.BLOB('long'),
            allowNull: false,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = addMilk;
