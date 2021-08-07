const mongoose = require('mongoose');
const Order = require('../models/order');

const itemDAO = require('./item');
const userDAO = require('./user');

module.exports.createOrder = async (order) => {
    try {

        const sum = await order.items.reduce(async (pSum, item) => {
            const sum = await pSum;
            let price;
            
            try {
                price = (await itemDAO.getItemById(item)).price;
            } catch {
                throw new Error('Bad Item');
            }

            return sum + price ;
        }, 0);

        order.total = sum;

        const createdOrder = await Order.create(order);
        return createdOrder;

    } catch (e) {
        throw new Error(e.message);
    }
}

module.exports.getOrderById = async (order_id) => {
    try {

        if(!mongoose.Types.ObjectId(order_id)) {
            throw new Error('Order Id is invalid');
        } else {

            const foundOrder = await Order.aggregate([
                { $match: { _id: mongoose.Types.ObjectId(order_id) }},
                { $unwind: "$items" },
                { $lookup: {
                    from: "items",
                    localField: "items",
                    foreignField: "_id",
                    as: "orderItems"
                }},
                { $unwind: "$orderItems" },
                { $group: {
                    _id: "$_id",
                    userId: { $first: "$userId" },
                    items: { $push: "$orderItems" },
                    total: { $first: "$total" }
                }},
                { $project: {
                    _id: 0,
                    items: {
                        _id: 0,
                        __v: 0
                    }
                }}
            ]).limit(1);
    
            if(!foundOrder || foundOrder.length === 0) {
                return null
            } else {
                return foundOrder[0];
            }
        }

    } catch(e) {
        console.log('Error > ',e.message);
        if(e.message.includes('invalid')) {
            throw e;
        } else {
            throw new Error(`Order ${order_id} not found`);
        }
    }
}

module.exports.getUserOrders = async (user_id) => {
    try {
        const foundOrder = await Order.find({ userId: user_id }).lean();
        return foundOrder;

    } catch(e) {
        throw new Error(`No orders for user ${user_id}`);
    }
}

module.exports.getAllOrders = async () => {
    try {
        const foundOrders = await Order.find().lean();
        return foundOrders;

    } catch(e) {
        throw new Error(e.message);
    }
}