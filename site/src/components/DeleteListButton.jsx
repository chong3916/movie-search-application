import React, {useState} from "react";
import "../styles/removeMovieButton.css";
import Button from "react-bootstrap/Button";
import {Modal} from "react-bootstrap";
import { ReactComponent as DashIcon } from '../assets/dashicon.svg';

const DeleteListButton = ({listId, handleWatchlistUpdate, listName}) => {
    const userId = sessionStorage.getItem("user");
    const [show, setShow] = useState(false);

    const handleShow = () => setShow(!show);

    const handleConfirm = () => {
        setShow(!show);
        handleDeleteList();
    }

    const handleDeleteList = () => {
        fetch("/api/lists/delete", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({listId: listId, uuid: userId})
        })
            .then((res) => {
                if(res.status !== 200){
                    throw new Error("Error deleting list");
                }
                return res.json()
            }) // convert response to json if response is valid
            .then(() => {
                handleWatchlistUpdate();
            })
            .catch((err) => {
                console.log(err);
            })
    }

    return (
        <div className="DeleteList">
            <Button type="button" aria-label="deleteListButton" className="DeleteListButton" id={"deleteListButton-" + listName} onClick={handleShow}>
                <DashIcon/>
            </Button>

            <Modal show={show} onHide={handleShow} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Are you sure you want to delete the list?</Modal.Title>
                </Modal.Header>
                <Modal.Footer>
                    <Button variant="secondary" aria-label="deleteListCancelButton" id="deleteListCancelButton" onClick={handleShow}>
                        Cancel
                    </Button>
                    <Button variant="primary" aria-label="deleteListConfirmButton" id="deleteListConfirmButton" onClick={handleConfirm}>
                        Delete List
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default DeleteListButton;
