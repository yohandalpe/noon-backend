// Create express app
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const db = require("./database.js");

// Adding a generic JSON and URL-encoded parser as a top-level middleware, which will parse the bodies of all incoming requests.
// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
// Parse application/json
app.use(bodyParser.json());

// Root endpoint
app.get("/", (request, response) => {
  response.json({ message: "ok" });
});

// Get all posts from the database
app.get("/api/posts", (request, response) => {
  const sql = "SELECT * FROM posts";
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

// Update is_favourite
app.patch("/api/posts/favourite/:id", (request, response) => {
  const data = {
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
      });
    }
  );
});

// Default response for other requests
app.use(function (request, response) {
  response.status(404);
});

// Server port
const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Listening on port ${port}...`));
