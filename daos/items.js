const mongoose = require('mongoose');
const Item = require('../models/item');

module.exports = {};

module.exports.createItem = async (item) => {
  try {
    return await Item.create(item);
  } catch (e) {
    throw new Error('Could not create item');
  }
};

module.exports.updateItem = async (itemId, itemObj) => {
  try {
    const updateditem = await Item.updateOne({ _id: itemId }, itemObj);

    return true;
  } catch (e) {
    throw new Error(`Could not update item id ${item._id}`);
  }
};

module.exports.getItemById = async (itemId) => {
  try {
    const foundItem = await Item.findOne({ _id: itemId });
    return foundItem;
  } catch (e) {
    throw new Error(`Could not find item with id: ${itemID}`);
  }
};

module.exports.getAll = async () => {
  try {
    return await Item.find().lean();
  } catch (e) {
    throw new Error('Could not retrieve items');
  }
};
