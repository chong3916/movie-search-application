import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import { Auth } from "../api/auth";
import Button from "react-bootstrap/Button";
import "../styles/loginPage.css";
import {useAuthContext} from "../contexts/AuthContext";
import {Card, CardContent, Container, TextField, Typography, Stack} from "@mui/material";
import {useBannerContext} from "../contexts/BannerContext";

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { authData, setAuthData } = useAuthContext();
    const navigate = useNavigate();

    const { bannerData, setBannerData } = useBannerContext();

    const handleSignUpClick = () => {
        setBannerData({message: null, variant: null});
        navigate("/signup");
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const user = await Auth.login(email, password);
            if(user.status !== 200)
            {
                setEmail("");
                setPassword("");
            }
            else {
                const userInfo = await user.json();
                setAuthData({...authData, uuid: userInfo.uuid, username: userInfo.username, isLoggedIn: true});
                setBannerData({message: null, variant: null});
                navigate("/");
                return;
            }

            if(user.status === 400 || user.status === 404){
                setBannerData({message: "Invalid password or user doesn't exist. Please try again.", variant: "error"});
            }
            else if(user.status === 429){
                setBannerData({message: "Locked account due to too many failed login attempts. Please try again later.", variant: "error"});
                //navigate(".", {state: {paramMessage: "Locked account due to too many failed login attempts. Please try again later.", variant: "error"}});
            }
            else if(user.status === 503){
                setBannerData({message: "Account is still locked. Please try again later.", variant: "error"});
                //navigate(".", {state: {paramMessage: "Account is still locked. Please try again later.", variant: "error"}});
            }
            else if(user.status === 401) {
                setBannerData({message: "Please verify your account to log in.", variant: "error"});
            }
        } catch (e) {
            setBannerData({message: "Unable to find user with given information. Please try again or create a new user.", variant: "error"});
            //navigate(".", {state: {paramMessage: "Unable to find user with given information. Try again or create a new user.", variant: "error"}})
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
                    <Stack spacing={3}>
                        <form onSubmit={handleSubmit}>
                            <Stack spacing={5}>
                                <TextField
                                    id="email"
                                    label="Email"
                                    value={email}
                                    variant="standard"
                                    type="email"
                                    onChange={(event) => {
                                        setEmail(event.target.value);
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
                        <p style={{fontSize: "1rem", textAlign: "center", width: "auto"}}>
                            Don&apos;t have an account? <Button variant="secondary" aria-label="Sign Up" size="sm" onClick={handleSignUpClick}>Sign Up</Button>
                        </p>
                    </Stack>
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

