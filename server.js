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

const makeQuery = function(res,query) {
  connection.query(query, (error, results, fields) => {
    res.send(JSON.stringify(results[0]));
  });
};

app.get("/profile/name", (req, res) => {
  makeQuery(res,"select username as userName from users limit 1");
});

app.get("/profile/follower", (req, res) => {
  makeQuery(res,"select count(follower_id ) as follower from follow where followee_id =1");
});

app.get("/profile/followee", (req, res) => {
  makeQuery(res,"select count(followee_id ) as followee from follow where follower_id =1");
});

app.get("/profile/post", (req, res) => {
  makeQuery(res,"select count(photo_url) as post from photos where user_id=1");
});

app.listen(process.env.PORT || 8000);
