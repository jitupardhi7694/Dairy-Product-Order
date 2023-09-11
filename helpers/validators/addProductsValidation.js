const { body, validationResult } = require('express-validator');

const productValidationRules = () => [
    body('name')
        .notEmpty()
        .isLength({ min: 2, max: 75 })
        .withMessage('Name is required'),
    body('introduction')
        .notEmpty()
        .isLength({ min: 2, max: 500 })
        .withMessage('Introduction is required'),
    body('rating').notEmpty().isNumeric().withMessage('Rating is required'),
    body('price').notEmpty().isNumeric().withMessage('Price is required'),
];

const validate = (req, res, next) => {
    const errors = validationResult(req);
    const extractedErrors = [];
    errors.array().map((error) => extractedErrors.push({ msg: error.msg }));
    req.ValidateErrors = extractedErrors;
    return next();
};

module.exports = {
    productValidationRules,
    validate,
};
