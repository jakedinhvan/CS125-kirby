import type { Anime } from "@kirby/types";
import { Box, Typography } from "@mui/material";
import { useLoaderData } from "react-router-dom";

export default function AnimePage(){
  const anime = useLoaderData() as Anime;

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
          {anime.title.english} ({anime.id})
        </Typography>
      </Box>
    </Box>
  );
}