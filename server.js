
const express = require('express');
const dotenv = require('dotenv');

const connectDB = require('./config/db');

const productRoutes = require('./routes/productRoutes');
const reportRoutes = require('./routes/reportRoutes');
const errorMiddleware = require('./middleware/errorMiddleware');

dotenv.config();

const app = express();

app.use(express.json());

// Connect MongoDB
connectDB();

// Home Route
app.get('/', (req, res) => {
    res.send('Inventory Management System API is running');
});

// Product Routes
app.use('/api/products', productRoutes);

// Report Routes
app.use('/api/reports', reportRoutes);

// Error Handling Middleware
app.use(errorMiddleware);

// Server Port
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
