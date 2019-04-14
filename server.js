const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "ankan4you",
  database: "instagram"
});

connection.connect();

const app = express();

app.use(express.static("instagram_react/build"));
app.use(bodyParser.text());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/profile/name", (req, res) => {
  const query = "select username from users limit 1";
  connection.query(query, (error, results, fields) => {
    res.send(
      JSON.stringify({
        userName: results[0].username
      })
    );
  });
});


app.listen(process.env.PORT || 8000);
