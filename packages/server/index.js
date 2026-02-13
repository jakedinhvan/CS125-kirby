const express = require("express");

const path = require("path");
const { searchName, searchGenre } = require("./controller.js");
const app = express();

app.use(express.json()); // for POST request bodies
// Serve static files
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// POST with different features
app.post("/api/kirby/searchname", searchName);
app.post("/api/kirby/searchgenre", searchGenre);

app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});