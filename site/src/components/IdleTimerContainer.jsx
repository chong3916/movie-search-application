import React, {useEffect, useState} from "react";
import IdleTimer from "./IdleTimer";
import {useNavigate} from "react-router-dom";
import {useAuthContext} from "../contexts/AuthContext";

const IdleTimerContainer = ({ setBanner }) => {
    const [isTimeout, setIsTimeout] = useState(false);
    const navigate = useNavigate();
    const {authData, setAuthData} = useAuthContext();

    useEffect(() => {
        if(isTimeout){ handleLogout(); }
    }, [isTimeout])

    const handleLogout = () => {
        setAuthData({...authData, uuid: null, username: null, isLoggedIn: false});
        setBanner({message: "User timed out. Please login again", variant: "danger"});
        navigate("/");
    }

    return(
        <div style={{visibility: 'hidden' }}>
            <IdleTimer isLoggedIn={authData.isLoggedIn} timeoutDuration={60}
                       onTimeout={() => setIsTimeout(true)} onExpired={() => setIsTimeout(true)}/>
        </div>
    );
}

export default IdleTimerContainer;
