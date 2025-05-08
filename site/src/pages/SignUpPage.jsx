import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import { Auth } from "../api/auth";
import Input from '../components/Input';
import Button from "react-bootstrap/Button";
import "../styles/loginPage.css";
import {useAuthContext} from "../contexts/AuthContext";
import {Card, Container, CardContent, Stack, TextField, Typography} from "@mui/material";
import {useBannerContext} from "../contexts/BannerContext";

function SignUpPage() {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const {authData, setAuthData} = useAuthContext();
    const navigate = useNavigate();

    const { bannerData, setBannerData } = useBannerContext();

    const handleLoginClick = () => {
        setBannerData({message: null, variant: null});
        navigate("/login");
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (password !== confirmPassword) {
            setBannerData({message: "Confirm password does not match password entered. Please try again", variant: "error"});
            //navigate(".", {state: {paramMessage: "Confirm password does not match password entered. Please try again", variant: "error"}})
            setPassword(""); // Reset password field
            setConfirmPassword(""); // Reset confirm password field
            return;
        }
        else if(!email.includes("@")) {
            setBannerData({message: "Please enter a valid email.", variant: "error"});
            setEmail("");
            return
        }
        
        try{ 
            const response = await Auth.signup(username, password, email);
            if(response.ok) {
                setBannerData({message: "Sign up successful. Please check email for verification.", variant: "success"});
                navigate("/");
            }
            //setAuthData({...authData, uuid: user.uuid, username: user.username, isLoggedIn: true});
            else {
                setBannerData({message: "User already exists. Please login or sign up with different user info.", variant: "error"});
            }
        } catch (e) {
            setBannerData({message: "Unable to sign up. Please try again.", variant: "error"});
            //navigate(".", {state: {paramMessage: "User already exists. Please login or sign up with different user info.", variant: "error"}})
            console.error(e);
        }
    };

    return (
        <Container maxWidth="sm">
            <Card style={{margin: "3rem"}}>
                <CardContent style={{margin: "2rem"}}>
                    <Typography variant="h3" component="div" align="center">
                        Create a New Account
                    </Typography>
                    <Stack spacing={3}>
                        <form onSubmit={handleSubmit}>
                            <Stack spacing={5}>
                                <TextField
                                    id="email"
                                    label="Email"
                                    value={email}
                                    variant="standard"
                                    onChange={(event) => {
                                        setEmail(event.target.value);
                                    }}
                                />
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
                                <TextField
                                    id="confirmPassword"
                                    label="Confirm Password"
                                    value={confirmPassword}
                                    variant="standard"
                                    type="password"
                                    onChange={(event) => {
                                        setConfirmPassword(event.target.value);
                                    }}
                                />
                                <Button type="submit" aria-label="submit" id="submit">SIGN UP</Button>
                            </Stack>
                        </form>
                        <p style={{fontSize: "1rem", textAlign: "center", width: "auto"}}>
                            Already have an account? <Button variant="secondary" aria-label="Login" size="sm" onClick={handleLoginClick}>Login</Button>
                        </p>
                    </Stack>
                </CardContent>
            </Card>
        </Container>
        // <Container>
        //     <Container fluid style={{padding: "1rem"}}>
        //         <Row className="justify-content-md-center">
        //             <h1 style={{textAlign: "center"}}>Welcome to Movie Search!</h1>
        //         </Row>
        //         <Row className="justify-content-md-center">
        //             <h2 style={{textAlign: "center"}}>Create a New Account</h2>
        //         </Row>
        //         <Row className="justify-content-md-center">
        //             <p style={{textAlign: "center"}}>
        //                 Create a username, email, and password below to find your favorite movies and actors.</p>
        //         </Row>
        //     </Container>
        //     <Container aria-label="signUpFormContainer" className="SignUpFormContainer">
        //         <Form onSubmit={handleSubmit} style={{padding: "1rem", width: "auto"}}>
        //             <Input
        //                 value={username}
        //                 onChange={(event) => setUsername(event.target.value)}
        //                 type={"text"}
        //                 id={"username"}
        //                 displayLabel={"Username "}
        //             />
        //             <Input
        //                 value={password}
        //                 onChange={(event) => setPassword(event.target.value)}
        //                 type={"password"}
        //                 id={"password"}
        //                 displayLabel={"Password "}
        //             />
        //             <Input
        //                 value={confirmPassword}
        //                 onChange={(event) => setConfirmPassword(event.target.value)}
        //                 type={"password"}
        //                 id={"confirmPassword"}
        //                 displayLabel={"Confirm Password "}
        //             />
        //             <Row className="justify-content-md-center" md={2}>
        //                 <Col xs sm="auto" style={{display: "flex", justifyContent: "center"}}>
        //                     <Button type="submit" aria-label="submit" id="submitSignUp">Sign Up</Button>
        //                 </Col>
        //             </Row>
        //         </Form>
        //         <Row className="justify-content-md-center" md={2}>
        //             <p style={{fontSize: "1rem", textAlign: "center", width: "auto"}}>
        //                 Already have an account? <Button variant="secondary" aria-label="Login" size="sm" onClick={handleLoginClick}>Login</Button>
        //             </p>
        //         </Row>
        //     </Container>
        // </Container>
    );
}

export default SignUpPage;
