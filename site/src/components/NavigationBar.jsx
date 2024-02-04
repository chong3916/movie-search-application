import React, {useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {
    Navbar,
    Nav,
    Container,
} from "react-bootstrap";
import "../styles/navBar.css";
import Searchbar from './Searchbar'
import ErrorMessage from "./ErrorMessage";
import {useAuthContext} from "../contexts/AuthContext";

const NavigationBar = ({ banner, setBanner }) => {
    const navigate = useNavigate();
    const { authData, setAuthData } = useAuthContext();

    useEffect(() => { // Get user info and movie list
        console.log(authData);
        document.documentElement.style.setProperty('--navbar-padding', "7rem");
        document.documentElement.style.setProperty('--navbar-mobile-padding', "6rem");
        if (banner.message) {
            document.documentElement.style.setProperty('--navbar-padding', "12rem");
            document.documentElement.style.setProperty('--navbar-mobile-padding', "12rem");
        }
    }, [banner.message, banner.variant]);

    const handleNavigationClick = (path) => {
        setBanner({message: null, variant: null});
        navigate(path);
    }

    const handleLogoutClick = () => {
        setAuthData({...authData, username: null, uuid: null, isLoggedIn: false});
        navigate("/login");
    }

    return (
        <Container style={{top: "0", position: "fixed", zIndex: "1", backgroundColor: "#f5f5f5"}} fluid>
            {banner.message ?
                <ErrorMessage banner={banner} setBanner={setBanner}/> : null}
            <Navbar bg="light" expand="lg">
                <Navbar.Brand id="navbarHome" className="movie-time-logo" onClick={() => handleNavigationClick("/")}>Movie Time</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                <Navbar.Collapse id="basic-navbar-nav">
                  <div className="custom-nav-wrapper">
                    <Nav className="me-auto">
                      {authData.isLoggedIn && (
                        <Nav.Link id="viewProfileLink" onClick={() => handleNavigationClick("/user")}>
                          View Profile
                        </Nav.Link>
                      )}
                      {!authData.isLoggedIn && (
                        <Nav.Link id="navbarLogin" onClick={() => handleNavigationClick("/login")}>
                          Login
                        </Nav.Link>
                      )}
                      {authData.isLoggedIn && (
                        <Nav.Link id="navbarLogout" onClick={() => handleLogoutClick()}>
                          Logout
                        </Nav.Link>
                      )}
                    </Nav>
                  </div>
                  <Searchbar setBanner={setBanner} />
                </Navbar.Collapse>
            </Navbar>
        </Container>
    );
};

export default NavigationBar;
