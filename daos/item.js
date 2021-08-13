const Item = require('../models/item');

module.exports = {};

module.exports.createItem = async (itemObj) => {
    try {
        return await Item.create(itemObj);
    } catch (e) {
        throw e
    }
};

module.exports.getItemById = async (itemId) => {
    try {
        return await Item.findOne({ itemId }).lean();
    } catch (e) {
        throw e
    }
};

module.exports.getAll = async () => {
    try {
        return await Item.find().lean();
    } catch (e) {
        throw e
    }
};

module.exports.updateItem = async (itemId, newObj) => {
    try {
        return await Item.updateOne( { _id: itemId }, newObj)
    } catch(e) {
        throw e
    }
};

module.exports = router;