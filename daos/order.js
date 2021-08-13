const Order = require('../models/order');

module.exports = {};

module.exports.createOrder = async (orderObj) => {
    try {
        return await Order.create(orderObj);
    } catch (e) {
        throw e
    }
};

module.exports.getOrder = async () => {
    try {
        return await Order.find().lean();
    } catch (e) {
        throw e
    }
};

module.exports.getOrderById = async (orderId) => {
    try {
        return await Order.findOne({ orderId }).lean();
    } catch (e) {
        throw e
    }
};

module.exports.getOrderByUser = async (userId) => {
    try {
        return await Order.find({ userId: userId }).lean();
    } catch (e) {
        throw e
    }
};

module.exports = router;