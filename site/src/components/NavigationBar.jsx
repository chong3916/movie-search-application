import React, {useEffect, useState} from "react";
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
import {AppBar, Box, CssBaseline, Drawer, IconButton, Toolbar, Typography, useMediaQuery} from "@mui/material";
import Button from '@mui/material/Button';
import SearchIcon from "@mui/icons-material/Search";
import * as PropTypes from "prop-types";
import MenuIcon from "@mui/icons-material/Menu";


const NavigationBar = ({ banner, setBanner }) => {
    const navigate = useNavigate();
    const { authData, setAuthData } = useAuthContext();
    const matches = useMediaQuery('(min-width:800px)');
    const { showSearchBar, setShowSearchBar } = useState(false);

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

    const handleDrawerToggle = () => {
    }

    /*
    return (
        <Container style={{top: "0", position: "fixed", zIndex: "1", backgroundColor: "#f5f5f5"}} fluid>
            {banner.message ?
                <ErrorMessage banner={banner} setBanner={setBanner}/> : null}
            <Navbar bg="light" expand="lg">
                {!showSearchBar ?
                    <Navbar.Brand id="navbarHome" className="movie-time-logo"
                                  onClick={() => handleNavigationClick("/")}>Movie
                        Time</Navbar.Brand>
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
                {!matches ?
                    <IconButton sx={{p: '10px'}} aria-label="menu" onClick={() => setShowSearchBar(true)}>
                        <SearchIcon/>
                    </IconButton> :
                    <Searchbar setBanner={setBanner}/>
                }
                : <Searchbar setBanner={setBanner}/>}
            </Navbar>
        </Container>
    );

     */

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar component="nav" sx={{ pointerEvents: 'none' }}>
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { sm: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Box  sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}>
                        <Button
                            sx={{ pointerEvents: 'auto' }}
                            onClick={() => handleNavigationClick("/")}>
                            <Typography variant="h6"
                                        component="div"
                                        sx={{
                                            color: 'white',
                                            fontFamily: 'monospace',
                                            fontWeight: 700,
                                            letterSpacing: '.3rem'
                                        }}>
                                Movie Time
                            </Typography>
                        </Button>
                    </Box>
                    <Box sx={{ display: { xs: 'none', sm: 'contents' } }}>
                        {!matches ?
                            <IconButton sx={{p: '10px', pointerEvents: 'auto'}} aria-label="menu" onClick={() => setShowSearchBar(true)}>
                                <SearchIcon/>
                            </IconButton> :
                            <Searchbar setBanner={setBanner}/>}
                        <Button
                            onClick={() => handleNavigationClick("/user")}
                            sx={{my: 2, color: 'white', pointerEvents: 'auto'}}>
                            Watchlist
                        </Button>
                        {!authData.isLoggedIn ?
                            <Button
                                onClick={() => handleNavigationClick("/login")}
                                sx={{my: 2, color: 'white', pointerEvents: 'auto'}}>
                                Login
                            </Button> :
                            <Button
                                onClick={() => handleLogoutClick()}
                                sx={{my: 2, color: 'white', pointerEvents: 'auto'}}>
                                Logout
                            </Button>
                        }
                    </Box>
                </Toolbar>
            </AppBar>
        </Box>
    );
    /*
    return(
    <nav>
                <Drawer
                    container={container}
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                    }}
                    sx={{
                        display: { xs: 'block', sm: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                >
                    {drawer}
                </Drawer>
            </nav>



        <Button
                        onClick={() => handleNavigationClick("/")}>
                        <Typography variant="h6"
                                    component="div"
                                    sx={{
                                        flexGrow: 1,
                                        display: { xs: 'none', sm: 'block' },
                                        fontFamily: 'monospace',
                                        fontWeight: 700,
                                        letterSpacing: '.3rem'
                                    }}>
                            Movie Time
                        </Typography>
                    </Button>

        <Box sx={{display: 'flex'}}>
            <AppBar component="nav">
                <Toolbar disableGutters>
                    <Button
                        onClick={() => handleNavigationClick("/")}
                        sx={{my: 2, color: 'white', display: 'block'}}>
                        <Typography variant="h6"
                                    sx={{
                                        fontFamily: 'monospace',
                                        fontWeight: 700,
                                        letterSpacing: '.3rem'
                                    }}>
                            Movie Time
                        </Typography>
                    </Button>
                    <Box sx={{ display: { xs: 'none', sm: 'block' } }} id="searchBarContents">
                        {!matches ?
                            <IconButton sx={{p: '10px'}} aria-label="menu" onClick={() => setShowSearchBar(true)}>
                                <SearchIcon/>
                            </IconButton> :
                            <Searchbar setBanner={setBanner}/>}
                        {!authData.isLoggedIn ?
                            <Button
                                onClick={() => handleNavigationClick("/login")}
                                sx={{my: 2, color: 'white', display: 'block'}}>
                                Login
                            </Button> :
                            <Button
                                onClick={() => handleLogoutClick()}
                                sx={{my: 2, color: 'white', display: 'block'}}>
                                Logout
                            </Button>
                        }
                    </Box>
                </Toolbar>
            </AppBar>
        </Box>
    );*/
};

export default NavigationBar;
