import {useCallback, useEffect} from "react";

const IdleTimer = ({ timeoutDuration, isLoggedIn, onTimeout, onExpired }) => {
    const events = ['click', 'scroll', 'keydown', 'load', 'touchmove', 'touchstart']; // Events to listen to for activity
    let timer;
    let timeoutTracker;
    let eventHandler;

    useEffect(() => {
        if (isLoggedIn) {
            const timeoutTime = parseInt(sessionStorage.getItem("timeoutTime") || 0, 10);

            if (timeoutTime > 0 && timeoutTime < Date.now()) {
                cleanupTimer();
                onExpired();
                return;
            }

            eventHandler = () => {
                updateTimeoutTime()
            };

            events.forEach((event) => {
                window.addEventListener(event, eventHandler)
            });
            startTimer();
        }

        return (() => {
            cleanupTimer();
            events.forEach((event) => {
                window.removeEventListener(event, eventHandler)
            });
        })
    }, [isLoggedIn]);

    const updateTimeoutTime = useCallback(() => {
        if (timeoutTracker) {
            clearTimeout(timeoutTracker);
        }
        timeoutTracker = setTimeout(() => {
            sessionStorage.setItem("timeoutTime", JSON.stringify(Date.now() + timeoutDuration * 1000));
        }, 300);
    }, []);

    const startTimer = () => {
        updateTimeoutTime();

        timer = setInterval(() => {
            const timeoutTime = parseInt(sessionStorage.getItem("timeoutTime") || 0, 10);
            if (timeoutTime < Date.now()) { // current time passed timeoutTime
                onTimeout();
                cleanupTimer();
            }
        }, 1000); // Checks every second to see if time has passed

    }

    const cleanupTimer = () => {
        clearTimeout(timeoutTracker);
        clearInterval(timer);
    }
};

export default IdleTimer;
