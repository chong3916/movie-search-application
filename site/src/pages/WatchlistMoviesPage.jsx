import React, {useEffect, useState } from "react";
import MovieBox from "../components/MovieBox";
import { useNavigate, useParams} from "react-router-dom";
import Button from "react-bootstrap/Button";
import {Col, Container, DropdownButton, Row} from "react-bootstrap";
import "../styles/watchlistMoviesPage.css";
import DropdownItem from "react-bootstrap/DropdownItem";
import { List } from "../api/list";
import {Movie} from "../api/movie";

const WatchlistMoviesPage = ({ setBanner }) => {
    const userId = sessionStorage.getItem("user");
    const navigate = useNavigate();
    const { listId } = useParams();
    const [userLists, setUserLists] = useState([]);
    const [compareWatchlist, setCompareWatchlist] = useState(null);
    const [compareWatchlistMovies, setCompareWatchlistMovies] = useState([]);
    const [watchlist, setWatchlist] = useState(null);
    const [watchlistMovies, setWatchlistMovies] = useState([]);

    const isUserList = watchlist ? userLists.filter(list => list.listId === watchlist.listId).length > 0 : false;

    useEffect(() => { // Get user info and movie list
        setCompareWatchlistMovies([]);
        handleGetListMovies();
    },[]);

    const handleGetListMovies = async () => {
        try {
            const watchlistResponse = await List.getListById(Number.parseInt(listId), userId);
            setWatchlist(watchlistResponse);
            await getAllListsMovies(watchlistResponse);
            await getUserLists();
        }
        catch(e){
            console.log(e);
        }
    }
    const handleEditListButton = () => {
        navigate(`/watchlist/${listId}/edit`, {state: {privacy: watchlist.privacy, listName: watchlist.listName, paramMessage: null}});
    }

    const handleCompareList = (event, list) => {
        event.preventDefault();
        setCompareWatchlist(list);
        const commonMovieIds = list.movieIds.filter(value => watchlist.movieIds.includes(value));
        getAllComparisonListMovies(commonMovieIds);
    }
    
    const commonListName = () => {
        const baseListName =  `A: ${compareWatchlist.listName} B: ${watchlist.listName}`;
        const commonListExists = userLists.filter(list => list.listName.startsWith(baseListName)).length > 0;
        if (!commonListExists) return baseListName;

        // If common lists already exists, look for previous version and increment
        const latestVersion = userLists
            .filter(list => list.listName.startsWith(baseListName))
            .map(list => Number.parseInt(list.listName.replace(baseListName, "")) || 1)
            .sort()
            .pop() + 1;
        return `${baseListName} ${latestVersion}`;
    }

    const handleComparisonNewList = async () => {
        try {
            await List.newListWithMovies(userId, commonListName(), true, compareWatchlist.movieIds);
            setBanner({message: "Created new watch list with common movies", variant: "success"});
            navigate("/user");
        } catch (e) {
            console.error(e);
            setBanner({message: "Error while creating new list from comparison", variant: "danger"});
            navigate("/user");
        }
    }

    const getAllComparisonListMovies = async (movieIds) => {
        setCompareWatchlistMovies([]);
        try {
            setCompareWatchlistMovies(await Movie.getManyById(movieIds));
        } catch (e) {
            console.error(e);
            setBanner({message: "Error getting movies for comparison", variant: "danger"});
            navigate("/");
        }
    }

    const getUserLists = async () => {
        try {
            setUserLists(await List.getByUserId(userId));
        } catch (e) {
            setBanner({message: "Error getting user watchlists", variant: "danger"});
            navigate("/user");
        }
    }

    const getAllListsMovies = async (responseList) => {
        if (responseList) {
            if(responseList.movieIds){
                try {
                    setWatchlistMovies(await Movie.getManyById(responseList.movieIds));
                } catch (e) {
                    console.error(e);
                    setBanner({message: "Error getting movies in list", variant: "danger"});
                    navigate("/user");
                }
            }
            else{
                setWatchlistMovies([]);
            }
        }
    }

    return(
            <Container>
                <Row style={onePercentMarginStyle}>
                    <Col style={boldFontStyle} id="listTitle">
                        <span>{watchlist?.listName ?? ''}</span>
                    </Col>
                    <Col xs="4" sm="2" style={boldFontStyle}>
                        <div id="view-montage-link" style={viewMontageLinkStyle} onClick={() => {navigate(`/montage/${listId}`); setBanner({message: null, variant: null})}}>View Montage</div>
                    </Col>

                    {isUserList ? <Col xs="2" sm="1" style={{display:"flex", justifyContent: "left"}}>
                        <Button aria-label="editListButton" id="editListButton" onClick={handleEditListButton}>Edit</Button>
                    </Col> : null}

                    {!isUserList ?
                        <Col xs sm="auto">
                            <DropdownButton id="compareListButton" title="Compare List" autoClose="outside" aria-label="compareListButton">
                                <form>
                                    {userLists.map((list) => (
                                        <DropdownItem as="button" key={list.listId} onClick={() => handleCompareList(list)} id={"comparisonListButton-" + list.listName} aria-label={list.listName}>
                                            {list.listName}
                                        </DropdownItem>
                                    ))}
                                </form>
                            </DropdownButton>
                        </Col> : null}
                </Row>

                <div className="userMovieLists">
                    { watchlistMovies.map((movie) => (
                        <MovieBox key={movie.movieId} {...movie}
                            haveAddMovieButton={!isUserList}
                            haveRemoveMovieButton={isUserList}
                            haveCopyMovieButton={isUserList}
                            haveMoveMovieButton={isUserList}
                            haveSeeMovieListsButton={true}
                            haveFreeTicketButton={true}
                            watchlist={userLists}
                            movieId={movie.movieId} listId={listId}
                            handleUpdateWatchlist={handleGetListMovies}
                            setBanner={setBanner}/>
                    ))}
                </div>

                {compareWatchlistMovies.length > 0 ? <Container>
                    <Row>
                        <Col style={boldFontStyle} id="sharedMoviesTitle">Shared Movies</Col>
                        <Button className="ComparisonNewListButton" variant="secondary" size="sm" id="comparisonNewListButton"
                                aria-label="comparisonNewListButton" onClick={() => handleComparisonNewList()}>New List From Common Movie</Button>
                    </Row>
                    <div>
                        <div style={onePercentMarginStyle}>
                            {compareWatchlistMovies.map((movie) => (
                                <MovieBox key={movie.movieId} {...movie}
                                    haveAddMovieButton={false}
                                    haveRemoveMovieButton={false}
                                    movieId={movie.movieId} listId={listId}
                                    handleUpdateWatchlist={handleGetListMovies}/>
                            ))}
                        </div>
                    </div>
                </Container> : null}
            </Container>
    );
};

const boldFontStyle = {
    fontWeight: "bold",
    display: "flex",
    alignItems: "center"
}

const onePercentMarginStyle = {
    margin: '2%'
}

const viewMontageLinkStyle = {
    fontSize: "16px", 
    cursor: "pointer"
};

export default WatchlistMoviesPage;