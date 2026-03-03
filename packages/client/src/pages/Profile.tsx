import { Box, Typography, Paper } from "@mui/material";

export default function Profile() {
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
          <Typography variant="h6">Liked Genres</Typography>
          <Typography color="text.secondary">
            Blah blah blah liked genres here...
          </Typography>
        </Paper>

        <Paper
          elevation={1}
          sx={{
            p: 3,
            borderRadius: 3,
          }}
        >
          <Typography variant="h6">Liked Anime</Typography>
          <Typography color="text.secondary">
            Blah blah blah liked anime here...
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
}