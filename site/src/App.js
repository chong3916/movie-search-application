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

function App() {
    const sessionStorageEvent = new Event("sessionStorageEvent");
    const [banner, setBanner] = React.useState({bannerMessage: null, variant: null});

    // Define url paths for pages here. Dynamic links are defined using ":value"
    return (
        <div>
            <IdleTimerContainer sessionStorageEvent={sessionStorageEvent} setBanner={setBanner}/>
            <NavigationBar sessionStorageEvent={sessionStorageEvent} setBanner={setBanner} banner={banner}/>
            <Routes>
                <Route path="/" element={<SearchHome />} />
                <Route path="/search/:searchCategory?/:searchVal/:searchStartYear?/:searchEndYear?" component="{SearchResult}" element={<PrivateRoute sessionStorageEvent={sessionStorageEvent} setBanner={setBanner}><SearchResult setBanner={setBanner}/></PrivateRoute>} />
                <Route path="/watchlist/movies/public/:listId" component="{WatchlistMoviesPage}" element={<PrivateRoute sessionStorageEvent={sessionStorageEvent} setBanner={setBanner}><WatchlistMoviesPage setBanner={setBanner}/></PrivateRoute>} />
                <Route path="/watchlist/movies/private/:listId" component="{WatchlistMoviesPage}" element={<PrivateRoute sessionStorageEvent={sessionStorageEvent} setBanner={setBanner}><WatchlistMoviesPage setBanner={setBanner}/></PrivateRoute>} />
                <Route path="/watchlist/:listId/edit" component="{EditListPage}" element={<PrivateRoute sessionStorageEvent={sessionStorageEvent} setBanner={setBanner}><EditListPage setBanner={setBanner}/></PrivateRoute>} />
                <Route path="/montage/:listId" element={<PrivateRoute sessionStorageEvent={sessionStorageEvent} setBanner={setBanner}><Montage/></PrivateRoute>}/>
                <Route path="/watchlist/new" element={<PrivateRoute sessionStorageEvent={sessionStorageEvent} setBanner={setBanner}><CreateNewListPage setBanner={setBanner}/></PrivateRoute>} />
                <Route path="/user" element={<PrivateRoute sessionStorageEvent={sessionStorageEvent} setBanner={setBanner}><WatchlistPage setBanner={setBanner}/></PrivateRoute>} />
                <Route path="/signup" element={<SignUpPage sessionStorageEvent={sessionStorageEvent} setBanner={setBanner}/>} />
                <Route path="/login" element={<LoginPage sessionStorageEvent={sessionStorageEvent} setBanner={setBanner}/>} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            <Footer/>
        </div>
    );
}

export default App;
