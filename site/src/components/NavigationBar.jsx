import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import "../styles/navBar.css";
import Searchbar from './Searchbar'
import ErrorMessage from "./ErrorMessage";
import {useAuthContext} from "../contexts/AuthContext";
import {AppBar, Box, CssBaseline, Drawer, IconButton, Stack, Toolbar, Typography, useMediaQuery} from "@mui/material";
import Button from '@mui/material/Button';
import SearchIcon from "@mui/icons-material/Search";
import MenuIcon from "@mui/icons-material/Menu";
import {useBannerContext} from "../contexts/BannerContext";


const NavigationBar = () => {
    const navigate = useNavigate();
    const { authData, setAuthData } = useAuthContext();
    const { bannerData, setBannerData } = useBannerContext();

    const matches = useMediaQuery('(min-width:800px)');
    const { showSearchBar, setShowSearchBar } = useState(false);

    const handleNavigationClick = (path) => {
        setBannerData({message: null, variant: null});
        navigate(path);
    }

    const handleLogoutClick = () => {
        setAuthData({...authData, username: null, uuid: null, isLoggedIn: false});
        navigate("/login");
    }

    const handleDrawerToggle = () => {
    }

    return (
        <div style={{ marginBottom: '1rem' }}>
            {bannerData.message && bannerData.message.length > 0 ?
                <Box sx={{ width: '100%' }}>
                    <ErrorMessage />
                </Box> : null}
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                <AppBar component="nav" position="static">
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
                                <Searchbar/>}
                            {authData.isLoggedIn ? <Button
                                    onClick={() => handleNavigationClick("/user")}
                                    sx={{my: 2, color: 'white', pointerEvents: 'auto'}} disableRipple>
                                    Watchlist
                                </Button> : null}
                            {!authData.isLoggedIn ?
                                <Button
                                    onClick={() => handleNavigationClick("/login")}
                                    sx={{my: 2, color: 'white', pointerEvents: 'auto'}} disableRipple>
                                    Login
                                </Button> :
                                <Button
                                    onClick={() => handleLogoutClick()}
                                    sx={{my: 2, color: 'white', pointerEvents: 'auto'}} disableRipple>
                                    Logout
                                </Button>
                            }
                        </Box>
                    </Toolbar>
                </AppBar>
            </Box>
        </div>
    );
};

export default NavigationBar;
