
const errorMiddleware = (err, req, res, next) => {
    console.log(err);

    let statusCode = err.statusCode || 500;
    let message = err.message || "Server Error";

    // Duplicate SKU error
    if (err.code === 11000) {
        statusCode = 409;
        message = "SKU already exists";
    }

    // Mongoose validation error
    if (err.name === "ValidationError") {
        statusCode = 400;
        message = err.message;
    }

    // Invalid MongoDB ID
    if (err.name === "CastError") {
        statusCode = 400;
        message = "Invalid product ID";
    }

    res.status(statusCode).json({
        success: false,
        message
    });
};

module.exports = errorMiddleware;
