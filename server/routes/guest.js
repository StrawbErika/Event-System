// CRUD
var express = require("express");
var router = express.Router();
const { db } = require("../db");
const { uuid } = require("uuidv4");

router.post("/delete", async function (req, res) {
  const guestId = req.body.id;
  const eventId = req.body.eventId;
  await db("users_events")
    .where({ guest_id: guestId, event_id: eventId })
    .del();
});

router.post("/add", async function (req, res) {
  const guest = req.body;
  await db("users_events").insert({
    guest_id: guest.id,
    author_id: guest.author,
    event_id: guest.event_id,
  });
});

router.post("/read", async function (req, res) {
  const eventId = req.body.id;
  const query = `
  select u.id, u.username from users u 
  inner join users_events ue on u.id = ue.guest_id
  inner join events e on e.id=ue.event_id
  where e.id="${eventId}"; 
  `;
  const guests = await db.raw(query);
  res.send(guests);
});

router.post("/");

module.exports = router;
// can login
