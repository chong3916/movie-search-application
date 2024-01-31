import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { List } from '../api/list';
import { Movie } from '../api/movie';
import MontageImages from '../components/MontageImages';


const Montage = ()  => {
    const [movies, setMovies] = useState([]);
    const [watchlistName, setWatchlistName] = useState("");
    const { listId } = useParams();
    
    const movieImages = movies.flatMap(movie => [movie.backdropPath, movie.posterPath]);

    useEffect(() => {
        const fetchWatchlistMovies = async () => {
            const userId = sessionStorage.getItem("user");
            const watchlist = await List.getListById(Number.parseInt(listId), userId);
            setWatchlistName(watchlist.listName);
            setMovies(watchlist.movieIds ? await Movie.getManyById(watchlist.movieIds) : []);
        }
        fetchWatchlistMovies();
    }, [listId]);

    return (
        <div style={montagePageStyle}>
            <div style={watchlistTitleStyle}>
                {watchlistName}
            </div>
            {movieImages.length < 10 &&  
                <div id="watchlist-montage-error" style={watchlistErrorStyle}>
                    Error: cannot load ten or more images for montage.
                </div>    
            }
            <MontageImages imageUrls={movieImages}/>
        </div>
    )
}

const montagePageStyle = {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
}

const watchlistTitleStyle = {
    width: '80%',
    fontWeight: 'bold',
    fontSize: '32px',
    marginBottom: '50px'
}

const watchlistErrorStyle = {
    width: '80%',
    fontWeight: 'bold',
    marginBottom: '75px',
    fontSize: '16px', 
}


export default Montage;