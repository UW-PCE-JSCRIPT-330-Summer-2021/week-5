const itemDAO = require('./item');
const Order = require("../models/order");

module.exports = {};

module.exports.createOrder = async (userId, items) => {
    try {
        let sum = 0;
        for (let i = 0; i < items.length; i++) {
            const price = (await itemDAO.getItem(items[i])).price;
            sum += price;
        }
        const orderObj = { userId, items, total: sum }
        const createdOrder = await Order.create(orderObj);
        return createdOrder
    } catch {
        throw new Error("create order failed");
    }
}

module.exports.getOrderById = async (user, order_id) => {
    try {
        const userOrder = await Order.findOne({ _id: order_id }).lean();
        let userItems = [];
        for (let i = 0; i < userOrder.items.length; i++) {
            const userItem = (await itemDAO.getItem(userOrder.items[i]));
            const item = {
                title: userItem.title,
                price: userItem.price
            };
            userItems.push(item);
        }
        userOrder.items = userItems;
        if (user.roles.includes("admin")) {
            return userOrder;
        } else if (user._id.toString() === userOrder.userId.toString()) {
            return userOrder;
        } else {
            throw new Error("unauthorized")
        }
    } catch {
        throw new Error("get order failed");
    }
}

module.exports.getUserOrders = async (user) => {
    try {
        if (user.roles.includes("admin")) {
            return await Order.find().lean();
        } else {
            return await Order.find({ userId: user._id }).lean();
        }
    } catch {
        throw new Error("get orders failed");
    }
}

module.exports.getAll = async (_id) => {
    try {
        return await Order.find().lean();
    } catch {
        throw new Error("get orders failed");
    }
}
