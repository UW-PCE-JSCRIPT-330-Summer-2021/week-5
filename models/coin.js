const mongoose = require('mongoose');

const coinSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  symbol: { type: String, required: true, unique: true },
  price: { type: Number, required: true },
  marketCap: { type: Number, required: true },
  marketCapRank: { type: Number, required: true, unique: true }
});


module.exports = mongoose.model("coin", coinSchema);