const mongoose = require('mongoose');
const Order = require('../models/order');

module.exports = {};

module.exports.createOrder = async (orderObj) => {
    try {
        const createOrder = await Order.create(orderObj);
        return createOrder;
    } catch (e) {
        netx(e);
    }
};

module.exports.getAll = async () => {
    try {
        const allOrders =  await Order.find().lean();
        return allOrders;
    } catch (e) {
        next(e);
    }
};

module.exports.getOrderById = async (orderId) => {
    try {
        const orderData = await Order.aggregate([
            { $match: { _id: mongoose.Types.ObjectId(orderId) }},
            { $unwind: '$items' },
            { $lookup: { from: 'items',  localField: 'items',  foreignField: '_id',  as: 'itemData'  } },
            { $unwind: '$itemData' },
            { $project: { userId: '$userId', item: '$itemData', total: '$total' } },       
            { $group: { _id: '$_id', userId: { $first: '$userId'}, items: {$push: '$itemData'}, total: { $first: '$total' } } }
        ]);
        return orderData[0];
    } catch (e) {
        next(e);
    }
};

module.exports.getOrderByUser = async (userId) => {
    try {
        const userOrder = await Order.find({ userId: userId }).lean();
        return userOrder;
    } catch (e) {
        next(e);
    }
};
