const Item = require('../models/item');

module.exports = {};

module.exports.createItem = async (newObj) => {
    try {
        const createNewItem = await Item.create(newObj);
        return createNewItem;
    } catch (e) {
        next(e)
    }
};

module.exports.getItemById = async (itemId) => {
    try {
        return await Item.findOne({ itemId }).lean();
    } catch (e) {
        next(e)
    }
};

module.exports.getAll = async () => {
    try {
        return await Item.find().lean();
    } catch (e) {
        next(e)
    }
};

module.exports.updateItem = async (itemId, newObj) => {
    try {


    } catch(e) {
        next(e)
    }
};

