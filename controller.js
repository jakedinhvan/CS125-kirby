const axios = require("axios");

// Search anime by name
async function searchName(req, res) {
    const query = req.body.query;
    if (!query) return res.status(400).json( {error: "Query required"});

    const graphqlQuery = `
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
        }`;

    try {
        const response = await axios.post(
            "https://graphql.anilist.co",
            { query: graphqlQuery, variables: { search: query } },
            { headers: { "Content-Type": "application/json" } }
        );

        res.json(response.data.data.Page.media);
    } catch (err) {
        res.status(500).json({ error: "External API failed", details: err.message });
    }
}

// Search anime by gemre
async function searchGenre(req, res) {
    const query = req.body.query;
    if (!query) return res.status(400).json( {error: "Query required"});

    console.log("Genre: ", query);

    const graphqlQuery = `
        query ($genre: String) {
            Page(page: 1, perPage: 5) {
              pageInfo {
                total
                perPage
                currentPage
                lastPage
                hasNextPage
              }
              media(genre_in: [$genre], type: ANIME) {
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
        }`;

    try {
        const response = await axios.post(
            "https://graphql.anilist.co",
            { query: graphqlQuery, variables: { search: query } },
            { headers: { "Content-Type": "application/json" } }
        );

        res.json(response.data.data.Page.media);
    } catch (err) {
        res.status(500).json({ error: "External API failed", details: err.message });
    }
}

// Export
module.exports = { searchName, searchGenre};