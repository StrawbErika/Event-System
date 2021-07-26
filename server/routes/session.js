var express = require("express");
var router = express.Router();
const passport = require("passport");
const { db } = require("../db");
const { uuid } = require("uuidv4");

router.post("/login", passport.authenticate("local"), function (req, res) {
  res.json(req.user);
});

router.get("/logout", function (req, res) {
  req.logout();
  res.redirect("/");
});

router.get("/whoami", function (req, res) {
  if (req.user) {
    res.json(req.user);
  } else {
    res.send(null);
  }
});

router.post("/signup", async function (req, res) {
  const userBody = { ...req.body, id: uuid() };
  await db("users").insert(userBody);
  const user = await db("users").select("id", "username").where({
    id: userBody.id,
  });
  res.send(user);
});

module.exports = router;
// can login
