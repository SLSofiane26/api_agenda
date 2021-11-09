let express = require("express");
let route = express.Router();
let auth = require("../middleware/auth");
let userSchema = require("../models/user");
let profilSchema = require("../models/profile");
let stripe = require("stripe")(
  "sk_test_51JlEeSKFhUTtY2eIZVCwrKCnMxf7QLCK2E2242Gr2SchFOUevzpkImaPY9LIQGetHAfJr7YaVYDM1jINIuKyilhB00N7CBBDr5"
);

route.post("/sub", async (req, res) => {
  try {
    let { email, payment_method, priceId } = req.body;

    let customer = await stripe.customers.create({
      payment_method: payment_method,
      email: email,
      invoice_settings: {
        default_payment_method: payment_method,
      },
    });

    let subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [
        {
          price: priceId,
        },
      ],
      payment_behavior: "default_incomplete",
      expand: ["latest_invoice.payment_intent"],
    });

    let status = subscription["latest_invoice"]["payment_intent"]["status"];
    let client_secret =
      subscription["latest_invoice"]["payment_intent"]["client_secret"];

    res.json({
      client_secret: client_secret,
      status: status,
      id: customer.id,
      subId: subscription.id,
      start: subscription.current_period_start,
      end: subscription.current_period_end,
      paiementId: subscription.latest_invoice.payment_intent.id,
      planId: subscription.plan.id,
      productId: subscription.plan.product,
    });
  } catch (err) {
    res.status(500).send("SERVOR ERROR");
    console.log(err);
  }
});

route.get("/key", async (req, res) => {
  res.json(
    "pk_test_51JlEeSKFhUTtY2eItaweixIrXMWxDo6BQfJzgrBtRsmFLG9KAMc7qgMtISDKrArCNjHTjKr5x1prIIb8VuJDcKOD00uRRcBFpB"
  );
});

route.get("/user", auth, async (req, res) => {
  try {
    let user = await userSchema.findById(req.user.id);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(401).json({ msg: "Aucun utilisateur" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("SERVEUR ERROR");
  }
});

route.put("/user", auth, async (req, res) => {
  try {
    let user = await userSchema.findById(req.user.id);
    user.client_secret = req.body.client_secret;
    user.customer_id = req.body.id;
    user.sub_id = req.body.subId;
    user.start = req.body.start;
    user.end = req.body.end;
    user.paiement_id = req.body.paiementId;
    user.plan_id = req.body.planId;
    user.product_id = user.productId;
    user.abonnement = true;
    await user.save();

    res.status(200).json({ msg: "ok" });
  } catch (err) {
    console.log(err);
    res.status(500).send("SERVEUR ERREUR");
  }
});

route.put("/userb", auth, async (req, res) => {
  let { firstName, lastName, age, adress, zipCode, phoneNumber, city } =
    req.body;
  try {
    let user = await userSchema.findById(req.user.id);

    let d = {};
    firstName ? (d.firstName = firstName) : (d.firstName = user.firstName);
    lastName ? (d.lastName = lastName) : (d.lastName = user.lastName);

    let userb = await userSchema.findByIdAndUpdate(
      req.user.id,
      {
        $set: d,
      },
      { new: true }
    );

    let f = {};
    f.age = age;
    f.adress = adress;
    f.zipCode = zipCode;
    f.phoneNumber = phoneNumber;
    f.user = user.id;
    f.city = city;
    f.modificationDate = Date.now();

    let profile = new profilSchema(f);

    user.profile.push(profile._id);

    await profile.save();

    await userb.save();

    res.status(200).json({ msg: "ok" });
  } catch (err) {
    res.status(500).send("SERVOR ERROR");
    console.log(err);
  }
});

module.exports = route;
