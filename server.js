const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");

const connection = mysql.createConnection({
  host: "us-cdbr-iron-east-02.cleardb.net",
  user: "b86b53caf069d5",
  password: "1077624f",
  database: "heroku_9b06396d28cc444"
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

app.get("/profile/follower", (req, res) => {
  const query =
    "select count(follower_id ) as followers from follow where followee_id =1";
  connection.query(query, (error, results, fields) => {
    res.send(
      JSON.stringify({
        follower: results[0].followers
      })
    );
  });
});

app.get("/profile/followee", (req, res) => {
  const query =
    "select count(followee_id ) as followees from follow where follower_id =1";
  connection.query(query, (error, results, fields) => {
    res.send(
      JSON.stringify({
        followee: results[0].followees
      })
    );
  });
});

app.listen(process.env.PORT || 8000);
