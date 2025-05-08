import React, {useEffect, useRef, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import MovieBox from "../components/MovieBox";
import {Search} from "../api/search";
import {List} from "../api/list";
import {useBannerContext} from "../contexts/BannerContext";
import {useAuthContext} from "../contexts/AuthContext";

function SearchResult(){
    const navigate = useNavigate();
    const {authData} = useAuthContext();
    const userId = authData.uuid;
    let {searchVal, searchCategory, searchStartYear, searchEndYear} = useParams();
    const [numLoad, setNumLoad] = useState(10);
    const [watchlist, setWatchlist] = useState([]);
    const [lastPage, setLastPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [resultsArray, setResultsArray] = useState([]);
    const [resetVariables, setResetVariables] = useState(false);
    const initialRender = useRef(false);

    const { bannerData, setBannerData } = useBannerContext();

    useEffect(() => {
        setNumLoad(10);
        setResultsArray([]);
        setLastPage(0);
        setResetVariables(!resetVariables);
    }, [searchVal, searchCategory, searchStartYear, searchEndYear]);

    useEffect(() => {
        if(initialRender.current) {
            getSearch();
        }
        if(authData.uuid == null || authData.uuid.length > 0) { // If user is not logged in, just return
            initialRender.current = true;
            return
        }
        return () => {
            getUserLists();
            initialRender.current = true;
        };
    }, [resetVariables])


    const getKeywordSearch = async () => {
        try{
            const fetchResponse = await Search.getKeywordId(searchVal);

            if(fetchResponse.ok){
                const response = await fetchResponse.json();
                searchVal = response.results[0].id;
            }
            else{
                throw new Error("No results for keyword");
            }
        } catch(e){
            throw new Error("No results for keyword");
        }
    }

    const getUserLists = async () => {
        try {
            const response = await List.getByUserId(userId);
            setWatchlist(response);
        } catch (e) {
            setBannerData({message: "Error getting user watchlists", variant: "error"});
            navigate("/login");
        }
    }

    const getSearch = async () => {
        try {
            if (searchCategory === "keyword" || !searchCategory) {
                await getKeywordSearch();
            }

            const fetchResponse = await Search.getSearchResults(searchCategory, searchVal, searchStartYear, searchEndYear, lastPage);

            if(fetchResponse.ok){
                const response = await fetchResponse.json();
                setResultsArray([...resultsArray, ...response.results]);
                setLastPage(response.lastPage);
                setTotalPages(response.totalPages);
            }
            else{
                setBannerData({message: "No results for search term", variant: "error"});
            }
        } catch(e) {
            setBannerData({message: "No results for search term", variant: "error"});
        }
    }

    const handleLoadMore = () =>{
        setNumLoad(numLoad + 10);
        if(numLoad + 10 >= resultsArray.length && lastPage < totalPages){
            getSearch();
        }
    };

    return (
        <div>
            <div style={{display: "block", marginBottom: "50px"}}>
                {resultsArray.slice(0, numLoad).map((movieReq) =>
                    <MovieBox key={movieReq.movieId} {...movieReq} haveAddMovieButton={userId}
                              haveFreeTicketButton={userId}
                              haveSeeMovieListsButton={watchlist.length > 0} watchlist={watchlist}
                              handleUpdateWatchlist={getUserLists} />)}
                {(resultsArray.length > numLoad) ? <button id="loadMore" onClick={handleLoadMore} style={
                    {
                        backgroundColor: "#4287f5",
                        width: "10em",
                        height: "3em",
                        border: "none",
                        color: "white",
                        textAlign: "center",
                        textDecoration: "none",
                        fontWeight: "bold",
                        fontSize: "1em",
                        cursor: "pointer",
                        display: "block",
                        margin: "auto"
                    }
                }>LOAD MORE</button> : null}
            </div>
        </div>
    );
}

export default SearchResult;
