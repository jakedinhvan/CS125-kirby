import type { Genre } from "@kirby/types";
import { Box, Typography, Paper, Autocomplete, TextField } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";

export default function Profile() {
  const [genres, setGenres] = useState<Genre[]>([]);

  useEffect(() => {
    axios.get("/api/kirby/genres").then((res) => {
      setGenres(res.data);
    })
  }, []);
  
  return (
    <Box
      sx={{
        minHeight: "100vh",
        pt: 10, 
        pb: 6,
      }}
    >
      <Box
        sx={{
          maxWidth: 900,
          mx: "auto",
          px: 3,
          display: "flex",
          flexDirection: "column",
          gap: 3,
        }}
      >
        <Typography variant="h4" fontWeight="bold">
          Profile
        </Typography>

        <Paper
          elevation={1}
          sx={{
            p: 3,
            borderRadius: 3,
          }}
        >
          <Typography variant="h6">Genres</Typography>
          <Autocomplete
            multiple
            options={genres}
            getOptionLabel={(genre) => genre.name}
            renderInput={(params) => (
              <TextField
                variant="outlined"
                placeholder="Start typing to add genres..."
                {...params}
              />
            )}
          >

          </Autocomplete>
        </Paper>

        <Paper
          elevation={1}
          sx={{
            p: 3,
            borderRadius: 3,
          }}
        >
          <Typography variant="h6">Liked Anime</Typography>
          <Typography color="text.secondary">
            Blah blah blah liked anime here...
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
}