import type { Anime, Genre } from "@kirby/types";
import { Box, Typography, Paper, Autocomplete, TextField, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import LikedAnimeCard from "../components/LikedAnimeCard";

export default function Profile() {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [likedGenres, setLikedGenres] = useState<Genre[]>([]);
  const [likedAnime, setLikedAnime] = useState<Anime[]>([]);
  const [personalizationDialogOpen, setPersonalizationDialogOpen] = useState(false);


  useEffect(() => {
    axios.get("/api/genres/").then((res) => {
      setGenres(res.data);
    })
  }, []);

  useEffect(() => {
    fetch("/api/genres/liked")
      .then(res => res.json())
      .then((liked: Genre[]) => {
        setLikedGenres(liked);
      });
}, []);

  useEffect(() => {
    axios.get("/api/likes/anime").then((res) => {
      setLikedAnime(res.data);
    }).catch((err) => {
      console.error("failed to fetch liked anime", err);
    });
  }, []);

  const handleChange = async (
    _: React.SyntheticEvent,
    newValue: Genre[],
  ) => {
    const added = newValue.filter(
      g => !likedGenres.some(l => l.id === g.id)
    );

    const removed = likedGenres.filter(
      g => !newValue.some(n => n.id === g.id)
    );

    for (const genre of added) {
      await fetch(`/api/genres/like`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ genreId: genre.id }),
      });
    }

    for (const genre of removed) {
      await fetch(`/api/genres/like`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ genreId: genre.id }),
      });
    }

    setLikedGenres(newValue);
  };

  const handleDialogOpen = () => {
    setPersonalizationDialogOpen(true);
  }

  const handleResetUserData = async () => {
    try {
      await axios.post("/api/anime/clearUserData");

      setLikedAnime([]);
      setLikedGenres([]);
      setPersonalizationDialogOpen(false);
    } catch (err) {
      console.error("failed to reset personalization data", err);
    }
  }
  
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
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
              {likedAnime.map((anime) => (
                <LikedAnimeCard 
                  key={anime.id} 
                  anime={anime} 
                  onRemove={(id) => setLikedAnime((prev) => prev.filter((a) => a.id !== id))} 
                />
              ))}
            </Box>
        </Paper>

        <Paper
          elevation={1}
          sx={{
            p: 3,
            borderRadius: 3,
          }}
        >
          <Typography variant="h6">Data & Privacy</Typography>

          <Button sx={{ mt: 2 }} variant="contained" color="error" onClick={handleDialogOpen}>
            Reset personalization data
          </Button>

        </Paper>
      </Box>

      <Dialog open={personalizationDialogOpen}>
        <DialogTitle>Are you sure you want to reset your personalization data?</DialogTitle>
        <DialogContent>
          <DialogContentText>This will clear your liked anime, liked genres, and viewed anime.</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="text" color="inherit" onClick={() => setPersonalizationDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" color="error" onClick={handleResetUserData}>I am sure</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}