let mongoose = require("mongoose");

let profile = new mongoose.Schema({
  user: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "user",
    required: true,
  },
  age: {
    type: Number,
  },
  address: {
    type: String,
  },
  city: {
    type: String,
  },
  zipCode: {
    type: String,
  },
  phoneNumber: {
    type: String,
  },
  creationDate: {
    type: Date,
    default: Date.now(),
  },
  modificationDate: {
    type: Date,
  },
});

module.exports = mongoose.model("profile", profile);
