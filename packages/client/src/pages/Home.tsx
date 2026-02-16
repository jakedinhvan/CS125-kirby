import { Box, CircularProgress, TextField } from "@mui/material";
import { useState } from "react";
import axios from "axios";
import type { Anime } from '@kirby/types';
import AnimeCard from "../component/AnimeCard";

export default function Home() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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

  return (
    <Box sx={{
      minHeight: "100vh",
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 2,
    }}>
      <h1>Welcome to Kirby - an anime suggestion engine</h1> {/* @todo: maybe placeholder lol */}
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
          onChange={(e) => setQuery(e.target.value)}
          fullWidth 
        />
      </Box>

      {loading && (
        <Box sx={{ mt: 3 }}>
          <CircularProgress />
        </Box>
      )}

      {results && results.map((anime) => ( // @todo: refactor results into cards
        <AnimeCard anime={anime} />
      ))}
      
    </Box>
  );
}
