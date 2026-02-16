import { Box, Typography } from "@mui/material";

export default function Browse() {
  return (
    <Box sx={{
      minHeight: "100vh",
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 2,
    }}>
      <Typography variant="h4" sx={{}}>Suggested for you</Typography>
    </Box>
  )
}
