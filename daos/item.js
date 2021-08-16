const mongoose = require('mongoose');
const Item = require('../models/item');

module.exports = {};

module.exports.createItem = async (itemObj) => {
  return await Item.create(itemObj)
}

module.exports.updateItem = async (itemId, itemObj) => {
  return await Item.updateOne({ _id: itemId }, itemObj)
}

module.exports.getAll = async () => {
  return await Item.find().lean()
}

module.exports.getItem = async (itemId) => {
  return await Item.findOne({ _id: itemId }).lean()
}