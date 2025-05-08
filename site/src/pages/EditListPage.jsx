import React, {useEffect, useState} from "react";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import "../styles/createNewListPage.css"
import {Form} from "react-bootstrap";
import Button from "react-bootstrap/Button";
import {useAuthContext} from "../contexts/AuthContext";
import {useBannerContext} from "../contexts/BannerContext";
const EditListPage = () => {
    const { state } = useLocation();
    const { listId } = useParams();
    const [listName, setListName] = useState(state.listName);
    const [listPrivacy, setListPrivacy] = useState((state.privacy ? "private" : "public"));
    const navigate = useNavigate();
    const {authData} = useAuthContext();

    const { bannerData, setBannerData } = useBannerContext();


    useEffect(() => { // Get user info and movie list
        console.log(state.privacy);
        setListPrivacy((state.privacy ? "private" : "public"));
        setListName(state.listName);
    },[]);

    const editListPrivacy = async () => {
        const fetchResponse = await fetch("/api/lists/privacy", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({listId: listId, privacy: (listPrivacy === "private")})
        }).catch((err) => { console.log(err) });

        return fetchResponse;
    }

    const editListName = async (event) => {
        event.preventDefault();
        const fetchResponse = await fetch("/api/lists/rename", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({listId: listId, listName: listName, userId: authData.uuid})
        }).catch((err) => { console.log(err) });

        return fetchResponse;
    }
    const handleChangeListName = (event) => {
        setListName(event.target.value);
    }

    const handleChangeListPrivacy = (event) => {
        setListPrivacy(event.target.value);
    }

    const handleEditList = async () => {
        const editListNameResponse = await editListName();

        if (!editListNameResponse || editListNameResponse.status === 404) {
            setBannerData({message: "Error editing list name. Unable to find user or list.", variant: "error"});
            //navigate(".", {state: {paramMessage: "Error editing list name. Unable to find user or list.", variant: "error"}});
        } else if (editListNameResponse.status === 400) {
            setBannerData({message: "A list already exists with this name. Please choose a different name", variant: "error"});
            //navigate(".", {state: {paramMessage: "A list already exists with this name. Please choose a different name", variant: "error"}});
        } else {
            const editPrivacyResponse = await editListPrivacy();

            if(editPrivacyResponse && editPrivacyResponse.ok) {
                setBannerData({message: null, variant: null});
                navigate(-1);
            } else {
                setBannerData({message: "Error editing list privacy. Unable to find user or list", variant: "error"});
                //navigate(".", {state: {paramMessage: "Error editing list privacy. Unable to find user or list", variant: "error"}});
            }
        }
    }

    return (
        <div className="EditListForm" aria-label="editListForm">
            <Form onSubmit={handleEditList}>
                <Form.Group className="mb-3">
                    <Form.Label>Name</Form.Label>
                    <Form.Control type="text"
                                  placeholder={listName}
                                  value={listName}
                                  onChange={handleChangeListName}
                                  id="listName"
                                  aria-label="editListName"
                                  required
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Select value={listPrivacy} aria-label="editListPrivacy" id="listPrivacy" onChange={handleChangeListPrivacy}>
                        <option value={"public"}>Public </option>
                        <option value={"private"}>Private </option>
                    </Form.Select>
                </Form.Group>
                <Button style={{width: "100%"}} variant="primary" type="submit" className="saveListEdit" id="saveListEdit"
                        aria-label="saveListEdit">
                    Save
                </Button>
            </Form>
        </div>
    );
}

export default EditListPage;
