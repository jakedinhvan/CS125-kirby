import type { Anime } from "@kirby/types";
import { Box, Typography, Chip, Stack, Paper } from "@mui/material";
import { useLoaderData } from "react-router-dom";

export default function AnimePage(){
  const anime = useLoaderData() as Anime;

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
    </Box>
  );
}