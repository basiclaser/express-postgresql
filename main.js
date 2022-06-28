require("dotenv").config();
const express = require("express");
const app = express();
const { Pool } = require("pg");

const pool = new Pool({
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_URL,
  database: "mydb",
  port: 5432,
});
pool.connect((err, client, release) => {
  if (err) {
    return console.error("Error acquiring client", err.stack);
  } else {
    console.log("database connection established");
    client.query("SELECT NOW()", (err, result) => {
      release();
      if (err) {
        return console.error("Error executing query", err.stack);
      }
      console.log(result.rows);
    });
  }
});

console.log(
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  process.env.DB_URL
);

app.get("/", (req, res) => {
  pool // We're using the instance connected to the DB
    .query("SELECT * FROM users;")
    .then((data) => res.json(data)) // We can send the data as a JSON
    .catch((e) => res.sendStatus(500)); // In case of problem we send an HTTP code
});

app.listen("3000", () => console.log("connected"));
