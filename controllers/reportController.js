
const Product = require('../models/Product');

// Get Low Stock Products
const getLowStockProducts = async (req, res, next) => {
    try {
        const products = await Product.find({
            $expr: {
                $lte: ["$quantity", "$reorderLevel"]
            }
        });

        res.status(200).json({
            success: true,
            count: products.length,
            products
        });

    } catch (error) {
        error.statusCode = 500;
        next(error);
    }
};

// Category-wise Inventory Summary
const getCategorySummary = async (req, res, next) => {
    try {
        const summary = await Product.aggregate([
            {
                $group: {
                    _id: "$category",
                    totalProducts: { $sum: 1 },
                    totalQuantity: { $sum: "$quantity" },
                    totalValue: {
                        $sum: {
                            $multiply: ["$price", "$quantity"]
                        }
                    }
                }
            }
        ]);

        res.status(200).json({
            success: true,
            summary
        });

    } catch (error) {
        error.statusCode = 500;
        next(error);
    }
};

module.exports = {
    getLowStockProducts,
    getCategorySummary
};
