const ApiError = require("../utils/ApiError");

const errorHandler = (err, req, res, next) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || "Internal Server Error";

    res.status(statusCode).json({
        success: false,
        message,
        stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
    });
};

module.exports = errorHandler;
