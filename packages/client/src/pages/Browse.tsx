import { type Genre, type Anime } from "@kirby/types";
import { Box, Typography } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import AnimeCarousel from "../components/AnimeCarousel";

export default function Browse() {
  const [likedAnime, setLikedAnime] = useState<Anime[]>([]);
  const [likedGenres, setLikedGenres] = useState<Genre[]>([]);

  useEffect(() => {
    axios.get("/api/likes/anime").then((res) => {
      setLikedAnime(res.data);
    }).catch((err) => {
      console.error("failed to fetch liked anime", err);
    });
  }, []);

  useEffect(() => {
    axios.get("/api/genres/liked").then((res) => {
      setLikedGenres(res.data);
    }).catch((err) => {
      console.error("failed to fetch liked genres", err);
    });
  }, []);


  return (
    <Box sx={{
      minHeight: "100vh",
      pt: 10, 
      pb: 6,
    }}>
      <Box
        sx={{
          maxWidth: 1200,
          mx: "auto",
          px: 3,
          display: "flex",
          flexDirection: "column",
          gap: 3,
        }}
      >
        <Typography variant="h4" fontWeight="bold">Suggested for you</Typography>

        <AnimeCarousel animeList={likedAnime} />

        {likedGenres.map((genre) => (
          <Typography variant="h4" fontWeight="bold">Because you like {genre.name}...</Typography>
        ))}
      </Box>
    </Box>
  )
}
