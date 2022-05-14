const express = require("express");
const app = express();
var db = require("./database.js");

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
    isFavourite: req.body.isFavourite,
  };

  db.run(
    `UPDATE posts SET is_favourite = COALESCE(?,isFavourite) WHERE id = ?`,
    [data.isFavourite],
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
