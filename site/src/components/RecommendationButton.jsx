import React, {useEffect, useState} from "react";
import "../styles/addMovieButton.css";
import {DropdownButton, Form, FormCheck, OverlayTrigger, Tooltip} from "react-bootstrap";
import DropdownItem from "react-bootstrap/DropdownItem";
import {useNavigate} from "react-router-dom";
import {useBannerContext} from "../contexts/BannerContext";

const RecommendationButton = ({ setRecommendations, lists }) => {
    const [recommendationNum, setRecommendationNum] = useState("");
    const [checkedState, setCheckedState] = useState(new Array(lists.length).fill(false));
    const navigate = useNavigate();
    const { bannerData, setBannerData } = useBannerContext();

    useEffect(() => {
        setCheckedState(new Array(lists.length).fill(false));
    }, [lists])

    const handleGenerateSuggestions = (event) => {
        event.preventDefault();
        let movieIds = [];
        for(let i = 0; i < lists.length; i++){
            if(checkedState[i] && lists[i].movieIds){
                movieIds = movieIds.concat(lists[i].movieIds);
            }
        }

        if(movieIds.length > 0) {
            fetch("/api/movie/list/recommendations", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({movieIds: movieIds, count: recommendationNum})
            })
                .then((res) => res.json()) // convert response to json if response is valid
                .then((response) => {
                    setRecommendations(response);
                })
                .catch((err) => {
                    console.log(err);
                })
        }
        else{
            setRecommendations(null);
            setBannerData({message: "Unable to generate recommendations for chosen list. Please choose list with more movies.", variant: "error"});
            navigate("/user")
        }
    }
    const handleRecommendationNum = (event) => { setRecommendationNum(event.target.value); }

    const handleFormCheck = (position) => {
        let updatedCheckedState = [...checkedState];
        updatedCheckedState[position] = !checkedState[position];
        setCheckedState([...updatedCheckedState]);
    }

    return (
        <div>
            <DropdownButton id="recommendationsButton" title="Recommendations" autoClose="outside" aria-label="recommendationsButton">
                <Form onSubmit={handleGenerateSuggestions}>
                    <OverlayTrigger
                        key="recommendationTooltip"
                        placement="left"
                        overlay={<Tooltip id="tooltip-left">Enter in 1-10 number of movies to suggest</Tooltip>}>
                        <DropdownItem as="input" type="number" min="1" max="10"
                                      aria-label="recommendationNum" placeholder="# of movies"
                                      id="recommendationNum"
                                      value={recommendationNum} onChange={handleRecommendationNum} required/>
                    </OverlayTrigger>
                    <Form.Group>
                        {lists.map((list, index) =>
                            (<DropdownItem key={list.listId + "-" + checkedState[index]}>
                                <FormCheck type="checkbox" aria-label={list.listName + "CheckBox"}
                                           id={"recommendationCheck-" + list.listName} checked={checkedState[index]}
                                           onChange={() => handleFormCheck(index)} label={list.listName}/>
                            </DropdownItem>))}
                        <hr/>
                        <DropdownItem as="button" type="submit" aria-label="recommendationsSubmit" id="recommendationsSubmit">Generate</DropdownItem>
                    </Form.Group>
                </Form>
            </DropdownButton>
        </div>
    );
}

export default RecommendationButton;
