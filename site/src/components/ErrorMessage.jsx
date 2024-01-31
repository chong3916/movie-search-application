import React from "react";
import {Alert} from "react-bootstrap";
const ErrorMessage = ({banner, setBanner}) =>{
    return(
        <Alert aria-label="errorAlert" id="errorAlert" variant={banner.variant} onClose={() => setBanner({message: null, variant: null})} dismissible>
            <p style={{textAlign: "center"}}>{banner.message}</p>
        </Alert>
    );
}

export default ErrorMessage;