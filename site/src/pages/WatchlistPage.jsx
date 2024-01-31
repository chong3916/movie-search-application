import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import "../styles/watchlistPage.css"
import WatchlistCard from "../components/WatchlistCard";
import Button from 'react-bootstrap/Button';
import {Col, Container, Row} from "react-bootstrap";
import RecommendationButton from "../components/RecommendationButton";
import MovieBox from "../components/MovieBox";
import {List} from "../api/list";

const WatchlistPage = ({ setBanner }) => {
    const userId = sessionStorage.getItem("user");
    const [userLists, setUserLists] = useState([]);
    const [publicLists, setPublicLists] = useState([]);
    const [recommendations, setRecommendations] = useState(null);
    const [watchlistUpdate, setWatchlistUpdate] = useState(false);
    const navigate = useNavigate();

    const getUserLists = async () => {
        try{
            setUserLists(await List.getByUserId(userId));
        } catch(e){
            setBanner({message: "Error getting user watchlists", variant: "danger"});
            navigate("/login");
        }
    }

    const getPublicLists = async () => {
        try{
            setPublicLists(await List.getPublic());
        } catch(e){
            setBanner({message: "Error getting public watchlists", variant: "danger"});
            //navigate(".", {state: {paramMessage: "Error getting public watchlists", variant: "danger"}});
        }
    }

    useEffect(() => { // Get user info and movie list
        getUserLists();
        getPublicLists();
    },[watchlistUpdate]);

    const handleNewWatchlist = () => {
        setBanner({message: null, variant: null});
        navigate("/watchlist/new");
    }

    const handleWatchlistUpdate = () => {
        setWatchlistUpdate(!watchlistUpdate);
    }

    const handleGetRecommendations = (response) => {
        setRecommendations(response);
    }

    const handleNewWatchlistRecommendations = () => {
        let movieIds = [];
        for(let i = 0; i < recommendations.length; i++){
            movieIds.push(recommendations[i].movieId);
        }
        setBanner({message: null, variant: null});
        navigate("/watchlist/new", {state: {movieIds: movieIds}})
    }


    return(
        <div>
            <Container>
                <Row>
                    <Col style={{fontWeight: "bold"}} id="myListTitle">My Lists</Col>
                    <Col xs="3" sm="1" style={{display:"flex", justifyContent: "left"}}>
                        <Button className="NewListButton" variant="secondary" size="sm" id="newListButton" aria-label="newListButton" onClick={handleNewWatchlist}>New List</Button>
                    </Col>
                    <Col xs sm="auto">
                        <RecommendationButton lists={userLists} setRecommendations={handleGetRecommendations} setBanner={setBanner} style={{margin: "1%"}}/>
                    </Col>
                </Row>
                <div className="UserWatchlists" style={{display: "flex", flexDirection: "row", overflow: "auto", flex: "1"}}>
                    {userLists.length === 0 ? <div style={placeholderDivStyle}/> : null}
                    {userLists.map((list) =>
                        <WatchlistCard key={list.listId} listId={list.listId} listName={list.listName} privacy={list.privacy ? "private" : "public"}
                                       handleWatchlistUpdate={handleWatchlistUpdate} haveRemoveListButton={true} setBanner={setBanner}/>)}
                </div>
            </Container>
            <Container>
                <Row>
                    <Col style={{fontWeight: "bold"}} id="publicListTitle">Public Lists</Col>
                </Row>
                <div className="PublicWatchlists" style={{display: "flex", flexDirection: "row", overflow: "auto", flex: "1"}}>
                    {publicLists.length === 0 ? <div style={placeholderDivStyle}/> : null}
                    {publicLists.map((list) =>
                        <WatchlistCard key={list.listId} listId={list.listId} listName={list.listName} privacy={"public"} setBanner={setBanner}/>)}
                </div>
            </Container>
            {recommendations ? <Container>
                <Row>
                    <Col style={{fontWeight: "bold"}} id="recommendationsTitle">Recommendations</Col>
                    <Button className="RecommendationsNewListButton" variant="secondary" size="sm" id="recommendationsNewListButton"
                            aria-label="recommendationsNewListButton" onClick={() => handleNewWatchlistRecommendations()}>New List From Recommendations</Button>
                </Row>
                <div>
                    <div style={{margin: "1%"}}>{recommendations.map((movie) => <MovieBox key={movie.movieId} {...movie}
                                                                                          haveAddMovieButton={false}
                                                                                          haveRemoveMovieButton={false}
                                                                                          movieId={movie.movieId}
                                                                                          setBanner={setBanner}/>)}
                    </div>
                </div>
            </Container> : null}
        </div>
    );
};

const placeholderDivStyle = {
    height: '13rem'
}

export default WatchlistPage;