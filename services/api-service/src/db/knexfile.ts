const pg = require("pg");

module.exports = {
  client: "pg",
  connection: process.env.POSTGRES_DB_URL,
  migrations: {
    directory: "./migrations",
  },
  pool: {
    min: 2,
    max: 100,
  },
  ssl: {
    rejectUnauthorized: false,
  },
};

export {};
