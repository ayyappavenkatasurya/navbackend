const errorHandler = (err, req, res, next) => {
    console.error('SERVER ERROR:', err.stack);

    res.status(500).json({
        error: 'An unexpected server error occurred.',
    });
};

module.exports = errorHandler;