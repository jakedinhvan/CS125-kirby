import { Box, CircularProgress, TextField } from "@mui/material";
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

  useEffect(() => {
    axios.get("/api/liked").then((res) => {
      setLikedIds(res.data);
    });
  }, []);

  const handleSearch = async (e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    if (!query) return;

    navigate(`/search?q=${encodeURIComponent(query)}`, { replace: true });


    setLoading(true);
    setResults([]);

    try {
      const res = await axios.post('/api/kirby/searchname', { query });
      setResults(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (id: number) => {
    const prev = likedIds;

    if (prev.includes(id)) {
      setLikedIds(prev.filter((x) => x !== id));
    } else {
      setLikedIds([...prev, id]);
    }

    try {
      await axios.post(`/api/kirby/${id}/like`);
    } catch {
      setLikedIds(prev);
    }
  };


  useEffect(() => {
    if (queryParam) {
      setQuery(queryParam);
      handleSearch();
    }
  }, [queryParam]);

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

      {loading && <CircularProgress />}

      {results.map((anime) => (
        <AnimeCard key={anime.id} anime={anime} liked={likedIds.includes(anime.id)} onToggle={() => handleToggle(anime.id)} />
      ))}
    </Box>
  );
}
