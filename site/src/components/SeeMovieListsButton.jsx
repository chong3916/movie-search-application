import React, {useEffect, useState} from "react";
import "../styles/addMovieButton.css";
import DropdownToggle from "react-bootstrap/DropdownToggle";
import {Dropdown} from "react-bootstrap";

const SeeMovieListsButton = ({movieId, watchlist, title}) => {
    const [listsMoviesIn, setListsMoviesIn] = useState([]);

    useEffect(() => {
        handleUpdateListsMoviesIn();
    }, [watchlist])

    const handleUpdateListsMoviesIn = () => {
        setListsMoviesIn(watchlist.filter((list) => list.movieIds && list.movieIds.includes(movieId)));
    }

    return (
        <Dropdown style={{display: "flex", alignItems: "center", height: "auto"}}>
            <DropdownToggle as="button" aria-label="seeMovieListsButton" className="SeeMovieListsButton" id={"seeMovieListsButton-" + title}>
                <svg xmlns="http://www.w3.org/2000/svg" width="1rem" height="1rem" fill="currentColor"
                     className="bi bi-eye-fill" viewBox="0 0 16 16">
                    <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z"/>
                    <path
                        d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z"/>
                </svg>
            </DropdownToggle>
            <Dropdown.Menu>
                {watchlist.map((list) =>
                    (<Dropdown.ItemText
                        key={list.listId}
                        value={list.listId}
                        aria-label={list.listName}
                        id={"seeMovieListsText-" + list.listName}>
                        {list.listName}
                        {listsMoviesIn.includes(list) ?
                            <svg xmlns="http://www.w3.org/2000/svg" width="1rem" height="1rem" fill="currentColor"
                                 style={{color: "rgb(29, 161, 14)"}}
                                 className="bi bi-check-lg" viewBox="0 0 16 16" id="checkMark">
                                <path
                                    d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z"/>
                            </svg> : null}
                    </Dropdown.ItemText>))}
            </Dropdown.Menu>
        </Dropdown>
    );
}

export default SeeMovieListsButton;
