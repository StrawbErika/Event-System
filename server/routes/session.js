var express = require("express");
var router = express.Router();
const passport = require("passport");

router.post("/login", passport.authenticate("local"), function (req, res) {
  res.json(req.user);
});

router.post("/logout", function (req, res) {
  req.logout();
  res.send("Logged out");
});

module.exports = router;
// can login
