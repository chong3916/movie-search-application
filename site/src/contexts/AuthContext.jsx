import React from "react"

export const AuthContext = React.createContext(null);

export const AuthContextProvider = ({ children }) => {
    const [authData, setAuthData] = React.useState({
        isLoggedIn: false,
        username: null,
        uuid: null,
        accessLevel: -2
    });

    const contextValue = {
        authData,
        setAuthData
    }

    return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
}

export const useAuthContext = () => {
    const context = React.useContext(AuthContext);
    if (context === undefined || context == null) {
        throw new Error('useAuthContext must be used within a AuthContextProvider');
    }
    return context;
};