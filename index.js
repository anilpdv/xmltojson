// : importing required modules
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");

// : creating instance of app
const app = express();
const initialRoutes = require("./routes");

// : middleware
app.use(morgan("combined"));

app.use(bodyParser.urlencoded({ extended: false }));

app.use(cors());

// : routes
app.use("/", initialRoutes);

// : middle not found
app.use(function (req, res, next) {
  let err = new Error("route not found");
  err.status = 404;
  next(err);
});

// : Error handler
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.json({ err: { message: err.message } });
  next();
});

let port = process.env.PORT || "5000";
app.listen(port, () => {
  console.log("app is start listening : " + port);
});
