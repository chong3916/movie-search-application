const getKeywordId = async (searchVal) => {
    const response = await fetch("/api/search/keyword/" + searchVal, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        },
    });

    return response;
}

const getSearchResults = async (searchCategory, searchVal, searchStartYear, searchEndYear, lastPage) => {
    const response = await fetch("/api/search/" + searchCategory + "/" + searchVal + "/" + searchStartYear + "/" + searchEndYear + "/" + lastPage,
        {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                },
            });

    return response;
}

export const Search = {
    getKeywordId,
    getSearchResults
}
