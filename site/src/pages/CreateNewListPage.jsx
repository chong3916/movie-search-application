import React, {useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import "../styles/createNewListPage.css"
import {Form} from "react-bootstrap";
import Button from "react-bootstrap/Button";
import {List as list} from "../api/list";
import {useAuthContext} from "../contexts/AuthContext";
import {useBannerContext} from "../contexts/BannerContext";
const CreateNewListPage = () => {
    const [newListName, setNewListName] = useState("");
    const [newListPrivacy, setNewListPrivacy] = useState("private");
    const {state} = useLocation();
    const [movieIds, setMovieIds] = useState([]);
    const navigate = useNavigate();
    const {authData} = useAuthContext();
    const { bannerData, setBannerData } = useBannerContext();

    useEffect(() => {
        if(state && state.movieIds){
            setMovieIds(state.movieIds);
        }
    }, [])

    const handleAddList = async (event) => {
        event.preventDefault();
        try {
            const fetchResponse = (movieIds.length > 0 ? await list.newListWithMovies(authData.uuid, newListName, newListPrivacy === "private", movieIds) :
                                                        await list.newListWithoutMovies(authData.uuid, newListName, newListPrivacy === "private"));

            if (fetchResponse.ok) {
                setBannerData({message: "Created new watch list", variant: "success"});
                navigate(-1);
            } else {
                setBannerData({message: "A list already exists with that name. Please provide a different name", variant: "error"});
            }
        } catch(e){
            console.log(e);
            setBannerData({message: "Error creating list", variant: "error"});
        }
    }

    const handleNewListName = (event) => {
        setNewListName(event.target.value);
    }

    const handleNewListPrivacy = (event) => {
        setNewListPrivacy(event.target.value);
    }

    return (
        <div className="NewListForm" aria-label="newListForm">
            <Form onSubmit={handleAddList}>
                <Form.Group className="mb-3">
                    <Form.Label>Name</Form.Label>
                    <Form.Control type="text"
                           placeholder="List Name"
                           value={newListName}
                           onChange={handleNewListName}
                           id="newListName"
                           aria-label="newListName"
                           required
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Select value={newListPrivacy} aria-label="listPrivacy" id="listPrivacy" onChange={handleNewListPrivacy}>
                        <option value={"public"}>Public </option>
                        <option value={"private"}>Private </option>
                    </Form.Select>
                </Form.Group>
                <Button style={{width: "100%"}} variant="primary" type="submit" className="CreateNewListButton" id="createNewListButton"
                        aria-label="createNewListButton">
                    Create New List
                </Button>
            </Form>
        </div>
    );
}

export default CreateNewListPage;
