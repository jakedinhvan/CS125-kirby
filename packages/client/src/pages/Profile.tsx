import type { Genre } from "@kirby/types";
import { Box, Typography, Paper, Autocomplete, TextField } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";

export default function Profile() {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [likedGenres, setLikedGenres] = useState<Genre[]>([]);


  useEffect(() => {
    axios.get("/api/kirby/genres").then((res) => {
      setGenres(res.data);
    })
  }, []);

  useEffect(() => {
    fetch("/api/kirby/liked-genres")
      .then(res => res.json())
      .then((likedIds: number[]) => {
        const likedObjects = genres.filter(g =>
          likedIds.includes(g.id)
        );
        setLikedGenres(likedObjects);
      });
}, [genres]);

  const handleChange = async (
    event: any,
    newValue: Genre[],
  ) => {
    const added = newValue.filter(
      g => !likedGenres.some(l => l.id === g.id)
    );

    const removed = likedGenres.filter(
      g => !newValue.some(n => n.id === g.id)
    );

    for (const genre of added) {
      await fetch(`/api/kirby/like-genre`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ genreId: genre.id }),
      });
    }

    for (const genre of removed) {
      await fetch(`/api/kirby/like-genre`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ genreId: genre.id }),
      });
    }

    setLikedGenres(newValue);
  };
  
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
            value={likedGenres}
            getOptionLabel={(genre) => genre.name}
            onChange={handleChange}
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