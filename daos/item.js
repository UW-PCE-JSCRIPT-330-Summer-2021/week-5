const Item = require('../models/item');

module.exports = {};

module.exports.createItem = (itemObj) => {
    return Item.create(itemObj);
}

module.exports.getItem = (itemId) => {
    return Item.findOne({ _id: itemId }).lean();
}

module.exports.getAll = () => {
    return Item.find().lean()
}

module.exports.updateItem = (itemId, newObj) => {
    return Item.updateOne({ _id: itemId }, newObj);
}
