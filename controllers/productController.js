
const Product = require('../models/Product');

// Create Product
const createProduct = async (req, res, next) => {
    try {
        const product = await Product.create(req.body);

        res.status(201).json({
            success: true,
            product
        });
    } catch (error) {
        next(error);
    }
};

// Get All Products with Filtering, Sorting and Pagination
const getAllProducts = async (req, res, next) => {
    try {
        const { category, sort, page = 1, limit = 5 } = req.query;

        let query = {};

        // Filtering
        if (category) {
            query.category = category;
        }

        // Sorting
        let sortOption = {};

        if (sort === 'asc') {
            sortOption.price = 1;
        } else if (sort === 'desc') {
            sortOption.price = -1;
        }

        // Pagination
        const skip = (Number(page) - 1) * Number(limit);

        const products = await Product.find(query)
            .sort(sortOption)
            .skip(skip)
            .limit(Number(limit));

        const totalProducts = await Product.countDocuments(query);

        res.status(200).json({
            success: true,
            totalProducts,
            currentPage: Number(page),
            totalPages: Math.ceil(totalProducts / Number(limit)),
            products
        });
    } catch (error) {
        next(error);
    }
};

// Get Product By ID
const getProductById = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        res.status(200).json({
            success: true,
            product
        });
    } catch (error) {
        next(error);
    }
};

// Update Product
const updateProduct = async (req, res, next) => {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        res.status(200).json({
            success: true,
            product
        });
    } catch (error) {
        next(error);
    }
};

// Delete Product
const deleteProduct = async (req, res, next) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Product deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

// Adjust Stock (Set Exact Quantity)
const adjustStock = async (req, res, next) => {
    try {
        const quantity = Number(req.body.quantity);

        if (!Number.isInteger(quantity) || quantity < 0) {
            return res.status(400).json({
                success: false,
                message: 'Quantity must be a non-negative whole number'
            });
        }

        const product = await Product.findByIdAndUpdate(
            req.params.id,
            { quantity },
            { new: true, runValidators: true }
        );

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        res.status(200).json({
            success: true,
            product
        });
    } catch (error) {
        next(error);
    }
};

// Restock Product
const restockProduct = async (req, res, next) => {
    try {
        const quantity = Number(req.body.quantity);

        if (!Number.isInteger(quantity) || quantity <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Restock quantity must be a positive whole number'
            });
        }

        const product = await Product.findByIdAndUpdate(
            req.params.id,
            { $inc: { quantity: quantity } },
            { new: true }
        );

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Product restocked successfully',
            product
        });
    } catch (error) {
        next(error);
    }
};

// Sell Product
const sellProduct = async (req, res, next) => {
    try {
        const quantity = Number(req.body.quantity);

        if (!Number.isInteger(quantity) || quantity <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Sale quantity must be a positive whole number'
            });
        }

        const product = await Product.findOneAndUpdate(
            {
                _id: req.params.id,
                quantity: { $gte: quantity }
            },
            {
                $inc: { quantity: -quantity }
            },
            {
                new: true
            }
        );

        if (!product) {
            const existingProduct = await Product.findById(req.params.id);

            if (!existingProduct) {
                return res.status(404).json({
                    success: false,
                    message: 'Product not found'
                });
            }

            return res.status(400).json({
                success: false,
                message: 'Insufficient stock available'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Product sold successfully',
            product
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    adjustStock,
    restockProduct,
    sellProduct
};
