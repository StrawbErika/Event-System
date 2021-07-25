exports.db = require('knex')({
    client: 'sqlite3',
    connection: {
      filename: "./dev.sqlite3"
    }
  });