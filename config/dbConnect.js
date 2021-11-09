let config = require("config");
let mongoose = require("mongoose");

module.exports = async () => {
  try {
    await mongoose.connect(config.get("mongoURI"), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("dbConnected");
  } catch (err) {
    console.log(err);
  }
};
