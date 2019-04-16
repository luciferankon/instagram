const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const view = require("ejs");

const connection = mysql.createConnection({
  host: process.env.DB_ROOT,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
});

connection.connect();

const app = express();

app.set("views", __dirname + "/instagram_react/build");
app.engine("html", view.renderFile);
app.set("view engine", "html");

app.use(express.static("instagram_react/build"));
app.get(/\/user/, (req, res) => {
  res.render("index.html");
});

app.use((req, res) => {
  console.log(req.url);
  req.next();
});

app.use(bodyParser.text());
app.use(bodyParser.urlencoded({ extended: true }));

const makeQuery = function(res, query) {
  connection.query(query, (error, results, fields) => {
    if (error) console.log(error);
    res.send(JSON.stringify(results[0]));
  });
};

app.post("/profile/name", (req, res) => {
  const name = req.body;
  res.send(JSON.stringify({ userName: name }));
});

app.post("/profile/follower", (req, res) => {
  const name = req.body;
  makeQuery(
    res,
    `select count(follower_id) as follower from follow where followee_id=(select id from users where username="${name}")`
  );
});

app.post("/profile/followee", (req, res) => {
  const name = req.body;
  makeQuery(
    res,
    `select count(followee_id) as followee from follow where follower_id=(select id from users where username="${name}")`
  );
});

app.post("/profile/post", (req, res) => {
  const name = req.body;
  makeQuery(
    res,
    `select count(photo_url) as post from photos where user_id=(select id from users where username="${name}")`
  );
});

app.post("/profile/posts", (req, res) => {
  const name = req.body;
  connection.query(
    `select photo_url from photos where user_id=(select id from users where username="${name}")`,
    (err, results, fields) => {
      const posts = results.map(result => result.photo_url);
      res.send(JSON.stringify({ posts }));
    }
  );
});

app.post("/search", (req, res) => {
  const name = req.body.name;
  res.redirect(`/user?name=${name}`);
});

app.listen(process.env.PORT || 8000);
