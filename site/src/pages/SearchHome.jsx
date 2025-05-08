import React, {useEffect} from "react";
import {useLocation} from "react-router-dom";
import {useBannerContext} from "../contexts/BannerContext";

function SearchHome(){
    const query = new URLSearchParams(useLocation().search);
    const verified = query.get("verified");

    const { bannerData, setBannerData } = useBannerContext();

    useEffect(() => {
        if (verified === "success") {
            setBannerData({message: "Your email has been successfully verified!", variant: "success"});
        } else if (verified === "failure") {
            setBannerData({message: "Verification failed.", variant: "error"});
        }
    }, [verified]);

    return (
        <div>
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                        <h1>Welcome to movietime!</h1>
                        <p>Please use the search bar above to find your favorite movies and actors</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SearchHome;