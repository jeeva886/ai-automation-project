const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const nodemailer = require('nodemailer');

const generateOrderId = () => {
    return 'ORD-' + Date.now().toString() + Math.floor(Math.random() * 1000).toString();
};

const sendConfirmationEmail = async (orderInfo) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS || 'dummy_password_for_now' // We will put app password in .env
            }
        });

        let itemsHtml = orderInfo.items.map(i => `
            <tr>
              <td>${i.name}</td>
              <td>${i.quantity}</td>
              <td>₹{i.price}</td>
              <td>₹{i.price * i.quantity}</td>
            </tr>
        `).join('');

        const mailOptions = {
            from: `"Smart Shop" <${process.env.EMAIL_USER}>`,
            to: orderInfo.customerInfo.email,
            subject: `Order Confirmation - ${orderInfo.orderId}`,
            html: `
                <h2>Thank you for your order, ${orderInfo.customerInfo.name}!</h2>
                <p>Your order ID is: <strong>${orderInfo.orderId}</strong></p>
                <p>Your order status is: <strong>Confirmed</strong></p>
                <h3>Invoice Summary</h3>
                <table border="1" cellpadding="5" cellspacing="0">
                    <thead>
                        <tr>
                            <th>Item Name</th>
                            <th>Quantity</th>
                            <th>Price</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${itemsHtml}
                    </tbody>
                </table>
                <h3>Total Amount: ₹{orderInfo.totalAmount}</h3>
                <p>Shipping to: ${orderInfo.customerInfo.address}</p>
            `,
        };

        let info = await transporter.sendMail(mailOptions);
        console.log("Message sent: %s", info.messageId);
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    } catch (error) {
        console.error("Error sending email", error);
    }
};

// @route   POST api/orders
// @desc    Place a new order
router.post('/', async (req, res) => {
    try {
        const { customerInfo, items } = req.body;

        let totalAmount = 0;
        const processedItems = [];

        // Verify products and build order items list
        for (let item of items) {
            const product = await Product.findById(item.product);
            if (!product) {
                return res.status(404).json({ msg: `Product not found: ${item.product}` });
            }
            if (product.quantity < item.quantity) {
                return res.status(400).json({ msg: `Insufficient stock for product: ${product.name}` });
            }

            const itemTotal = product.price * item.quantity;
            totalAmount += itemTotal;

            processedItems.push({
                product: product._id,
                name: product.name,
                price: product.price,
                quantity: item.quantity
            });

            // Reduce stock
            product.quantity -= item.quantity;
            // Record sales (assuming they fall into the current week)
            product.salesCurrentWeek += item.quantity;
            await product.save();
        }

        const newOrder = new Order({
            orderId: generateOrderId(),
            customerInfo,
            items: processedItems.map(p => ({ product: p.product, quantity: p.quantity, price: p.price })),
            totalAmount
        });

        const savedOrder = await newOrder.save();

        // Send Email confirmation
        await sendConfirmationEmail({
            ...newOrder._doc,
            items: processedItems
        });

        res.json({ msg: 'Order placed successfully', orderId: savedOrder.orderId });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


// @route   GET api/orders
// @desc    Get all orders
router.get('/', async (req, res) => {
    try {
        const orders = await Order.find().populate('items.product').sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


module.exports = router;
