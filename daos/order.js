const mongoose = require('mongoose');
const Order = require('../models/order');

module.exports = {};

module.exports.create = async (userId, items, total) => {
    try {
        const newOrder = await Order.create({
            userId: userId,
            items: items,
            total: total
        });
        return newOrder;
    } catch (e) {
        throw e;
    }
};

module.exports.getAll = async () => {
    try {
        const orders = await Order.find({}).lean();
        return orders;
    } catch (e) {
        throw e;
    }
};

module.exports.getAllByUserId = async (userId) => {
    const myOrders = await Order.find({
        userId: userId
    });
    return myOrders;
};

module.exports.getUserForId = async (orderId) => {
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
        throw new BadDataError('Invalid order id');
    } else {
        try {
            const order = await Order.findOne({
                _id: orderId
            });
            return order.userId;
        } catch (e) {
            throw e;
        }
    }
};

module.exports.getById = async (orderId) => {
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
        throw new BadDataError('Invalid order id');
    } else {
        try {
            const reqOrderId = mongoose.Types.ObjectId(orderId)
            const order = await Order.aggregate([
                { $match: {
                    _id: reqOrderId
                }},
                { $lookup: {
                    from: "items",
                    localField: "items",
                    foreignField: "_id",
                    as: "items"
                }},
                { $project: {
                    "items.price": 1,
                    "items.title": 1,
                    total: 1,
                    userId: 1,
                    _id: 0
                }}
            ]);
            return order[0];
        } catch (e) {
            throw e;
        }
    }
};

class BadDataError extends Error {};
module.exports.BadDataError = BadDataError;