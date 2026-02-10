const express = require("express");
const axios = require("axios");
const path = require("path");

const app = express();

// Serve static files
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// API endpoint
app.get("/api/data", async (req, res) => {
  const query = req.query.query;

  if (!query) {
    return res.status(400).json({ error: "Query required" });
  }

  try {
    // Example external API
    const response = await axios.post(
      "https://graphql.anilist.co",
      {
        query: `
          query ($search: String) {
            Page(page: 1, perPage: 5) {
              pageInfo {
                total
                perPage
                currentPage
                lastPage
                hasNextPage
              }
              media(search: $search, type: ANIME) {
                id
                title {
                  romaji
                  english
                  native
                }
                genres
                description
              }
            }
          }`,
          variables: {
            search: query
          }
      },
      {headers: {"Content-Type": "application/json"}}
    );

    res.json({
      input: query,
      result: response.data.data.Page.media
    });
  } catch (err) {
    res.status(500).json({ error: "External API failed" });
  }
});

app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});