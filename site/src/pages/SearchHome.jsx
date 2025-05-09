import React, {useEffect, useState} from "react";
import {Search} from "../api/search";
import {Movie} from "../api/movie";
import {testTrending} from "../fixtures";
import VerticalMovieCard from "../components/VerticalMovieCard";
import {Box, Typography} from "@mui/material";

function SearchHome(){
    const [trending, setTrending] = useState([]);
    const [backdropImg, setBackdropImg] = useState(0);

    useEffect(() => {
        getTrendingMovies();
    }, []);

    const getTrendingMovies = async () => {
        try{
            const fetchResponse = await Movie.getTrending();
            setTrending(fetchResponse);
            const randVal = Math.floor(Math.random() * fetchResponse.length)
            setBackdropImg(fetchResponse[randVal].backdropPath)
            console.log(fetchResponse[randVal].backdropPath)
            console.log(fetchResponse);

            // setTrending(testTrending);
            // const randVal = Math.floor(Math.random() * testTrending.length)
            // setBackdropImg(testTrending[randVal].backdropPath)
            // console.log(testTrending[randVal].backdropPath)
            // console.log(testTrending);
        } catch(e){
            console.log(e)
        }
    }

    return (
        <div>
            <Box sx={{
                height: 400,
                backgroundImage: backdropImg
                    ? `linear-gradient(to bottom, rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${backdropImg})`
                    : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                py: 8,
                px: 2,
                color: 'white',
            }}>
                <Box sx={{margin: '2rem'}}>
                    <Typography variant="h3">
                        Welcome.
                    </Typography>
                    <Typography variant="h4">
                        Explore using the search bar above to find your favorite movies and actors
                    </Typography>
                </Box>
            </Box>
            <Box sx={{margin: '3rem'}}>
                <Typography variant="h5">Trending Today</Typography>
                <Box
                    sx={{
                        overflowX: 'auto',
                        display: 'flex',
                        gap: 2,
                        py: 2,
                        px: 1,
                        scrollbarWidth: 'thin', // For Firefox
                        '&::-webkit-scrollbar': {
                            height: 8,
                        },
                        '&::-webkit-scrollbar-thumb': {
                            backgroundColor: '#888',
                            borderRadius: 4,
                        },
                    }}
                >
                    {trending.map((movie) =>
                        <VerticalMovieCard key={movie.movieId} movie={movie}/>)}
                </Box>
            </Box>
        </div>
    )
}

export default SearchHome;