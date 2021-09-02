const mongoose = require('mongoose');

const priceSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    prices_hourly: { type: [[Number, Number]] },
    prices_daily: { type: [[Number, Number]] }
});

module.exports = mongoose.model("price", priceSchema);