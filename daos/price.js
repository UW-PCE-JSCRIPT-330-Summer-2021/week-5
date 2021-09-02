const Prices = require("../models/price");

module.exports = {};

module.exports.create = (priceObj) => {
    return Prices.create(priceObj);
}

module.exports.getPrices = () => {
    return Prices.find({}).lean();
}

module.exports.getPricesById = (id) => {
    return Prices.findOne({ id }).lean();
}

module.exports.updatePricesById = (id, newData) => {
    return Prices.findOneAndUpdate({ id }, newData, { new: true }).lean();

}

module.exports.removePricesById = async (id) => {
    return Prices.findOneAndDelete({ _id: id });
}