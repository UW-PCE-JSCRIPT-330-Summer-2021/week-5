const Order = require('../models/order')
const mongoose = require('mongoose')

module.exports = {}

module.exports.createOrder = async (OrderObj) => {
    const order = await Order.create(OrderObj)
    return order.toObject()
}

module.exports.getOrder = async (orderId) => {
    const order = await Order.aggregate([
        { $match: { _id: mongoose.Types.ObjectId(orderId) }},
        { $unwind: "$items" },
        { $lookup: { from: "items",  localField: "items",  foreignField: "_id",  as: "item"  } },
        { $unwind: "$item" },
        { $project: { userId: "$userId", item: "$item", total: "$total" } },       
        { $group: { _id: "$_id", userId: {$first: "$userId"}, items: {$push: "$item"}, total: {$first: "$total"} } }
    ]).limit(1)
    
    if (order && order.length === 1)
        return order[0]
    else
        return null
}

module.exports.getOrdersForCustomer = async (customerId, isAdmin) => {
    if (isAdmin)
        return await Order.find().lean()
    else
        return await Order.find({userId: customerId}).lean()
}

module.exports.updateOrder = async (OrderId, newObj) => {
    await Order.updateOne({ _id: OrderId }, newObj)
    return true
}