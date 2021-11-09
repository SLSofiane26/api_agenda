let mongoose = require("mongoose");

let paiement = new mongoose.Schema({
  dateStart: {
    type: Number,
    required: true,
  },
  dateEnd: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("paiement", paiement);
