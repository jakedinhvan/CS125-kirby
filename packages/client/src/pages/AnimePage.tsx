import type { Anime } from "@kirby/types";
import { Box, Typography, Chip, Stack, Paper } from "@mui/material";
import { useEffect, useState } from "react";
import { useLoaderData } from "react-router-dom";
import AnimeCarousel from "../components/AnimeCarousel";
import axios from "axios";

export default function AnimePage(){
  const anime = useLoaderData() as Anime;
  const [similarAnime, setSimilarAnime] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(false);
  const [likedIds, setLikedIds] = useState<number[]>([]);

  useEffect(() => {
    const fetchSimilarAnime = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/api/anime/similar/anime/${anime.id}`);
        setSimilarAnime(res.data);
      } catch (err) {
        console.error("failed to fetch similar anime", err);
        setSimilarAnime([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSimilarAnime();
  }, [anime.id]);

  useEffect(() => {
    axios.get("/api/likes/").then((res) => {
      setLikedIds(res.data);
    });
  }, []);

  useEffect(() => {
    const markVisited = async () => {
      try {
        await axios.post(`/api/visits/anime/${anime.id}`);
      } catch (err) {
        console.error("failed to track visit", err);
      }
    };

    markVisited();
}, [anime.id]);
  
  return (
    <Box
      sx={{
        minHeight: "100vh",
        pt: 12, 
        pb: 6,
      }}
    >
      <Box
        sx={{
          maxWidth: 900,
          mx: "auto",
          px: 3,
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            borderRadius: 3,
            display: "flex",
            flexDirection: "column",
            gap: 3,
          }}
        >

        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
          <Typography variant="h4" fontWeight="bold">
            {anime.title}
          </Typography>

          <Typography variant="subtitle1" color="text.secondary">
            {anime.seasonYear}
          </Typography>
        </Box>

        <Stack direction="row" spacing={1} flexWrap="wrap">
          {anime.genres.map((g) => (
            <Chip key={g} label={g} />
          ))}
        </Stack>

        <Typography
          sx={{
            lineHeight: 1.7,
            "& i": { fontStyle: "italic" },
          }}
          dangerouslySetInnerHTML={{ __html: anime.description ?? "" }}
        />

        </Paper>
      </Box>

      <Box key={anime.id} sx={{ maxWidth: 1600, mx: "auto", px: 3, mt: 6 }}>
        <Typography variant="h4" fontWeight="bold">
          Similar anime...
        </Typography>

        {loading ? (
          <Typography>Loading...</Typography>
        ) : (
          <AnimeCarousel likedIds={likedIds} animeList={similarAnime} />
        )}
      </Box>
    </Box>
  );
}