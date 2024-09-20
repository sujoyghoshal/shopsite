const moment = require('moment');
const Order = require('../models/orderSchema');

// Create a new order
const newOrder = async (req, res) => {
    try {
        const {
            buyer,
            shippingData,
            orderedProducts,
            paymentInfo,
            productsQuantity,
            totalPrice,
        } = req.body;

        const order = await Order.create({
            buyer,
            shippingData,
            orderedProducts,
            paymentInfo,
            paidAt: Date.now(),
            productsQuantity,
            totalPrice,
        });

        await updateWeeklySales();

        return res.send(order);
    } catch (err) {
        res.status(500).json(err);
    }
};

// Get ordered products by customer
const getOrderedProductsByCustomer = async (req, res) => {
    try {
        let orders = await Order.find({ buyer: req.params.id });

        if (orders.length > 0) {
            const orderedProducts = orders.reduce((accumulator, order) => {
                accumulator.push(...order.orderedProducts);
                return accumulator;
            }, []);
            res.send(orderedProducts);
        } else {
            res.send({ message: "No products found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

// Get ordered products by seller
const getOrderedProductsBySeller = async (req, res) => {
    try {
        const sellerId = req.params.id;

        const ordersWithSellerId = await Order.find({
            'orderedProducts.seller': sellerId
        });

        if (ordersWithSellerId.length > 0) {
            const orderedProducts = ordersWithSellerId.reduce((accumulator, order) => {
                order.orderedProducts.forEach(product => {
                    const existingProductIndex = accumulator.findIndex(p => p._id.toString() === product._id.toString());
                    if (existingProductIndex !== -1) {
                        accumulator[existingProductIndex].quantity += product.quantity;
                    } else {
                        accumulator.push(product);
                    }
                });
                return accumulator;
            }, []);
            res.send(orderedProducts);
        } else {
            res.send({ message: "No products found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

// Get total order count
const getTotalOrderCount = async (req, res) => {
    try {
        const orderCount = await Order.countDocuments();
        res.json({ totalOrders: orderCount });
    } catch (err) {
        res.status(500).json(err);
    }
};

// Get weekly sales
const getWeeklySales = async (req, res) => {
    try {
        await updateWeeklySales();
        
        const weeklySales = await Order.aggregate([
            {
                $group: {
                    _id: null,
                    totalSales: { $sum: "$weeklySalesCount" }
                }
            }
        ]);

        res.json({
            weeklySalesCount: weeklySales[0] ? weeklySales[0].totalSales : 0
        });
    } catch (err) {
        res.status(500).json(err);
    }
};

// Update weekly sales
const updateWeeklySales = async () => {
    try {
        const orders = await Order.find();
        const now = new Date();
        const lastMonday = new Date();
        lastMonday.setDate(lastMonday.getDate() - (lastMonday.getDay() || 7));
        
        for (const order of orders) {
            if (order.salesResetDate < lastMonday) {
                order.weeklySalesCount = 0;
                order.salesResetDate = lastMonday;
            }
            await order.save();
        }
    } catch (err) {
        console.error("Error updating weekly sales:", err);
    }
};

module.exports = {
    newOrder,
    getOrderedProductsByCustomer,
    getOrderedProductsBySeller,
    getTotalOrderCount,
    getWeeklySales
};
