import React from "react";
import {Link} from "react-router-dom";
import PersonBox from "./PersonBox";
import "../styles/movieDetail.css";
import { ReactComponent as MoviePosterPlaceHolderImage } from '../assets/movieposterplaceholder.svg';
import {Col, Container, Row} from "react-bootstrap";
import {useBannerContext} from "../contexts/BannerContext";

const MovieDetail = ({ fetchResponse, backgroundImage} ) =>{
    const { bannerData, setBannerData } = useBannerContext();

    // If fetchResponse is valid and not null, render HTML component
    if(fetchResponse){
        return(
            <Container fluid>
                <Container className="DetailContainer" style={{"--image-url": backgroundImage, padding: "3%"}}>
                    <Row xs={1} className="MovieDetailsRow">
                        <Col xs sm={3} className="MoviePoster" aria-label="moviePoster" id="moviePoster" style={{"--image-url": backgroundImage}}>
                                {fetchResponse.posterPath ?
                                    <img id="posterImg" src={fetchResponse.posterPath}/> :
                                    <MoviePosterPlaceHolderImage/>
                                }
                        </Col>
                        <Col sm={7} id="movieDetailColumn">
                            <Container className="MovieDetails" fluid>
                                <Row>
                                    <Col>
                                        <h1 id="movieTitle" style={{fontWeight: "700"}}>{fetchResponse.title}</h1>
                                    </Col>
                                </Row>
                                <Row xs={1}>
                                    <Col xs sm={"auto"}>
                                        {fetchResponse.releaseDate ? <li id="releaseDate" aria-label="releaseDate">
                                            <span>{fetchResponse.releaseDate}</span></li> : null}
                                    </Col>
                                    <Col>
                                        {fetchResponse.genres ? <li aria-label="genres" id="genres">
                                            {fetchResponse.genres.map((genre) =>
                                                <Link id={"genre" + genre.name} key={genre.id}
                                                      aria-label={"genre" + genre.name + "Link"}
                                                      style={{textDecoration: "none", color: "white"}}
                                                      to={"/search/genre/" + genre.id + "/null/null"}
                                                      onClick={() => {setBannerData({message: null, variant: null})}}>
                                                    {genre.name + " "}
                                                </Link>)}
                                        </li> : null}</Col>
                                </Row>

                                <Row><Col><h3 style={{fontWeight: "600"}}>Overview</h3></Col></Row>
                                <Row><p id="overview" aria-label="overview">{fetchResponse.overview}</p></Row>

                                <Row id="director" aria-label="director">
                                    <Col xs sm={"auto"}><h4>Director:</h4></Col>
                                    <Col>{fetchResponse.director ? fetchResponse.director.name : null}</Col>
                                </Row>

                                <Row><Col><h4 style={{fontWeight: "600"}}>Production Companies</h4></Col></Row>
                                <Row id="productionCompanies">
                                    {fetchResponse.productionCompanies ? (fetchResponse.productionCompanies.map((company) =>
                                        <Col xs sm={"auto"} key={company.id}>
                                            <li>{company.name}</li>
                                        </Col>)) : null}
                                </Row>
                            </Container>
                        </Col>
                    </Row>
                </Container>
                <h2 style={{marginLeft: "1%"}}>Cast</h2>
                <Container id="cast" className="CastContainer" style={{display: "flex", flexDirection: "row", overflow: "auto"}}>
                    {fetchResponse.cast ? (fetchResponse.cast.map((person) =>
                        <PersonBox key={person.order} {...person} />)) : null}
                </Container>
            </Container>
        );
    }
    else{ return null; }
}

export default MovieDetail;