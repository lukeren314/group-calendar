const express = require("express");
const groupsRoute = require("./groups");

// the base router for all api endpoints
const router = express.Router();

// install the user route
router.use("/groups", groupsRoute);

module.exports = router;
