
const validateProduct = (req, res, next) => {
    const { name, sku, category, price, quantity, reorderLevel, supplier } = req.body;

    if (req.method === 'POST') {
        if (!name || !sku || !category || price == null || quantity == null || reorderLevel == null || !supplier) {
            return res.status(400).json({
                success: false,
                message: "All product fields are required"
            });
        }
    }

    if (price !== undefined && price < 0 ||
        quantity !== undefined && quantity < 0 ||
        reorderLevel !== undefined && reorderLevel < 0) {
        return res.status(400).json({
            success: false,
            message: "Price, quantity and reorder level cannot be negative"
        });
    }

    next();
};

module.exports = validateProduct;
