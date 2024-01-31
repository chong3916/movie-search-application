import React from "react";
import "../styles/removeMovieButton.css";
import Button from "react-bootstrap/Button";
import { ReactComponent as DashIcon } from '../assets/dashicon.svg';

const RemoveMovieButton = ({listId, movieId, handleUpdateWatchlist, title}) => {
    const handleRemoveMovie = async () => {
        const fetchResponse = await fetch("/api/lists/remove", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({listId: listId, movieId: movieId})
        }).catch((err) => { console.log(err) });

        console.log(fetchResponse);
        handleUpdateWatchlist();
    }

    return (
        <div style={{display: "flex", alignItems: "center", height: "auto"}}>
            <Button type="button" aria-label="removeMovieButton" className="RemoveMovieButton" id={"removeMovieButton-" + title}
                    onClick={handleRemoveMovie}>
                <DashIcon/>
            </Button>
        </div>
    );
}

export default RemoveMovieButton;
