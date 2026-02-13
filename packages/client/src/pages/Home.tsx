import { Box, TextField } from "@mui/material";
import { useState } from "react";

export default function Home() {
  const [query, setQuery] = useState('');

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Search:", query);
  };

  return (
    <>
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
          label="Search anime" 
          variant="outlined" 
          onChange={(e) => setQuery(e.target.value)}
          fullWidth 
        />
      </Box>
      
    </>
  );
}
