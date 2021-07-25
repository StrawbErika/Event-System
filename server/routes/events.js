// CRUD
var express = require("express");
var router = express.Router();
const { db } = require("../db");
const { uuid } = require("uuidv4");

router.post("/create", async function (req, res) {
  const eventId = uuid();
  const eventsBody = { ...req.body, id: eventId };
  await db("events").insert({
    date: req.body.date,
    startTime: req.body.startTime,
    endTime: req.body.endTime,
    author: req.body.author,
    id: eventId,
  });
  const event = await db("events").select().where({
    id: eventsBody.id,
  });
  const guests = req.body.guests;
  await db("users_events").insert(
    guests.map((guests) => {
      return {
        guest_id: guests.id,
        event_id: eventId,
        author_id: req.body.author,
      };
    })
  );
  res.send(event);
});

router.post("/delete", async function (req, res) {
  const eventId = req.body.id;
  await db("users_events").where("event_id", eventId).del();
  await db("events").where("id", eventId).del();
});

router.post("/edit", async function (req, res) {
  const eventId = req.body.id;
  // TODO:
  //
});

router.post("/readOwned", async function (req, res) {
  const events = await db("events").select().where({ author: req.body.id });
  res.send(events);
});

// TODO:
router.post("/readInvited", async function (req, res) {
  const userId = req.body.id;
  const query = `
  select e.id, e.date, e.startTime, e.endTime, e.author from events e 
  inner join users_events ue on e.id = ue.event_id 
  INNER JOIN users u on u.id = ue.guest_id 
  WHERE u.id = "${userId}";
  `;
  const events = await db.raw(query);
  res.send(events);
});

router.post("/");

module.exports = router;
// can login
