import React from "react"

export const SearchContext = React.createContext(null);

export const SearchContextProvider = ({ children }) => {
    const [searchData, setSearchData] = React.useState({
        searchTerm: "",
        searchCategory: "keyword",
        startYear: "",
        endYear: ""
    });

    const contextValue = {
        searchData,
        setSearchData
    }

    return <SearchContext.Provider value={contextValue}>{children}</SearchContext.Provider>
}

export const useSearchContext = () => {
    const context = React.useContext(SearchContext);
    if (context === undefined || context == null) {
        throw new Error('useSearchContext must be used within a SearchContextProvider');
    }
    return context;
};