const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId, ref: "users", required: true,
  },
  coins: {
    type: [{ coinId: { type: String }, coinCount: { type: Number } }],
  },
});

module.exports = mongoose.model("account", accountSchema);
