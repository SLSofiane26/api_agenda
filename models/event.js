let mongoose = require("mongoose");

let event = new mongoose.Schema({
  user: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "user",
    required: true,
  },
  date: {
    type: Number,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  body: {
    type: String,
  },
  creationDate: {
    type: Number,
    required: true,
  },
  modificationDate: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("event", event);
