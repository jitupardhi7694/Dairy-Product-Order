const { DataTypes } = require('sequelize');
const sqlize = require('../helpers/init-mysql');

const addProduct = sqlize.define(
    'add_products',
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
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    }
);

module.exports = addProduct;
