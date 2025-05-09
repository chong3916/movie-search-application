import {Box, Card, CardActions, CardContent, CardMedia, CircularProgress, Typography} from "@mui/material";
import Button from "@mui/material/Button";
import PropTypes from "prop-types";

function CircularProgressWithLabel(props) {
    return (
        <Box sx={{ position: 'relative', display: 'inline-flex' }}>
            <CircularProgress variant="determinate" {...props} />
            <Box
                sx={{
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: 'absolute',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Typography
                    variant="caption"
                    component="div"
                    sx={{ color: 'text.secondary' }}
                >
                    {`${Math.round(props.value)}%`}
                </Typography>
            </Box>
        </Box>
    );
}

CircularProgressWithLabel.propTypes = {
    /**
     * The value of the progress indicator for the determinate variant.
     * Value between 0 and 100.
     * @default 0
     */
    value: PropTypes.number.isRequired,
};

const VerticalMovieCard = ({ movie }) => {
    return (
        <Card sx={{ width: { xs: 140, sm: 150, md: 160 }, flex: '0 0 auto' }}>
            <Box sx={{ position: 'relative' }}>
                <CardMedia
                    component="img"
                    sx={{ width: '100%', height: 'auto' }}
                    image={movie.posterPath}
                    title={movie.title}
                />
                <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
                    <CircularProgressWithLabel value={movie.voteAverage} />
                </Box>
            </Box>
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
