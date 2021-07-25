var express = require("express");
var router = express.Router();
const { db } = require("../db");

/* GET users listing. */
router.get("/read", async function (req, res, next) {
  const users = await db("users").select("id", "username");
  res.send(users);
});

module.exports = router;
