import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import { Auth } from "../api/auth";
import {useAuthContext} from "../contexts/AuthContext";

const PrivateRoute = ({ children, setBanner }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();
    const {authData, setAuthData} = useAuthContext();

    useEffect(() => {
        if(!authData.uuid) {
            setBanner({message: "Please login to use application.", variant: "danger"});
            navigate("/login");
        }
        else {
            handleAuthentication(authData.uuid);
        }
    }, []);

    const handleAuthentication = async (userId) => {
        console.log(userId);
        try {
            const validUser = await Auth.validateUserId(userId);
            if (!validUser) {
                setAuthData({...authData, uuid: null, username: null, isLoggedIn: false});
                setBanner({message: "Please login to use application.", variant: "danger"});
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
