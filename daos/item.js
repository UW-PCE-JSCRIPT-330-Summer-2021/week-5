const Item = require('../models/item');

module.exports = {};

module.exports.createItem = async (itemObj) => {
  return await Item.create(itemObj);
}

module.exports.updateItem = async (itemId, newObj) => {
  return await Item.update( {_id: itemId }, newObj);
}

module.exports.getAllItems = async () => {
  return await Item.find().lean();
} 

module.exports.getItemById = async (itemId) => {
  return await Item.findOne({ _id: itemId }).lean();
}