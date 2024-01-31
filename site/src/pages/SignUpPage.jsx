import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import { Auth } from "../api/auth";
import Input from '../components/Input';
import {Col, Container, Form, Row} from "react-bootstrap";
import Button from "react-bootstrap/Button";
import "../styles/loginPage.css";

function SignUpPage({ sessionStorageEvent, setBanner }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const navigate = useNavigate();

    const handleLoginClick = () => {
        setBanner({message: null, variant: null});
        navigate("/login");
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (password !== confirmPassword) {
            setBanner({message: "Confirm password does not match password entered. Please try again", variant: "danger"});
            //navigate(".", {state: {paramMessage: "Confirm password does not match password entered. Please try again", variant: "danger"}})
            setPassword(""); // Reset password field
            setConfirmPassword(""); // Reset confirm password field
            return;
        }
        
        try{ 
            const user = await Auth.signup(username, password);
            sessionStorage.clear();
            sessionStorage.setItem('user', user.uuid); // store userId in session storage
            document.dispatchEvent(sessionStorageEvent);
            setBanner({message: null, variant: null});
            navigate("/");
        } catch (e) {
            setBanner({message: "User already exists. Please login or sign up with different user info.", variant: "danger"});
            //navigate(".", {state: {paramMessage: "User already exists. Please login or sign up with different user info.", variant: "danger"}})
            console.error(e);
        }
    };

    return (
        <Container>
            <Container fluid style={{padding: "1rem"}}>
                <Row className="justify-content-md-center">
                    <h1 style={{textAlign: "center"}}>Welcome to Movie Search!</h1>
                </Row>
                <Row className="justify-content-md-center">
                    <h2 style={{textAlign: "center"}}>Create a New Account</h2>
                </Row>
                <Row className="justify-content-md-center">
                    <p style={{textAlign: "center"}}>
                        Create a username, email, and password below to find your favorite movies and actors.</p>
                </Row>
            </Container>
            <Container aria-label="signUpFormContainer" className="SignUpFormContainer">
                <Form onSubmit={handleSubmit} style={{padding: "1rem", width: "auto"}}>
                    <Input
                        value={username}
                        onChange={(event) => setUsername(event.target.value)}
                        type={"text"}
                        id={"username"}
                        displayLabel={"Username "}
                    />
                    <Input
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        type={"password"}
                        id={"password"}
                        displayLabel={"Password "}
                    />
                    <Input
                        value={confirmPassword}
                        onChange={(event) => setConfirmPassword(event.target.value)}
                        type={"password"}
                        id={"confirmPassword"}
                        displayLabel={"Confirm Password "}
                    />
                    <Row className="justify-content-md-center" md={2}>
                        <Col xs sm="auto" style={{display: "flex", justifyContent: "center"}}>
                            <Button type="submit" aria-label="submit" id="submitSignUp">Sign Up</Button>
                        </Col>
                    </Row>
                </Form>
                <Row className="justify-content-md-center" md={2}>
                    <p style={{fontSize: "1rem", textAlign: "center", width: "auto"}}>
                        Already have an account? <Button variant="secondary" aria-label="Login" size="sm" onClick={handleLoginClick}>Login</Button>
                    </p>
                </Row>
            </Container>
        </Container>
    );
}

export default SignUpPage;
