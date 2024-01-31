import React from "react";
import {cleanup, render, screen, waitFor} from "@testing-library/react";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import MovieDetail from "./components/MovieDetail";
import MovieBox from "./components/MovieBox";

const props = { setBanner: jest.fn().mockResolvedValueOnce({message: null, variant: null})};

beforeEach(() => {
    window.sessionStorage.setItem("user","51234");
    fetch.resetMocks();
});

// Reset the browser history after each test
afterEach(() => {
    window.history.pushState(null, document.title, "/");
    cleanup();
});

test("movie details fetch works", async() => {
    const user = userEvent.setup();

    fetch.mockResponseOnce(JSON.stringify({uuid: "51234", username: "user", password: "test"}), { status: 200 })
        .mockResponseOnce(JSON.stringify([]))
        .mockResponseOnce(JSON.stringify({results: [{ backdropPath: "/test", cast: null, genres: null,
            movieId: "245891",
            overview: "",
            posterPath: "/fZPSd91yGE9fCcCe6OoQr6E3Bev.jpg",
            productionCompanies: null,
            releaseDate: "",
            title: "test",
            director: null
        }], totalResults: 1, lastPage: 1}))
        .mockResponseOnce(JSON.stringify({ backdropPath: "/test",
        cast: [{character: "testCharacter", knownForDepartment: "", name: "test", order: 0, personId: "",
        profilePath: "https://image.tmdb.org/t/p/w500/4D0PpNI0kmP58hgrwGC3wCjxhnm.jpg"}],
        genres: [{id: "1", name: "action"}, {id: "2", name: "thriller"}],
        movieId: "245891",
        overview: "overview",
        posterPath: "/fZPSd91yGE9fCcCe6OoQr6E3Bev.jpg",
        productionCompanies: [{name: "company", id: "1"}],
        releaseDate: "2022-01-01",
        title: "test",
        director: null
    }));

    render(<App />, { wrapper: BrowserRouter });

    const dropdown = screen.getByTestId('selectCategory');
    await waitFor(() => user.selectOptions(dropdown, "title"));
    await waitFor(() => user.type(screen.getByRole('textbox', {name: "searchTerm"}), "test"));
    await waitFor(() => user.click(screen.getByText(/submit/i)));

    await waitFor(() => user.click(screen.getAllByLabelText('movieDetailLink')[0]));
    expect(fetch).toHaveBeenCalledTimes(4);

    // Check if all components exist on page
    render(<MovieDetail {...props}/>, { wrapper: BrowserRouter });

    await waitFor(() => expect(screen.getByLabelText("moviePoster")).toBeInTheDocument()); // Check poster of movie is on page
    await waitFor(() => expect(screen.getByLabelText("profileImg")).toBeInTheDocument()); // Check profile image of actor is on page
    await waitFor(() => expect(screen.getAllByText(/test/i)[0]).toBeInTheDocument()); // Check movie title is on page
    await waitFor(() => expect(screen.getByText("overview")).toBeInTheDocument()); // Check movie overview is on page
    await waitFor(() => expect(screen.getByRole("listitem", {name: "releaseDate"})).toBeInTheDocument()); // Check movie release date is on page
    await waitFor(() => expect(screen.getByRole("listitem", {name: "genres"})).toBeInTheDocument()); // Check movie genres is on page

});

test("movie details fetch works with no genres, release date, backdrop image, poster image, and profile image", async() => {
    const user = userEvent.setup();

    fetch.mockResponseOnce(JSON.stringify({uuid: "51234", username: "user", password: "test"}), { status: 200 })
        .mockResponseOnce(JSON.stringify([]))
        .mockResponseOnce(JSON.stringify({results: [{ backdropPath: null, cast: null, genres: null,
            movieId: "245891",
            overview: "",
            posterPath: "/fZPSd91yGE9fCcCe6OoQr6E3Bev.jpg",
            productionCompanies: null,
            releaseDate: "",
            title: "test"
        }], totalResults: 1}))
        .mockResponseOnce(JSON.stringify({ backdropPath: null,
        cast: [{character: "test", knownForDepartment: "", name: "test", order: 0, personId: "", profilePath: null}],
        genres: null,
        movieId: "245891",
        overview: "overview",
        posterPath: null,
        productionCompanies: null,
        releaseDate: null,
        title: "test",
        director: {name: "director"}
    }));

    render(<App />, { wrapper: BrowserRouter });

    const dropdown = screen.getByTestId('selectCategory');
    await waitFor(() => user.selectOptions(dropdown, "title"));
    await waitFor(() => user.type(screen.getByRole('textbox', {name: "searchTerm"}), "test"));
    await waitFor(() => user.click(screen.getByText(/submit/i)));
    await waitFor(() => user.click(screen.getAllByLabelText('movieDetailLink')[0]));
    expect(fetch).toHaveBeenCalledTimes(4);
});

test("fetching fails on the movie details page with no connection", async() => {
    const user = userEvent.setup();

    fetch.mockResponseOnce(JSON.stringify({uuid: "51234", username: "user", password: "test"}), { status: 200 })
        .mockResponseOnce(JSON.stringify([]))
        .mockResponseOnce(JSON.stringify({results: [{ backdropPath: "/test", cast: null, genres: null,
            movieId: "245891",
            overview: "",
            posterPath: "/fZPSd91yGE9fCcCe6OoQr6E3Bev.jpg",
            productionCompanies: null,
            releaseDate: "",
            title: "test"
        }], totalResults: 1}))
        .mockRejectOnce(new Error("API is down"));

    render(<App />, { wrapper: BrowserRouter });

    const dropdown = screen.getByTestId('selectCategory');
    await waitFor(() => user.selectOptions(dropdown, "title"));
    await waitFor(() => user.type(screen.getByRole('textbox', {name: "searchTerm"}), "test"));
    await waitFor(() => user.click(screen.getByText(/submit/i)));
    await waitFor(() => user.click(screen.getAllByLabelText('movieDetailLink')[0]));
    expect(fetch).toHaveBeenCalledTimes(4);
});

test("fetching fails on the movie details page with malformed API response", async() => {
    const user = userEvent.setup();

    fetch.mockResponseOnce(JSON.stringify({uuid: "51234", username: "user", password: "test"}), { status: 200 })
        .mockResponseOnce(JSON.stringify([]))
        .mockResponseOnce(JSON.stringify({results: [{ backdropPath: "/test", cast: null, genres: null,
            movieId: "245891",
            overview: "",
            posterPath: "/fZPSd91yGE9fCcCe6OoQr6E3Bev.jpg",
            productionCompanies: null,
            releaseDate: "",
            title: "test"
        }], totalResults: 1})).mockResponseOnce(JSON.stringify(null));

    render(<App />, { wrapper: BrowserRouter });

    const dropdown = screen.getByTestId('selectCategory');
    await waitFor(() => user.selectOptions(dropdown, "title"));
    await waitFor(() => user.type(screen.getByRole('textbox', {name: "searchTerm"}), "test"));
    await waitFor(() => user.click(screen.getByText(/submit/i))); // first time fetch is called
    await waitFor(() => user.click(screen.getAllByLabelText('movieDetailLink')[0])); // second time fetch is called

    expect(fetch).toHaveBeenCalledTimes(4); // Check that fetch has been called twice
});

test("search by clicking on genre in movie details works", async() => {
    const user = userEvent.setup();

    fetch.mockResponseOnce(JSON.stringify({ backdropPath: "/test", cast: null, genres: [{id: 1, name: "action"}],
        movieId: "245891",
        overview: "",
        posterPath: "/fZPSd91yGE9fCcCe6OoQr6E3Bev.jpg",
        productionCompanies: null,
        releaseDate: "",
        title: "test"
    }));

    render(<MovieBox {...props} />, { wrapper: BrowserRouter });

    await waitFor(() => user.click(screen.getAllByLabelText('movieDetailLink')[0]));
    await waitFor(() => user.click(screen.getByLabelText('genreactionLink')));

    expect(fetch).toHaveBeenCalledTimes(1); // Check that fetch has been called twice
});

test("search by clicking on actor name in movie details works", async() => {
    const user = userEvent.setup();

    fetch.mockResponseOnce(JSON.stringify({ backdropPath: "/test",
        cast: [{order: 1, name: "test", profilePath: null, character: "character"}],
        genres: null,
        movieId: "245891",
        overview: "",
        posterPath: "/fZPSd91yGE9fCcCe6OoQr6E3Bev.jpg",
        productionCompanies: null,
        releaseDate: "",
        title: "test"
    }));

    render(<MovieBox {...props} />, { wrapper: BrowserRouter });

    await waitFor(() => user.click(screen.getAllByLabelText('movieDetailLink')[0]));
    await waitFor(() => user.click(screen.getByLabelText('actorLink')));

    expect(fetch).toHaveBeenCalledTimes(1); // Check that fetch has been called twice
});
