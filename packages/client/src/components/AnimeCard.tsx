import { Card, CardActions, CardContent, Chip, Stack, Typography } from "@mui/material";
import type { Anime } from "@kirby/types";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';

const AnimeCard = ({ anime }: { anime: Anime }) => {
  return (
    <Card variant="outlined" sx={{ width: 480 }}>
      <CardContent>
        <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14 }}>
          {anime.seasonYear}
        </Typography>
        <Typography variant="h5" component="div" gutterBottom>
          {anime.title.romaji || anime.title.english || "Untitled?"}
        </Typography>

        <Typography variant="body2"
          sx={{
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
            mb: 1,
          }}
          dangerouslySetInnerHTML={{ __html: anime.description ?? "" }}
        />

        <Stack direction="row" spacing={1} flexWrap="wrap">
          {anime.genres?.map((genre) => (
            <Chip key={genre} label={genre} variant="outlined" color="primary" />
          ))}
        </Stack>
        
      </CardContent>
      <CardActions>
        <Button >

        </Button>
      </CardActions>
    </Card>
  );
};

export default AnimeCard;