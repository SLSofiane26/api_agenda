let express = require("express");
let route = express.Router();
let auth = require("../middleware/auth");
let userSchema = require("../models/user");
let eventSchema = require("../models/event");
let bcrypt = require("bcrypt");
let { check, validationResult } = require("express-validator");
let jwt = require("jsonwebtoken");
let config = require("config");

route.post(
  "/register",
  [
    check("firstName", "Nom obligatoire").exists(),
    check("lastName", "Nom obligatoire").exists(),
    check("email", "Nom obligatoire").exists().isEmail(),
    check("password", "Nom obligatoire").exists().isLength({ min: 5 }),
  ],
  async (req, res) => {
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(400).json({ error: errors.array() });
    }

    try {
      let { firstName, lastName, email, password } = req.body;

      let d = {};
      d.firstName = firstName.toLowerCase();
      d.lastName = lastName.toLowerCase();
      d.email = email.toLowerCase();

      let salt = await bcrypt.genSalt(10);

      d.password = await bcrypt.hash(password, salt);

      let user = new userSchema(d);

      await user.save();

      let payload = {
        user: {
          id: user.id,
        },
      };

      await jwt.sign(
        payload,
        config.get("secretToken"),
        { expiresIn: 3600 },
        (err, token) => {
          if (err) throw err;
          res.json({ token: token });
        }
      );
    } catch (err) {
      console.log(err);
      res.status(500).send("SERVEUR ERROR");
    }
  }
);

route.post(
  "/auth",
  [
    check("email", "Adresse email obligatoire").exists().isEmail(),
    check("password", "Mot de passe obligatoire").exists(),
  ],
  async (req, res) => {
    let { email, password } = req.body;

    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(422).json({ error: errors.array() });
    }

    try {
      let user = await userSchema.findOne({ email: email.toLowerCase() });

      if (user) {
        let isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
          let payload = {
            user: {
              id: user.id,
            },
          };

          await jwt.sign(
            payload,
            config.get("secretToken"),
            { expiresIn: 3600 },
            (err, token) => {
              if (err) throw err;
              res.json({ token: token });
            }
          );
        } else {
          res.status(401).json({ msg: "Mot de passe erroné" });
        }
      } else {
        res.status(401).json({ msg: "Adresse email inconnue" });
      }
    } catch (err) {
      res.status(500).send("SERVEUR ERREUR");
      console.log(err);
    }
  }
);

module.exports = route;
