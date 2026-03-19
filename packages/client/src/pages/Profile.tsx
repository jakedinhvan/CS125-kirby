import type { Anime, Genre } from "@kirby/types";
import { Box, Chip, IconButton, Stack, Link, Typography, Paper, Autocomplete, TextField, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import AnimeCard from "../components/AnimeCard";
import FavoriteIcon from "@mui/icons-material/Favorite";

export default function Profile() {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [likedGenres, setLikedGenres] = useState<Genre[]>([]);
  const [likedAnime, setLikedAnime] = useState<Anime[]>([]);


  useEffect(() => {
    axios.get("/api/genres/").then((res) => {
      setGenres(res.data);
    })
  }, []);

  useEffect(() => {
    fetch("/api/genres/liked")
      .then(res => res.json())
      .then((likedIds: number[]) => {
        const likedObjects = genres.filter(g =>
          likedIds.includes(g.id)
        );
        setLikedGenres(likedObjects);
      });
}, [genres]);

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
      await fetch(`/api/genre/like`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ genreId: genre.id }),
      });
    }

    for (const genre of removed) {
      await fetch(`/api/genre/like`, {
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
          <Table size="small">
            <TableHead>
              <TableRow>
              </TableRow>
            </TableHead>
            <TableBody>
              
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
                {likedAnime.map((anime) => {
                  const genres = anime.genres?.slice(0,3) ?? [];

                  return (
                    <Box
                      key={anime.id}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        p: 2,
                        border: "1px solid #eee",
                        borderRadius: 2,
                      }}
                    >
                      <Box>
                        <Link
                          href={`/anime/${anime.id}`}
                          underline="hover"
                          sx={{ fontSize: "1.1rem", fontWeight: 500 }}
                        >
                          {anime.name}
                        </Link>

                        <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                          {genres.map((genre) => (
                            <Chip key={genre} label={genre} size="small" />
                          ))}
                        </Stack>
                      </Box>

                      <IconButton
                        onClick={async () => {
                          try {
                            await axios.post(`/api/kirby/${anime.id}/like`);
                            setLikedAnime((prev) =>
                              prev.filter((a) => a.id !== anime.id)
                            );
                          } catch (err) {
                            console.error("failed to unlike anime", err);
                          }
                        }}
                      >
                        <FavoriteIcon color="error" />
                      </IconButton>
                    </Box>
                  );
                })}
              </Box>

            </TableBody>
          </Table>
        </Paper>
      </Box>
    </Box>
  );
}