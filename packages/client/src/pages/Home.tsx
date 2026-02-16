import { Box, TextField } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!query) return;
    navigate(`/search?q=${encodeURIComponent(query)}`);
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
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          fullWidth 
        />
      </Box>
    </Box>
  );
}
