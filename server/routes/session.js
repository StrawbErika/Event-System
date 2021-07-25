var express = require("express");
var router = express.Router();
const passport = require("passport");
const { db } = require("../db");

router.post("/login", passport.authenticate("local"), function (req, res) {
  res.json(req.user);
});

router.post("/logout", function (req, res) {
  req.logout();
  res.send("Logged out");
});

router.post("/whoami", function (req, res) {
  if (req.user) {
    res.json(req.user);
  } else {
    res.send("Logged out");
  }
});

router.post("/signup", async function (req, res) {
  await db("users").insert(req.body);
  const user = await db("users").select("id", "username").where({
    id: req.body.id,
  });
  res.send(user);
});

module.exports = router;
// can login
