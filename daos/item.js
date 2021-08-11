const mongoose = require('mongoose');
const Item = require('../models/item');

module.exports = {};

//Create Item
module.exports.createItem = async (newItem) => {
	try {
		const created = await Item.create(newItem);
		return created;
	} catch (e) {
		throw e;
	}
};

//Update Item
module.exports.updateItem = async (itemId, newItem) => {
	const itemFromDB = await Item.findOne({ _id: itemId }).lean();
	if (!itemFromDB) {
		throw new Error('404 - Not Found');
	}
	return await Item.updateOne(
		{ _id: itemId },
		{ $set: { price: newItem.price } }
	);
};

// Getting All Items
module.exports.getItems = async () => {
	return await Item.find({}).lean();
};

//Get Item by ID
module.exports.getItem = async (id) => {
	return await Item.findOne({ _id: id }).lean();
};
