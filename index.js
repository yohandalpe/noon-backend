const express = require("express");
const app = express();
var bodyParser = require("body-parser");
var db = require("./database.js");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// root endpoint
app.get("/", (request, response) => {
  response.json({ message: "ok" });
});

// get all posts from the database
app.get("/api/posts", (request, response) => {
  var sql = "SELECT * FROM posts";
  db.all(sql, (error, rows) => {
    if (error) {
      response.status(400).json({ message: "error", error: error.message });
      return;
    }
    response.json({
      message: "success",
      data: rows,
    });
  });
});

// update is_favourite
app.patch("/api/posts/favourite/:id", (request, response) => {
  var data = {
    id: request.params.id,
    is_favourite: request.body.is_favourite,
  };

  db.run(
    `UPDATE posts SET is_favourite = COALESCE(?,is_favourite) WHERE id = ?`,
    [data.is_favourite, data.id],
    function (error, result) {
      if (error) {
        response
          .status(400)
          .json({ message: "error", error: response.message });
        return;
      }
      response.json({
        message: "success",
        data: data,
        changes: this.changes,
      });
    }
  );
});

// default response for other requests
app.use(function (request, response) {
  response.status(404);
});

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Listening on port ${port}...`));
