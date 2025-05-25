const { validationResult } = require("express-validator");
const { responseError } = require("../utils/apiResponse");

module.exports = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const formatted = {};
        errors.array().forEach((error) => {
            formatted[error.param] = error.msg;
        });

        return responseError(res, "Validation error", 422, formatted);
    }

    next();
};
