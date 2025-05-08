import React, {useEffect, useState} from "react";
import "../styles/movieBox.css";
import AddMovieButton from "../components/AddMovieButton";
import RemoveMovieButton from "./RemoveMovieButton";
import Card from "react-bootstrap/Card";
import {Collapse, Stack} from "react-bootstrap";
import MovieDetail from "./MovieDetail";
import CopyMovieButton from "../components/CopyMovieButton";
import MoveMovieButton from "../components/MoveMovieButton";
import SeeMovieListsButton from "../components/SeeMovieListsButton";
import FreeTicketButton from "../components/FreeTicketButton";
import { Movie } from "../api/movie";
import {useBannerContext} from "../contexts/BannerContext";

const MovieBox = ({title, posterPath, movieId, releaseDate, watchlist, haveAddMovieButton, haveRemoveMovieButton, haveSeeMovieListsButton,
                      haveCopyMovieButton, haveMoveMovieButton, haveFreeTicketButton, listId, handleUpdateWatchlist}) =>{
    const [open, setOpen] = useState(false);
    const [fetchResponse, handleFetchResponse] = useState();
    const [backgroundImage, setBackgroundImage] = useState("");
    const { bannerData, setBannerData } = useBannerContext();

    useEffect(() => {
        // NB: we have to declare an async function within useEffect
        const fetchMovieById = async () => {
            try {
                const movie = await Movie.getById(movieId);
                if (!movie) {
                    throw Error("Unable to get details for movie");
                }
                if (movie.backdropPath) {
                    setBackgroundImage("linear-gradient(.25turn, #14190f, 60%, rgba(20,25,15,0.5)), url(" + movie.backdropPath + ")");
                }
                handleFetchResponse(movie);
            } catch (e) {
                setBannerData({message: "No details for this movie", variant: "error"});
                console.error(e);
            }
        }
        fetchMovieById();
    }, [movieId]);


    return (
        <div className="MovieBox" id={"movieBox-" + title}>
            <Card className="MovieBoxCard" style={{margin: "1.5%", boxShadow: "0.1em 0.1em 1em #c8c8c8"}}>
                <Card.Body style={{padding: "0", display:"flex"}}>
                    <Card.Img className="MoviePoster" id="posterImg" src={posterPath}/>
                    <Card.Text style={{padding: "1.5%", margin: "2%"}}>
                        <div onClick={() => setOpen(!open)}
                             aria-controls="example-collapse-text"
                             aria-label="movieDetailLink"
                             className="MovieDetailLink"
                             id={"movieDetailLink-" + title}
                             aria-expanded={open}>{title}</div>
                        <br/>
                        <div id="movieBoxReleaseDate" style={{color: "#828281"}}>{releaseDate}</div>
                    </Card.Text>
                    <Card.Text className="MovieBoxButtonContainer" style={{alignSelf: "center", marginLeft: "auto", color: "black"}}>
                        <Stack className="MovieButtonContainer" style={{textAlign: "center"}}>
                            {haveAddMovieButton ?
                                <div>
                                    <AddMovieButton movieId={movieId} watchlist={watchlist} handleUpdateWatchlist={handleUpdateWatchlist} title={title}/>
                                </div>  : null}
                            {haveRemoveMovieButton ?
                                <div>
                                    <RemoveMovieButton movieId={movieId} listId={listId} handleUpdateWatchlist={handleUpdateWatchlist} title={title}/>
                                </div> : null}
                            {haveCopyMovieButton ?
                                <div>
                                    <CopyMovieButton listId={listId} movieId={movieId} watchlist={watchlist} title={title} handleUpdateWatchlist={handleUpdateWatchlist}/>
                                </div> : null}
                            {haveMoveMovieButton ?
                                <div>
                                    <MoveMovieButton listId={listId} movieId={movieId} watchlist={watchlist} handleUpdateWatchlist={handleUpdateWatchlist} title={title}/>
                                </div> : null}
                            {haveSeeMovieListsButton ?
                                <div>
                                    <SeeMovieListsButton movieId={movieId} watchlist={watchlist} title={title}/>
                                </div> : null}
                            {haveFreeTicketButton ?
                                <div>
                                    <FreeTicketButton movieName={title}/>
                                </div> : null}
                        </Stack>
                    </Card.Text>
                </Card.Body>
                <Collapse in={open}>
                    <Card.Body id="movieDetailCollapse">
                        {open ? <MovieDetail fetchResponse={fetchResponse} backgroundImage={backgroundImage}/> : null}
                    </Card.Body>
                </Collapse>
            </Card>
        </div>
    );
}

export default MovieBox;
