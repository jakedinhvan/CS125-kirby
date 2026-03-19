import { Card, CardActions, CardContent, Chip, IconButton, Link, Stack, Typography } from "@mui/material";
import type { Anime } from "@kirby/types";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';

const AnimeCard = ({ 
  anime, 
  liked, 
  onToggle,
}: { 
  anime: Anime;
  liked: boolean;
  onToggle: () => void;
}) => {
  return (
    <Card variant="outlined" sx={{ width: 480, height: "100%", display: "flex", flexDirection: "column", position: "relative" }}>
      <CardContent>
        <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14 }}>
          {anime.seasonYear}
        </Typography>
        <Typography variant="h5" component="div" gutterBottom>
          <Link href={`/anime/${anime.id}`}>{anime.title}</Link>
        </Typography>

        <Typography variant="body2"
          sx={{
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
            mb: 1,
            minHeight: "4.5em",
          }}
          dangerouslySetInnerHTML={{ __html: anime.description ?? "" }}
        />

        <Stack direction="row" spacing={1} flexWrap="wrap">
          {anime.genres?.map((genre) => (
            <Chip key={genre} label={genre} variant="outlined" color="primary" />
          ))}
        </Stack>
        
      </CardContent>
          <IconButton
      onClick={onToggle}
      sx={{
        position: "absolute",
        top: 8,
        right: 8,
        zIndex: 2,
        backgroundColor: "background.paper",
        "&:hover": {
          backgroundColor: "background.default",
        },
      }}
    >
      {liked ? (
        <FavoriteIcon color="error" />
      ) : (
        <FavoriteBorderIcon />
      )}
    </IconButton>
    </Card>
  );
};

export default AnimeCard;