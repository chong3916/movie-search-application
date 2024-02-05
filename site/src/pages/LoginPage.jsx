import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import { Auth } from "../api/auth";
import Button from "react-bootstrap/Button";
import "../styles/loginPage.css";
import {useAuthContext} from "../contexts/AuthContext";
import {Card, CardContent, Container, TextField, Typography, Stack} from "@mui/material";

const LoginPage = ({ setBanner }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const { authData, setAuthData } = useAuthContext();
    const navigate = useNavigate();

    const handleSignUpClick = () => {
        setBanner({message: null, variant: null});
        navigate("/signup");
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const user = await Auth.login(username, password);
            console.log(user.status);
            if(user.status !== 200)
            {
                setUsername("");
                setPassword("");
            }
            else {
                const userInfo = await user.json();
                setAuthData({...authData, uuid: userInfo.uuid, username: userInfo.username, isLoggedIn: true});
                setBanner({message: null, variant: null});
                navigate("/");
                return;
            }

            if(user.status === 400){
                setBanner({message: "Invalid password. Try again.", variant: "danger"});
            }
            else if(user.status === 404){
                setBanner({message: "Unable to find user with given information. Try again or create a new user.", variant: "danger"});
                //navigate(".", {state: {paramMessage: "Unable to find user with given information. Try again or create a new user.", variant: "danger"}});
            }
            else if(user.status === 429){
                setBanner({message: "Locked account due to too many failed login attempts. Please try again later.", variant: "danger"});
                //navigate(".", {state: {paramMessage: "Locked account due to too many failed login attempts. Please try again later.", variant: "danger"}});
            }
            else if(user.status === 503){
                setBanner({message: "Account is still locked. Please try again later.", variant: "danger"});
                //navigate(".", {state: {paramMessage: "Account is still locked. Please try again later.", variant: "danger"}});
            }
        } catch (e) {
            setBanner({message: "Unable to find user with given information. Try again or create a new user.", variant: "danger"});
            //navigate(".", {state: {paramMessage: "Unable to find user with given information. Try again or create a new user.", variant: "danger"}})
            console.error(e);
        }
    }

    return (
        <Container maxWidth="sm">
            <Card style={{margin: "3rem"}}>
                <CardContent style={{margin: "2rem"}}>
                    <Typography variant="h3" component="div" align="center">
                        Login
                    </Typography>
                    <form onSubmit={handleSubmit}>
                        <Stack spacing={5}>
                            <TextField
                                id="username"
                                label="Username"
                                value={username}
                                variant="standard"
                                onChange={(event) => {
                                    setUsername(event.target.value);
                                }}
                            />
                            <TextField
                                id="password"
                                label="Password"
                                value={password}
                                variant="standard"
                                type="password"
                                onChange={(event) => {
                                    setPassword(event.target.value);
                                }}
                            />
                            <Button type="submit" aria-label="submit" id="submit">LOGIN</Button>
                        </Stack>
                    </form>
                </CardContent>
            </Card>
        </Container>
        /*
        <Container>
            <Container fluid style={{padding: "1rem"}}>
                <Row className="justify-content-md-center">
                    <h1 style={{fontSize: "2rem", textAlign: "center"}}>Welcome to Movie Search!</h1>
                </Row>
                <Row className="justify-content-md-center">
                    <h2 style={{fontSize: "1.5rem", textAlign: "center"}}>Login Page</h2>
                </Row>
                <Row className="justify-content-md-center">
                    <p style={{fontSize: "1rem", textAlign: "center"}}>Please enter your username and
                    password below to find your favorite movies and actors.</p>
                </Row>
            </Container>
            <Container aria-label="loginFormContainer" className="LoginFormContainer">
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
                    <Row className="justify-content-md-center" md={2}>
                        <Col xs sm="auto" style={{display: "flex", justifyContent: "center"}}>
                            <Button type="submit" aria-label="submit" id="submit">Login</Button>
                        </Col>
                    </Row>
                </Form>
                <Row className="justify-content-md-center" md={2}>
                        <p style={{fontSize: "1rem", textAlign: "center", width: "auto"}}>
                            Don&apos;t have an account? <Button variant="secondary" aria-label="Sign Up" size="sm" onClick={handleSignUpClick}>Sign Up</Button>
                        </p>
                </Row>
            </Container>
        </Container>

         */
    );
}

export default LoginPage;

