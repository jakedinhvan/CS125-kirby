import { Box, Card, CardActions, CardContent, Chip, IconButton, Link, Stack } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import type { Anime } from "@kirby/types";
import axios from "axios";

interface LikedAnimeCardProps {
  anime: Anime;
  onRemove: (id: number) => void;
};

export default function LikedAnimeCard({ anime, onRemove }: LikedAnimeCardProps) {
  const genres = anime.genres?.slice(0, 3) ?? [];

  const handleUnlike = async () => {
    try {
      await axios.post(`/api/likes/anime/${anime.id}`);
      onRemove(anime.id);
    } catch (err) {
      console.error("failed to unlike anime", err);
    }
  };

  return (
    <Card variant="outlined">
      <CardContent sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <Box>
          <Link
            href={`/anime/${anime.id}`}
            underline="hover"
            sx={{ fontSize: "1.1rem", fontWeight: 500 }}
          >
            {anime.name}
          </Link>

          <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
            {genres.map((genre) => (
              <Chip key={genre} label={genre} size="small" />
            ))}
          </Stack>
        </Box>

        <IconButton onClick={handleUnlike}>
          <FavoriteIcon color="error" />
        </IconButton>
      </CardContent>  
    </Card>
  );
}