import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import { Auth } from "../api/auth";
import {useAuthContext} from "../contexts/AuthContext";
import {useBannerContext} from "../contexts/BannerContext";

const PrivateRoute = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();
    const {authData, setAuthData} = useAuthContext();
    const { bannerData, setBannerData } = useBannerContext();

    useEffect(() => {
        if(!authData.uuid) {
            setBannerData({message: "Please login to use application.", variant: "error"});
            navigate("/login");
        }
        else {
            handleAuthentication(authData.uuid);
        }
    }, []);

    const handleAuthentication = async (userId) => {
        try {
            const validUser = await Auth.validateUserId(userId);
            if (!validUser) {
                setAuthData({...authData, uuid: null, username: null, isLoggedIn: false});
                setBannerData({message: "Please login to use application.", variant: "error"});
                navigate("/login");
                return;
            }
            setIsAuthenticated(true);
        } catch (e) {
            console.error(e);
        }
    }


    return (isAuthenticated ? children : null);
};

export default PrivateRoute;
