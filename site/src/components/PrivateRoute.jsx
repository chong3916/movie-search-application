import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import { Auth } from "../api/auth";

const PrivateRoute = ({ children, setBanner }) => {
    const userId = sessionStorage.getItem("user") ?? null;
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if(!userId) {
            setBanner({message: "Please login to use application.", variant: "danger"});
            navigate("/login");
        }
        else {
            handleAuthentication(userId);
        }
    }, []);

    const handleAuthentication = async (userId) => {
        console.log(userId);
        try {
            const validUser = await Auth.validateUserId(userId);
            if (!validUser) {
                sessionStorage.clear();
                //document.dispatchEvent(sessionStorageEvent);
                setBanner({message: "Please login to use application.", variant: "danger"});
                navigate("/login");
                return;
            }
            //document.dispatchEvent(sessionStorageEvent);
            setIsAuthenticated(true);
        } catch (e) {
            console.error(e);
        }
    }


    return (isAuthenticated ? children : null);
};

export default PrivateRoute;
