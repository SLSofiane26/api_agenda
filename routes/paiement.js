let express = require("express");
let router = express.Router();

router.post("/payment", async (req, res) => {
  try {
  } catch (err) {
    console.log(err);
    res.status(500).send("SERVEUR ERROR");
  }
});

module.exports = router;
