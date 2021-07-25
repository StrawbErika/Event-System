exports.up = function (knex) {
  //what instructions to setup db
  return knex.schema.createTable("users", function (table) {
    table.string("id").primary();
    table.string("username");
    table.string("password");
  });
};

exports.down = function (knex) {
  //what do when reverting up
  return knex.schema.dropTableIfExists("users");
};
