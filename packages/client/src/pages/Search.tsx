import { Box, Checkbox, CircularProgress, FormControlLabel, TextField } from "@mui/material";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import type { Anime } from '@kirby/types';
import AnimeCard from "../components/AnimeCard";

export default function Search() {
  const location = useLocation();
  const navigate = useNavigate();

  const params = new URLSearchParams(location.search);
  const queryParam = params.get('q') || '';

  const [query, setQuery] = useState(queryParam);
  const [results, setResults] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(false);
  const [likedIds, setLikedIds] = useState<number[]>([]);
  const [personalizedResults, setPersonalizedResults] = useState(true);

  useEffect(() => {
    axios.get("/api/likes/").then((res) => {
      setLikedIds(res.data);
    });
  }, []);

  const runSearch = async (searchQuery: string) => {
    if (!searchQuery) return;

    setLoading(true);
    setResults([]);

    try {
      const endpoint = personalizedResults
        ? "/api/anime/search/name/personalized"
        : "/api/anime/search/name";

      const res = await axios.post(endpoint, { query: searchQuery });
      setResults(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    if (!query) return;

    navigate(`/search?q=${encodeURIComponent(query)}`, { replace: true });
    await runSearch(query);
  };

  const handleToggle = async (id: number) => {
    const prev = likedIds;

    if (prev.includes(id)) {
      setLikedIds(prev.filter((x) => x !== id));
    } else {
      setLikedIds([...prev, id]);
    }

    try {
      await axios.post(`/api/likes/anime/${id}`);
    } catch {
      setLikedIds(prev);
    }
  };

  useEffect(() => {
    setQuery(queryParam);

    if (queryParam) {
      runSearch(queryParam);
    }
  }, [queryParam, personalizedResults]);

  return (
    <Box sx={{
      minHeight: "100vh",
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 2,
      mt: 10,
    }}>

      <Box
        component="form"
        onSubmit={handleSearch}
        sx={{
          display: 'flex',
          gap: 2,
          width: '100%',
          maxWidth: 400,
        }}
      >
        <TextField
          label="Search anime by name"
          variant="outlined"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          fullWidth
        />
      </Box>
      

      <Box sx={{ marginTop: -2, width: '100%', maxWidth: 400 }}>
        <FormControlLabel
          control={
            <Checkbox
              checked={personalizedResults} 
              onChange={(e) => setPersonalizedResults(e.target.checked)}
            />}
          label="Personalize Recommendations"
        />
      </Box>


      {loading && <CircularProgress />}
      

      <Box
        sx={{
          width: "100%",
          maxWidth: 1200,
          mx: "auto",
          px: 2,
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 3,
          mt: 2,
          mb: 4,
        }}
      >
        {results.map((anime) => (
          <AnimeCard
            key={anime.id}
            anime={anime}
            liked={likedIds.includes(anime.id)}
            onToggle={() => handleToggle(anime.id)}
          />
        ))}
      </Box>



    </Box>
  );
}
