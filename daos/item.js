const Item = require('../models/item');
module.exports = {};

module.exports.createItem = async (itemObj) => {
  const item = await Item.create(itemObj);
  return item;
}

module.exports.getItem = async (itemId) => {
  const item = await Item.findOne({ _id: itemId }).lean();
  return item;
}

module.exports.updateItem = async (itemId, itemObj) => {
  const updatedItem = await Item.updateOne({ _id: itemId }, itemObj);
  return updatedItem;
}

module.exports.getItems = async () => {
  const items = await Item.find().lean();
  return items;
}