const mongoose = require('mongoose');
const Order = require('../models/order');
const Item = require('../models/item');
module.exports = {};

module.exports.createOrder = async (itemIds, userId) => {
	let total = 0;
	for (const id of itemIds) {
		const item = await Item.findOne({ _id: id }).lean();
		if (!item) {
			throw new Error('Not found');
		}
		total += item.price;
	}
	const order = {
		userId: userId,
		items: itemIds,
		total: total,
	};
	return await Order.create(order);
};

module.exports.getOrderByUserId = async (userId) => {
	try {
		const foundOrder = await Order.find({ userId: userId }).lean();
		return foundOrder;
	} catch (e) {
		throw new Error(`No orders for user ${userId}`);
	}
};

module.exports.getOrderByOrderId = async (orderId) => {
	try {
		const orderDetail = await Order.aggregate([
			{ $match: { _id: mongoose.Types.ObjectId(orderId) } },
			{ $unwind: '$items' },
			{
				$lookup: {
					from: 'items',
					localField: 'items',
					foreignField: '_id',
					as: 'itemDetail',
				},
			},
			{ $unwind: '$itemDetail' },
			{
				$group: {
					_id: '$_id',
					userId: { $first: '$userId' },
					items: { $push: '$itemDetail' },
					total: { $first: '$total' },
				},
			},
			{ $project: { _id: 0, items: { __v: 0, _id: 0 } } },
		]);
		return orderDetail[0];
	} catch (e) {
		throw e;
	}
};
// Get all orders
module.exports.getAllOrders = async () => {
	try {
		const foundOrders = await Order.find().lean();
		return foundOrders;
	} catch (e) {
		throw new Error(e.message);
	}
}; 