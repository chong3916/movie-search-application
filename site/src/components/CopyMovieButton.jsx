import React, {useEffect, useState} from "react";
import "../styles/addMovieButton.css";
import {useNavigate} from "react-router-dom";
import DropdownToggle from "react-bootstrap/DropdownToggle";
import {Dropdown} from "react-bootstrap";
import DropdownItem from "react-bootstrap/DropdownItem";
import { ReactComponent as CopyMovieButtonIcon } from '../assets/copymoviebutton.svg'
import {useBannerContext} from "../contexts/BannerContext";

const CopyMovieButton = ({movieId, watchlist, title, handleUpdateWatchlist}) => {
    const navigate = useNavigate();
    const [filteredLists, setFilteredLists] = useState(watchlist);

    const { bannerData, setBannerData } = useBannerContext();

    useEffect(() => {
        handleUpdateAbleWatchlists();
    }, [watchlist])

    const handleUpdateAbleWatchlists = () => {
        setFilteredLists(watchlist.filter((list) => !list.movieIds || !list.movieIds.includes(movieId)));
    }

    const handleCopyMovie = (e) => {
        e.preventDefault();
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

    const handleCreateNewList = () => {
        setBannerData({message: null, variant: null});
        navigate("/watchlist/new", { state: { movieIds: [movieId] } });
    }

    return (
        <Dropdown style={{display: "flex", alignItems: "center", height: "auto"}}>
            <DropdownToggle as="button" aria-label="copyMovieButton" className="CopyMovieButton" size="sm" id={"copyMovieButton-" + title}>
                <CopyMovieButtonIcon/>
            </DropdownToggle>
            <Dropdown.Menu>
                <form>
                    {filteredLists.map((list) =>
                        (<DropdownItem as="button" key={list.listId + "-copyMovieButton"} onClick={handleCopyMovie}
                                       value={list.listId}
                                       id={"copyMovieListButton-" + list.listName}
                                       aria-label={list.listName}>{list.listName}</DropdownItem>))}
                </form>
                <DropdownItem as="button" aria-label="addListButton" onClick={handleCreateNewList}>Create new
                    list</DropdownItem>
            </Dropdown.Menu>
        </Dropdown>
    );
}

export default CopyMovieButton;
