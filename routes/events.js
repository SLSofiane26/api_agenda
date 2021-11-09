let express = require("express");
let router = express.Router();
let { check, validationResult } = require("express-validator");
let auth = require("../middleware/auth");
let eventSchema = require("../models/event");
let userSchema = require("../models/user");

router.get("/event", auth, async (req, res) => {
  try {
    let event = await userSchema.findById(req.user.id).populate("event");
    res.status(200).json(event);
  } catch (err) {
    console.log(err);
    res.status(500).send("SERVEUR ERROR");
  }
});

router.post(
  "/event",
  auth,
  [
    check("date", "Date de l'évènement obligatoire").exists(),
    check("title", "Titre de l'évènement obligatoire").exists(),
  ],
  async (req, res) => {
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(422).json({ errors: errors.array() });
    }

    try {
      let user = await userSchema.findById(req.user.id);

      let { date, title, body } = req.body;

      let f = {};

      f.user = req.user.id;

      f.date = date;

      f.title = title;

      f.body = body;

      f.creationDate = Date.now();

      f.modificationDate = Date.now();

      let newEvent = new eventSchema(f);

      user.event.push(newEvent._id);

      await user.save();
      await newEvent.save();

      res.status(200).json(newEvent);
    } catch (err) {
      console.log(err);
      res.status(500).send("SERVEUR ERROOR");
    }
  }
);

router.delete("/event/:id", auth, async (req, res) => {
  try {
    let user = await userSchema.findById(req.user.id).populate("event");
    let event = await eventSchema.findById(req.params.id);

    user.event.map((items, index) => {
      if (event._id.toString() === items._id.toString()) {
        user.event.splice(index, 1);
      }
    });

    await user.save();
    await event.remove();

    res.status(200).json(user);
  } catch (err) {
    console.log(err);
    res.status(500).send("SERVEUR ERROR");
  }
});

module.exports = router;
