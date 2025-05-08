import React, {useEffect, useState} from "react";
import "../styles/addMovieButton.css";
import {useNavigate} from "react-router-dom";
import DropdownToggle from "react-bootstrap/DropdownToggle";
import {Dropdown} from "react-bootstrap";
import DropdownItem from "react-bootstrap/DropdownItem";
import { ReactComponent as AddMovieButtonIcon } from '../assets/addmoviebutton.svg';
import {useBannerContext} from "../contexts/BannerContext";

const AddMovieButton = ({movieId, watchlist, handleUpdateWatchlist, title}) => {
    const [filteredLists, setFilteredLists] = useState([]);
    const navigate = useNavigate();
    const { bannerData, setBannerData } = useBannerContext();

    useEffect(() => {
        handleWatchlistUpdate();
    }, [watchlist])

    const handleWatchlistUpdate = () => {
        setFilteredLists(watchlist.filter((list) => !(list.movieIds && list.movieIds.includes(movieId))));
    }

    const handleAddMovie = (e) => {
        e.preventDefault();

        fetch("/api/lists/add", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({listId: e.target.value, movieId: movieId})
        })
            .then((res) => res.json()) // convert response to json if response is valid
            .then(() => {
                handleUpdateWatchlist();
            })
            .catch((err) => {
                console.log(err);
            })
    }

    const handleCreateNewList = () => {
        setBannerData({message: null, variant: null});
        navigate("/watchlist/new", { state: { movieIds: [movieId] } });
    }

    return (
        <Dropdown style={{display: "flex", alignItems: "center", height: "auto"}}>
            <DropdownToggle as="button" aria-label="addMovieButton" className="AddMovieButton" size="sm" id={"addMovieButton-" + title}>
                <AddMovieButtonIcon/>
            </DropdownToggle>
            <Dropdown.Menu>
                <form>
                    {filteredLists.map((list) =>
                        (<DropdownItem as="button" key={list.listId} onClick={handleAddMovie}
                                       value={list.listId}
                                       id={"addMovieListButton-" + list.listName}
                                       aria-label={list.listName}>{list.listName}</DropdownItem>))}
                </form>
                <DropdownItem as="button" aria-label="addListButton" id="addMovieCreateListButton" onClick={handleCreateNewList}>Create new
                    list</DropdownItem>
            </Dropdown.Menu>
        </Dropdown>
    );
}

export default AddMovieButton;
