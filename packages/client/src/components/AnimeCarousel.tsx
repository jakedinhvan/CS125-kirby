import type { Anime } from "@kirby/types";
import { Box } from "@mui/material";
import AnimeCard from "./AnimeCard";
import { useState } from "react";
import axios from "axios";

interface AnimeCarouselProps {
  animeList: Anime[];
}

const AnimeCarousel = ({ animeList }: AnimeCarouselProps) => {
  const [likedIds, setLikedIds] = useState<number[]>([]);

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
    <Box
      sx={{
        display: "flex",
        overflowX: "auto",
        gap: 2,
        pb: 1,
      }}
    >
      {animeList.map((anime) => (
        <Box key={anime.id} sx={{ 
          flex: "0 0 300px", 
          height: 320,
        }}>
          <AnimeCard
            anime={anime} 
            liked={likedIds.includes(anime.id)}
            onToggle={() => handleToggle(anime.id)}
          />
        </Box>
      ))}

    </Box>
  );
};

export default AnimeCarousel;