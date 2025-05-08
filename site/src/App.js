import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import SearchHome from "./pages/SearchHome";
import SearchResult from "./pages/SearchResult";
import LoginPage from "./pages/LoginPage"
import SignUpPage from "./pages/SignUpPage"
import "./styles/index.css";
import PrivateRoute from "./components/PrivateRoute";
import NavigationBar from "./components/NavigationBar";
import WatchlistPage from "./pages/WatchlistPage";
import CreateNewListPage from "./pages/CreateNewListPage";
import WatchlistMoviesPage from "./pages/WatchlistMoviesPage";
import EditListPage from "./pages/EditListPage";
import Footer from "./components/Footer";
import IdleTimerContainer from "./components/IdleTimerContainer";
import Montage from "./pages/Montage";
import {AuthContextProvider} from "./contexts/AuthContext";
import {SearchContextProvider} from "./contexts/SearchContext";
import {BannerContextProvider} from "./contexts/BannerContext";
import ErrorMessage from "./components/ErrorMessage";

function App() {
    // Define url paths for pages here. Dynamic links are defined using ":value"
    return (
        <div>
            <BannerContextProvider>
                <AuthContextProvider>
                    <SearchContextProvider>
                        <IdleTimerContainer />
                        <NavigationBar />
                        <Routes>
                            <Route path="/" element={<SearchHome />} />
                            <Route path="/search/:searchCategory?/:searchVal/:searchStartYear?/:searchEndYear?" component="{SearchResult}" element={<SearchResult />} />
                            <Route path="/watchlist/movies/public/:listId" component="{WatchlistMoviesPage}" element={<PrivateRoute ><WatchlistMoviesPage /></PrivateRoute>} />
                            <Route path="/watchlist/movies/private/:listId" component="{WatchlistMoviesPage}" element={<PrivateRoute ><WatchlistMoviesPage /></PrivateRoute>} />
                            <Route path="/watchlist/:listId/edit" component="{EditListPage}" element={<PrivateRoute ><EditListPage /></PrivateRoute>} />
                            <Route path="/montage/:listId" element={<PrivateRoute ><Montage/></PrivateRoute>}/>
                            <Route path="/watchlist/new" element={<PrivateRoute ><CreateNewListPage /></PrivateRoute>} />
                            <Route path="/user" element={<PrivateRoute ><WatchlistPage /></PrivateRoute>} />
                            <Route path="/signup" element={<SignUpPage />} />
                            <Route path="/login" element={<LoginPage />} />
                            <Route path="*" element={<Navigate to="/" replace />} />
                        </Routes>
                        <Footer/>
                    </SearchContextProvider>
                </AuthContextProvider>
            </BannerContextProvider>
        </div>
    );
}

export default App;
