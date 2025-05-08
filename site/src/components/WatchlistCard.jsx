import React from "react";
import {Link} from "react-router-dom";
import Card from 'react-bootstrap/Card';
import "../styles/watchlistCard.css";
import {Col, Row} from "react-bootstrap";
import DeleteListButton from "./DeleteListButton";
import {useBannerContext} from "../contexts/BannerContext";

const WatchlistCard = ({listId, listName, privacy, haveRemoveListButton, handleWatchlistUpdate }) => {
    const { bannerData, setBannerData } = useBannerContext();

    return (
        <Card id={"watchlistCard-" + listName} className="bg-dark text-white" style={{minWidth: '16rem', height: '12rem', textAlign: "center", margin: "1%", padding: "2.5rem"}}>
            <Card.Body>
                <Card.Title><Link onClick={() => setBannerData({message: null, variant: null})} className="WatchlistLink" aria-label={listName} id={"watchlistCardLink-" + listName}
                                  to={"/watchlist/movies/" + privacy + "/" + listId} state={{privacy: (privacy === "private"), paramMessage: null}}>{listName}</Link></Card.Title>
                <Card.Text style={{color: "#828281"}}>
                    <Row><Col>{privacy}</Col></Row>
                    {haveRemoveListButton ?
                        <Row><Col><DeleteListButton listId={listId} handleWatchlistUpdate={handleWatchlistUpdate} listName={listName}/></Col></Row>
                    : null}
                </Card.Text>
            </Card.Body>
        </Card>
    );
}

export default WatchlistCard;
