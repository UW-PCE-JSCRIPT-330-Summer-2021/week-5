// const mongoose = require('mongoose');
const Item = require('../models/item');

module.exports = {};

module.exports.createItem = async (itemObj) => {
    try {
        const itemCreated = await Item.create(itemObj);
        return itemCreated;
    } catch (e) {
        return null;
    }
};

module.exports.updateItem = async (itemId, itemObj) => {
    try {
        const itemUpdated = await Item.updateOne({ _id: itemId }, itemObj);
        return itemUpdated;
    } catch (e) {
        next(e);
    }
  
};

module.exports.getAll = async () => {
    try {
        const itemsAll = await Item.find().lean();
        return itemsAll;
    } catch (e) {
        next(e);
    }
};

module.exports.getItem = async (itemId) => {
    try {
        const itemUnique = await Item.findOne({ _id: itemId }).lean();
        return itemUnique;
    } catch (e) {
        next(e);
    }
};
