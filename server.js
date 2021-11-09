let express = require("express");
let app = express();
let http = require("http");
let dbConnect = require("./config/dbConnect");
let cors = require("cors");
let https = require("https");
let fs = require("fs");

dbConnect();

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(cors());

app.use("/", require("./routes/auth.js"));

app.use("/", require("./routes/events.js"));

app.use("/", require("./routes/user.js"));

app.get("/", async (req, res) => {
  res.send("OK");
});

http.createServer(app).listen(3000, () => {
  console.log("connect");
});
