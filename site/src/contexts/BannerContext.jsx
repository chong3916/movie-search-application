import React from "react"

export const BannerContext = React.createContext(null);

export const BannerContextProvider = ({ children }) => {
    const [bannerData, setBannerData] = React.useState({
        message: null,
        variant: ""
    });

    const contextValue = {
        bannerData,
        setBannerData
    }

    return <BannerContext.Provider value={contextValue}>{children}</BannerContext.Provider>
}

export const useBannerContext = () => {
    const context = React.useContext(BannerContext);
    if (context === undefined || context == null) {
        throw new Error('useBannerContext must be used within a BannerContextProvider');
    }
    return context;
};