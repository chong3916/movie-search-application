import React from "react";
import {Link} from "react-router-dom";
import Card from "react-bootstrap/Card";
import "../styles/personBox.css";
import { ReactComponent as MoviePosterPlaceHolderImage } from '../assets/movieposterplaceholder.svg';
import {useBannerContext} from "../contexts/BannerContext";

const PersonBox = ({name, profilePath, character}) =>{
    const { bannerData, setBannerData } = useBannerContext();

    return (
        <div>
            <Card className="PersonBox">
                {profilePath ? <Card.Img variant="top" src={profilePath} id="profileImg" aria-label="profileImg"/> :
                    <div id="profileImg" aria-label="profileImg" className="ProfileImgPlaceholder">
                        <MoviePosterPlaceHolderImage/>
                    </div>}
                <Card.Body id="profileInfo">
                    <Card.Title id="actorName" style={{fontSize: "1rem"}}>
                        <Link id={"actorLink-" + name} style={{textDecoration: "none", color: "black"}}
                              to={"/search/actor/" + name + "/null/null"}
                              aria-label={"actorLink"}
                              onClick={() => setBannerData({message: null, variant: null})}>{name}</Link>
                    </Card.Title>
                    <Card.Text style={{color: "#828281"}}>
                        {character}
                    </Card.Text>
                </Card.Body>
            </Card>
        </div>
    );
}

export default PersonBox;
