exports.up = async function (knex) {
  //what instructions to setup db
  await knex.schema.createTable("users", function (table) {
    table.string("id").primary();
    table.string("username");
    table.string("password");
  });

  await knex.schema.createTable("events", function (table) {
    table.string("id").primary();
    table.timestamp("date");
    table.timestamp("startTime");
    table.timestamp("endTime");
    table.string("author");
    //TODO: Either author_id or author
  });

  return knex.schema.createTable("users_events", function (table) {
    table.string("author_id");
    table.string("guest_id");
    table.string("event_id");
  });
};

exports.down = async function (knex) {
  //what do when reverting up
  await knex.schema.dropTableIfExists("users_events");
  await knex.schema.dropTableIfExists("users");
  return knex.schema.dropTableIfExists("events");
};
