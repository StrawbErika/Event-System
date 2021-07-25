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
  await db("events").where("id", req.body.id).del();
  //   TODO: what will res?
  const events = await db("events").select();
  res.send(events);
});

router.post("/read", async function (req, res) {
  const events = await db("events").select();
  res.send(events);
});

router.post("/readOne", async function (req, res) {
  const event = await db("events").select().where({ id: req.body.id });
  res.send(event);
});

router.post("/");

module.exports = router;
// can login
