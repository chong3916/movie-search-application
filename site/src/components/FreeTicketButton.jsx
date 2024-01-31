import React, {useState} from "react";
import "../styles/removeMovieButton.css";
import Button from "react-bootstrap/Button";
import {Modal} from "react-bootstrap";
import { ReactComponent as FreeTicketButtonIcon } from '../assets/freeticketbutton.svg';

const FreeTicketButton = ({movieName}) => {
    const [show, setShow] = useState(false);
    const handleShow = () => setShow(!show);


    return (
        <div className="FreeTicket" style={{display: "flex", alignItems: "center", height: "auto"}}>
            <Button
                onClick={handleShow}
                aria-label="freeTicketButton"
                className="FreeTicketButton"
                id={"freeTicketButton-" + movieName}
            >
                <FreeTicketButtonIcon/>
            </Button>

            <Modal
                show={show}
                onHide={handleShow}
                backdrop="static"
                keyboard={true}
                centered
            >
                <Modal.Header closeButton>
                </Modal.Header>
                <Modal.Body>
                    <p aria-label="freeTicketPopupMessage" className="FreeTicketPopupMessage" id="freeTicketPopupMessage">
                        You received a free movie ticket for <i>{movieName}</i>!
                    </p>
                </Modal.Body>
            </Modal>
        </div>
    );
}

export default FreeTicketButton;
