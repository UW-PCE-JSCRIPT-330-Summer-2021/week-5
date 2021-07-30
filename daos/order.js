const Order = require('../models/order')

module.exports = {}

module.exports.createOrder = async (OrderObj) => {
    const order = await Order.create(OrderObj)
    return order
}

module.exports.getOrder = async (_id) => {
    return await Order.findOne({ _id }).lean()
}

module.exports.getOrdersForCustomer = async (customerId, isAdmin) => {
    if (isAdmin)
        return await Order.find().lean()
    else
        return await Order.find({userId: customerId}).lean()
}

module.exports.updateOrder = async (OrderId, newObj) => {
    //await Order.updateOne( { _id: Order._id }, { $set: { password } } )
    await Order.updateOne({ _id: OrderId }, newObj);
    return true
}