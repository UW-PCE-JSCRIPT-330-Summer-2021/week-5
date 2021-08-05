const mongoose = require('mongoose');
const Item = require('../models/item');

module.exports = {};

module.exports.createItem = async (itemObj) => {
  try {
    const created = await Item.create(itemObj);
    return created;
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
  return await Item.find().lean()
}

module.exports.getItem = async (itemId) => {
  return await Item.findOne({ _id: itemId }).lean();
}