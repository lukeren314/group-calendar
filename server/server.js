const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");
const fileUpload = require("express-fileupload");

const path = require("path");
const routes = require("./routes"); // import routes from routes/index.js

// Load environment variables from .env file
dotenv.config({ path: __dirname + "/.env" });

// create the application
const app = express();

// apply middleware
app.use(
  fileUpload({
    createParentPath: true,
  })
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan("dev"));
// set up the routes for the api and the static files
app.use("/api", routes);
app.use(express.static(path.join(__dirname, "../client/dist")));

// default route to index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist", "index.html"));
});

module.exports = app;
