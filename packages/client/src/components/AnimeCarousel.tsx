import type { Anime } from "@kirby/types";
import { Box } from "@mui/material";
import AnimeCard from "./AnimeCard";
import { useEffect, useState } from "react";
import axios from "axios";

interface AnimeCarouselProps {
  animeList: Anime[];
  likedIds: number[];
}

const AnimeCarousel = ({ animeList, likedIds }: AnimeCarouselProps) => {
  const [localLikedIds, setLocalLikedIds] = useState<number[]>([]);

  useEffect(() => {
    setLocalLikedIds(likedIds);
  }, [likedIds]);

  const handleToggle = async (id: number) => {
    const prev = likedIds;

    if (prev.includes(id)) {
      setLocalLikedIds(prev.filter((x) => x !== id));
    } else {
      setLocalLikedIds([...prev, id]);
    }

    try {
      await axios.post(`/api/likes/anime/${id}`);
    } catch {
      setLocalLikedIds(prev);
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
            liked={localLikedIds.includes(anime.id)}
            onToggle={() => handleToggle(anime.id)}
          />
        </Box>
      ))}

    </Box>
  );
};

export default AnimeCarousel;