const mongoose = require('mongoose');
const Order = require('../models/order');

module.exports = {};

//Create: POST /orders - open to all users
module.exports.createOrder = async (orderObj) => {
    //create an order object
    const created = await Order.create(orderObj);
    return created;
};

//Get my orders: GET /orders
module.exports.getOrders = async () => {
    //find all orders
    return await Order.find().lean();
};

//Get an order: GET /order/:id
//finds one order
//uses aggregation for sorting of order, using the orderId
//matches the order to the orderId
//unwinds the order to ouput a document of the items
//joins all the items and each id, and creates one element that contains both the item and its specific id
//project passes the document of the id to the next stage in the pipeline
//groups the input id by the user Id, items, and the total of each order
module.exports.getOrderById = async (orderId) => {
    const order = await Order.aggregate([
        { $match: { _id: mongoose.Types.ObjectId(orderId) }},
        { $unwind: "$items" },
        { $lookup: { from: "items", localField: "items", foreignField: "_id", as: "item" }},
        { $unwind: '$item'},
        { $project: { _id: 0} },
        { $group: { _id: "$_id", userId: { $first: "$userId" }, items: { $push: "$item"}, total: {$first: "$total"}}}
    ]);
    return order[0];
};

//get an order by user id
module.exports.getOrderByUser = async(userId) => {
    //find all orders by the corresponding userId
    return await Order.find({ userId: userId });
};