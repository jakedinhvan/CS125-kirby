import { type Genre, type Anime } from "@kirby/types";
import { Box, Typography } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import AnimeCarousel from "../components/AnimeCarousel";

export default function Browse() {
  const [likedGenres, setLikedGenres] = useState<Genre[]>([]);
  const [genreRecommendations, setGenreRecommendations] = useState<Record<number, Anime[]>>({});
  const [likedIds, setLikedIds] = useState<number[]>([]);
  const [randomRecommendation, setRandomRecommendation] = useState<{
    randomAnime: Anime | null;
    recommendations: Anime[];
  }>({ randomAnime: null, recommendations: [] });

  useEffect(() => {
    axios.get("/api/anime/recommend/random-liked")
      .then((res) => {
        setRandomRecommendation(res.data);
      })
      .catch((err) => {
        console.error("failed to fetch random recs", err);
      });
  }, []);

  useEffect(() => {
    axios.get("/api/likes/").then((res) => {
      setLikedIds(res.data);
    });
  }, []);

  useEffect(() => {
    axios.get("/api/genres/liked").then((res) => {
      setLikedGenres(res.data);
    }).catch((err) => {
      console.error("failed to fetch liked genres", err);
    });
  }, []);

  useEffect(() => {
  if (!likedGenres.length) return;

  const fetchAll = async () => {
    const results: Record<number, Anime[]> = {};

    await Promise.all(
      likedGenres.map(async (genre) => {
        try {
          const res = await axios.get(`/api/anime/similar/genre/${genre.id}`);

          results[genre.id] = res.data;
        } catch (err) {
          console.error("failed to fetch similar anime for genre", genre.name, err);
          results[genre.id] = [];
        }
      })
    );

    setGenreRecommendations(results);
  };

  fetchAll();
}, [likedGenres]);


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

        {!randomRecommendation && likedGenres.length === 0 && <Typography variant="h5">No suggestions found. Try liking some genres or anime! </Typography>}
        {randomRecommendation?.randomAnime && (
        <Box>
          <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
            Because you liked {randomRecommendation.randomAnime.title}...
          </Typography>

          <AnimeCarousel
            animeList={randomRecommendation.recommendations}
            likedIds={likedIds}
          />
        </Box>
      )}
        {likedGenres.map((genre) => {
          const list = genreRecommendations[genre.id];

          if (!list) return null;

          return (
            <Box key={genre.id}>
              <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
                Because you like {genre.name}...
              </Typography>

              <AnimeCarousel animeList={list} likedIds={likedIds} />
            </Box>
          );
        })}
      </Box>
    </Box>
  )
}
