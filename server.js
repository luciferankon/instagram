const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.use(express.static("instagram_react/build"));
app.use(bodyParser.text());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/profile/data", (req, res) => {
  res.send(
    JSON.stringify({
      userName: "ankon",
      post: 2,
      follower: 20,
      followee: 20,
      posts: ["a", "b"]
    })
  );
});

app.listen(8000);
