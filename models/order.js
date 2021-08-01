const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
  items: { type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'items' }], required: true },
  //  items: { type: [{ type: subSchema,  default: {}, ref: 'items' }], required: false },
  total: { type: Number, required: true }
});


module.exports = mongoose.model("orders", orderSchema);