let mongoose = require("mongoose");

let user = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
  },
  profile: [
    {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "profile",
    },
  ],
  client_secret: {
    type: String,
  },
  customer_id: {
    type: String,
  },
  sub_id: {
    type: String,
  },
  abonnement_id: { type: String },
  paiement_id: { type: String },
  plan_id: { type: String },
  product_id: { type: String },
  start: {
    type: Number,
  },
  end: {
    type: Number,
  },
  abonnement: {
    type: Boolean,
    default: false,
  },
  event: [{ type: mongoose.SchemaTypes.ObjectId, ref: "event" }],
  paiement: [{ type: mongoose.SchemaTypes.ObjectId, ref: "paiement" }],
});

module.exports = mongoose.model("user", user);
