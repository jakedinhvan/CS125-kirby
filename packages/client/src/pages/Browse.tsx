import type { Anime } from "@kirby/types";
import { Box, Typography } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import LikedAnimeCard from "../components/LikedAnimeCard";
import AnimeCard from "../components/AnimeCard";

export default function Browse() {
  const [likedAnime, setLikedAnime] = useState<Anime[]>([]);
  const [likedIds, setLikedIds] = useState<number[]>([]);

  useEffect(() => {
    axios.get("/api/likes/anime").then((res) => {
      setLikedAnime(res.data);
    }).catch((err) => {
      console.error("failed to fetch liked anime", err);
    });
  }, []);

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

  return (
    <Box sx={{
      minHeight: "100vh",
      pt: 10, 
      pb: 6,
    }}>
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
        <Typography variant="h4" fontWeight="bold" sx={{}}>Suggested for you</Typography>

        <Box
          sx={{
            display: "flex",
            overflowX: "auto",
            gap: 2,
            pb: 1,
          }}
        >
          {likedAnime.map((anime) => (
            <Box key={anime.id} sx={{ minWidth: 260 }}>
              <AnimeCard 
                key={anime.id} 
                anime={anime} 
                liked={likedIds.includes(anime.id)}
                onToggle={() => handleToggle(anime.id)}
              />
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  )
}
