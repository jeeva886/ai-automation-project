const express = require('express');
const router = express.Router();
const multer = require('multer');
const xlsx = require('xlsx');
const Product = require('../models/Product');
const fs = require('fs');

// Create uploads directory if it doesn't exist
if (!fs.existsSync('./uploads')) {
    fs.mkdirSync('./uploads');
}

// Multer Config
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

// @route   POST api/products/upload
// @desc    Upload Excel file for storing or updating products
router.post('/upload', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ msg: 'Please upload an Excel file.' });
        }

        const workbook = xlsx.readFile(req.file.path);
        const sheet_name_list = workbook.SheetNames;
        const excelData = xlsx.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);

        const productPromises = excelData.map(async (row) => {
            // Find if product exists based on ID
            let product = await Product.findOne({ productId: row['Product ID'] });

            const productData = {
                productId: row['Product ID'],
                name: row['Product Name'],
                price: row['Price'],
                quantity: row['Quantity'],
                salesCurrentWeek: row['Sales Current Week'] || 0,
                salesPreviousWeek: row['Sales Previous Week'] || 0
            };

            if (product) {
                // Update product
                return Product.updateOne({ productId: row['Product ID'] }, productData);
            } else {
                // Create new product
                return Product.create(productData);
            }
        });

        await Promise.all(productPromises);

        // Remove uploaded file
        fs.unlinkSync(req.file.path);

        res.json({ msg: 'Products uploaded successfully', data: excelData });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/products
// @desc    Get all products
router.get('/', async (req, res) => {
    try {
        const query = req.query.search ? { name: { $regex: req.query.search, $options: 'i' } } : {};
        const products = await Product.find(query);
        res.json(products);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/products/dashboard
// @desc    Get data for owner dashboard
router.get('/dashboard', async (req, res) => {
    try {
        const count = await Product.countDocuments();
        const topSelling = await Product.find().sort({ salesCurrentWeek: -1 }).limit(5);
        const lowDemand = await Product.find().sort({ salesCurrentWeek: 1 }).limit(5);
        // Products with low stock quantity (< 10)
        const lowStockAlerts = await Product.find({ quantity: { $lt: 10 } });

        const products = await Product.find();
        let totalCurrentSales = 0;
        let totalCurrentRevenue = 0;
        let totalPreviousSales = 0;

        products.forEach(p => {
            totalCurrentSales += p.salesCurrentWeek;
            totalPreviousSales += p.salesPreviousWeek;
            totalCurrentRevenue += (p.salesCurrentWeek * p.price);
        });

        res.json({
            totalProducts: count,
            topSelling,
            lowDemand,
            lowStockAlerts,
            salesAnalysis: {
                currentWeekSales: totalCurrentSales,
                currentWeekRevenue: totalCurrentRevenue,
                previousWeekSales: totalPreviousSales,
                demandTrend: totalCurrentSales >= totalPreviousSales ? 'Up' : 'Down'
            }
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


module.exports = router;
