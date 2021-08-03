const mongoose = require('mongoose');

// const User = require('../models/user');
const Item = require('../models/item');

module.exports = {};

module.exports.createItem = async (item) => {
    try {
        const createdItem = await Item.create(item);
        return createdItem;
    } catch(e) {
        throw new Error('Could not create item');
    }
}

module.exports.getItemById = async (itemId) => {
    try {
        const foundItem = await Item.findOne({ _id: itemId });
        return foundItem;
    } catch(e) {
        throw new Error(`Could not find item with id: ${itemID}`);
    }
}

module.exports.getAll = async () => {
    try {
        return await Item.find().lean();
    } catch(e) {
        throw new Error('Could not retrieve items');
    }
}

module.exports.getOrderItems = async (itemsArray) => {
    try {
        // const items = await Item.find( { _id: { $in: itemsArray }});
        const items = await Item.aggregate([
            { $match: { $in: itemsArray }},
            { $project: {
                _id: 0,
                title: 1,
                price: 1
            }}
        ]);
        return items;

    } catch(e) {
        throw new Error('Could not retrieve items');
    }
}

module.exports.updateItem = async (itemId, item) => {
    try {
        const updatedItem = await Item.updateOne({ _id: itemId }, item);
        return updatedItem;
    } catch(e) {
        throw new Error(`Could not update item with id ${item._id}`);
    }
}