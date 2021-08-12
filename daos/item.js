const mongoose = require('mongoose');
const Item = require('../models/item');

module.exports = {};

module.exports.createItem = async (itemObj) => {
  try {
    const itemCreated = await Item.create(itemObj);
    return itemCreated;
  } catch (e) {
    throw e;
  }
}

module.exports.updateItem = async (itemId, itemObj) => {
  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    return false;
  } else {
    try {
      await Item.updateOne({ _id: itemId }, itemObj);
      return true;
    } catch (e) {
      throw e;
    }
  }
}

module.exports.getAll = async () => {
  const allItems = await Item.find().lean();
  return allItems;
}

module.exports.getItem = async (itemId) => {
  const oneItem = await Item.findOne({ _id: itemId }).lean();
  return oneItem;
}
