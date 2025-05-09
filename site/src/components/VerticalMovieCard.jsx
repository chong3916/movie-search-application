import {Card, CardActions, CardContent, CardMedia, Typography} from "@mui/material";
import Button from "@mui/material/Button";

const VerticalMovieCard = ({ movie }) => {
    return (
        <Card
            sx={{
                width: { xs: 120, sm: 150, md: 180, lg: 200 }, // Responsive width
                flexShrink: 0, // Prevent shrinking in flex container
            }}
        >
            <CardMedia
                component="img"
                image={movie.posterPath}
                alt={movie.title}
                sx={{
                    height: { xs: 180, sm: 220, md: 270, lg: 300 }, // Responsive height
                    objectFit: 'cover',
                }}
            />
            <CardContent>
                <Typography variant="subtitle1" noWrap>
                    {movie.title}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {movie.releaseDate}
                </Typography>
            </CardContent>
        </Card>
    )
}

export default VerticalMovieCard;
