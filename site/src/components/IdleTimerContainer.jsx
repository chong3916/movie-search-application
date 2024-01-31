import React, {useEffect, useState} from "react";
import IdleTimer from "./IdleTimer";
import {useNavigate} from "react-router-dom";

const IdleTimerContainer = ({ sessionStorageEvent, setBanner }) => {
    const [isTimeout, setIsTimeout] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        document.addEventListener("sessionStorageEvent", () => {
            if (sessionStorage.getItem("user")) {
                setIsTimeout(false);
                setIsLoggedIn(true);
            } else {
                setIsLoggedIn(false);
            }
        })
        return () => {
            document.removeEventListener("sessionStorageEvent", sessionStorageEvent, false);
        }
    }, [])

    useEffect(() => {
        if(isTimeout){ handleLogout(); }
    }, [isTimeout])

    const handleLogout = () => {
        sessionStorage.clear();
        document.dispatchEvent(sessionStorageEvent);
        setBanner({message: "User timed out. Please login again", variant: "danger"});
        navigate("/");
    }

    return(
        <div style={{visibility: 'hidden' }}>
            <IdleTimer isLoggedIn={isLoggedIn} timeoutDuration={60}
                       onTimeout={() => setIsTimeout(true)} onExpired={() => setIsTimeout(true)}/>
        </div>
    );
}

export default IdleTimerContainer;
