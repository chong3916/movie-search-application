import React from "react";
import Alert from '@mui/material/Alert';
import {useBannerContext} from "../contexts/BannerContext";

const ErrorMessage = () =>{
    const { bannerData, setBannerData } = useBannerContext();
    return(
        <Alert aria-label="errorAlert" id="errorAlert" severity={bannerData.variant} onClose={() => setBannerData({message: null, variant: null})} dismissible>
            <p style={{textAlign: "center"}}>{bannerData.message}</p>
        </Alert>
    );
}

export default ErrorMessage;