import React, {useEffect, useState} from "react";
import "../styles/addMovieButton.css";
import {useNavigate} from "react-router-dom";
import DropdownToggle from "react-bootstrap/DropdownToggle";
import {Dropdown} from "react-bootstrap";
import DropdownItem from "react-bootstrap/DropdownItem";
import { ReactComponent as MoveMovieButtonIcon } from '../assets/movemoviebutton.svg';

const MoveMovieButton = ({movieId, watchlist, listId, title, handleUpdateWatchlist, setBanner}) => {
    const navigate = useNavigate();
    const [filteredLists, setFilteredLists] = useState(watchlist);

    useEffect(() => {
        handleUpdateAbleWatchlists();
    }, [watchlist]);

    const handleUpdateAbleWatchlists = () => {
        setFilteredLists(watchlist.filter((list) => !list.movieIds || !list.movieIds.includes(movieId)));
    }

    const handleMoveMovie = async (e) => {
        e.preventDefault();
        await handleRemoveMovie().then((removed) => {
            if(removed){
                fetch("/api/lists/add", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({listId: e.target.value, movieId: movieId})
                })
                    .then((res) => res.json())
                    .then(() => {
                        handleUpdateWatchlist();
                    })
                    .catch((err) => {
                        console.log(err);
                    })
            }
        })
    }

    const handleCreateNewList = async () => {
        await handleRemoveMovie();
        setBanner({message: null, variant: null});
        navigate("/watchlist/new", { state: { movieIds: [movieId] } });
    }

    const handleRemoveMovie = () => {
        return fetch("/api/lists/remove", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({listId: listId, movieId: movieId})
        })
            .then((res) => res.json()) // convert response to json if response is valid
            .then(() => {
                console.log("successfully removed movie");
                return true;
            })
            .catch((err) => {
                console.log(err);
                return false;
            })
    }

    return (
        <Dropdown style={{display: "flex", alignItems: "center", height: "auto"}}>
            <DropdownToggle as="button" aria-label="moveMovieButton" className="MoveMovieButton" id={"moveMovieButton-" + title}>
                <MoveMovieButtonIcon/>
            </DropdownToggle>
            <Dropdown.Menu>
                <form>
                    {filteredLists.map((watchlistReq) =>
                        (<DropdownItem as="button" key={watchlistReq.listId + "-moveMovieButton"}
                                       onClick={handleMoveMovie}
                                       value={watchlistReq.listId}
                                       id={"moveMovieListButton-" + watchlistReq.listName}
                                       aria-label={watchlistReq.listName}>{watchlistReq.listName}</DropdownItem>))}
                </form>
                <DropdownItem as="button" aria-label="addListButton" onClick={handleCreateNewList}>Create new
                    list</DropdownItem>
            </Dropdown.Menu>
        </Dropdown>
    );
}

export default MoveMovieButton;
