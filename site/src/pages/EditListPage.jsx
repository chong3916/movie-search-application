import React, {useEffect, useState} from "react";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import "../styles/createNewListPage.css"
import {Form} from "react-bootstrap";
import Button from "react-bootstrap/Button";
const EditListPage = ({ setBanner }) => {
    const { state } = useLocation();
    const { listId } = useParams();
    const [listName, setListName] = useState(state.listName);
    const [listPrivacy, setListPrivacy] = useState((state.privacy ? "private" : "public"));
    const navigate = useNavigate();

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
            body: JSON.stringify({listId: listId, listName: listName, userId: sessionStorage.getItem("user")})
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
            setBanner({message: "Error editing list name. Unable to find user or list.", variant: "danger"});
            //navigate(".", {state: {paramMessage: "Error editing list name. Unable to find user or list.", variant: "danger"}});
        } else if (editListNameResponse.status === 400) {
            setBanner({message: "A list already exists with this name. Please choose a different name", variant: "danger"});
            //navigate(".", {state: {paramMessage: "A list already exists with this name. Please choose a different name", variant: "danger"}});
        } else {
            const editPrivacyResponse = await editListPrivacy();

            if(editPrivacyResponse && editPrivacyResponse.ok) {
                setBanner({message: null, variant: null});
                navigate(-1);
            } else {
                setBanner({message: "Error editing list privacy. Unable to find user or list", variant: "danger"});
                //navigate(".", {state: {paramMessage: "Error editing list privacy. Unable to find user or list", variant: "danger"}});
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
