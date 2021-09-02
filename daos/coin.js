const Coin = require('../models/coin')

module.exports = {};

module.exports.create = (coin) => {
  return Coin.create(coin);
};

module.exports.getAll = () => {
  return Coin.find({}).lean();
};

module.exports.getCoinById = (id) => {
  return Coin.findOne({ id }).lean();
};

module.exports.updateById = (id, newData) => {
  return Coin.findOneAndUpdate({ id }, newData, { new: true }).lean();
};

module.exports.removeById = (id) => {
  return Coin.findOneAndDelete({ _id: id });
}