import React from 'react';

// Return random number between [-45,45]
const randomRotationDegrees = () => Math.random() * 91 - 45;

const MontageImages = ({imageUrls}) => {
    return (
        <div style={gridStyle}>
            {
                imageUrls.map((image, idx) => (
                    <img alt="Movie Image" style={{...imgStyle, transform: `rotate(${randomRotationDegrees()}deg)`}} src={image} key={idx}/>
                    )) 
                }
        </div>
    )
}

const gridStyle = {
    width: '80%',
    display: 'grid',
    // fit as many columns as possible on page
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' 
}

const imgStyle = {
    transformOrigin: 'center',
    transition: '1s ease-in-out',
    objectFit: 'cover',
    width: '250px',
    height: '250px',
    outline: '.5rem solid #fff'
}

export default MontageImages;