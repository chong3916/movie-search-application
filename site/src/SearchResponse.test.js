import React from "react";
import {cleanup, render, screen, waitFor} from "@testing-library/react";
import App from "./App";
import {BrowserRouter} from "react-router-dom";
import userEvent from "@testing-library/user-event";
import CreateNewListPage from "./pages/CreateNewListPage";

const props = { setBanner: jest.fn().mockResolvedValueOnce({message: null, variant: null})};

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useLocation: () => ({
        state: { movieIds: ["56789"] }
    }),
}));

beforeEach(() => {
    fetch.resetMocks();
    jest.clearAllMocks();
    window.sessionStorage.setItem("user","51234");
    //sessionStorage.clear();
});

// Reset the browser history after each test
afterEach(() => {
    window.history.pushState(null, document.title, "/");
    cleanup();
});

test("search with invalid search term", async() => {
    const user = userEvent.setup();
    render(<App />, { wrapper: BrowserRouter }); // Render App first

    const dropdown = screen.getByTestId('selectCategory');
    await waitFor(() => user.selectOptions(dropdown, "title"));
    await waitFor(() => user.type(screen.getByRole('textbox', {name: "searchTerm"}), "   ")); // When able to find text box after App is rendered, type nothing
    await waitFor(() => user.click(screen.getByText(/submit/i)));
    expect(fetch).toHaveBeenCalledTimes(0); // Check that fetch was called once
});

test("search by actor results fetch works with movie details", async() => {
    const user = userEvent.setup();

    fetch.mockResponseOnce(JSON.stringify({uuid: "51234", username: "user", password: "test"}), { status: 200 })
        .mockResponseOnce(JSON.stringify([]))
        .mockResponseOnce(JSON.stringify({results: [{ backdropPath: "/test", cast: null, genres: null,
            movieId: "12345",
            overview: "",
            posterPath: "/fZPSd91yGE9fCcCe6OoQr6E3Bev.jpg",
            productionCompanies: null,
            releaseDate: "",
            title: "test"
        }], totalResults: 1, totalPages: 1}));

    render(<App />, { wrapper: BrowserRouter }); // Render App first

    const dropdown = screen.getByTestId('selectCategory');
    await waitFor(() => user.selectOptions(dropdown, "actor"));
    await waitFor(() => user.type(screen.getByRole('textbox', {name: "searchTerm"}), "test")); // When able to find text box after App is rendered, type 'john wick'
    await waitFor(() => user.click(screen.getByText(/submit/i)));

    fetch.mockResponseOnce(JSON.stringify({ backdropPath: "/test", cast: null, genres: null,
        movieId: "12345",
        overview: "",
        posterPath: "/fZPSd91yGE9fCcCe6OoQr6E3Bev.jpg",
        productionCompanies: null,
        releaseDate: "",
        title: "test"
    }));
    await waitFor(() => user.click(screen.getAllByLabelText('movieDetailLink')[0]));

    expect(fetch).toHaveBeenCalledTimes(4); // Check that fetch was called once
});

test("search by title results fetch with details work", async() => {
    const user = userEvent.setup();

    fetch.mockResponseOnce(JSON.stringify({uuid: "51234", username: "user", password: "test"}), { status: 200 })
        .mockResponseOnce(JSON.stringify([]))
        .mockResponseOnce(JSON.stringify({results: [{ backdropPath: "/test", cast: null, genres: null,
            movieId: "12345",
            overview: "",
            posterPath: "/fZPSd91yGE9fCcCe6OoQr6E3Bev.jpg",
            productionCompanies: null,
            releaseDate: "",
            title: "test"
        }], totalResults: 1, totalPages: 1}))
        .mockResponseOnce(JSON.stringify({ backdropPath: "/test", cast: null, genres: null,
            movieId: "12345",
            overview: "",
            posterPath: "/fZPSd91yGE9fCcCe6OoQr6E3Bev.jpg",
            productionCompanies: null,
            releaseDate: "",
            title: "test",
            director: {name: "director"}
        }));

    render(<App />, { wrapper: BrowserRouter }); // Render App first

    const dropdown = screen.getByTestId('selectCategory');
    await waitFor(() => user.selectOptions(dropdown, "title"));

    await waitFor(() => user.type(screen.getByRole('textbox', {name: "searchTerm"}), "title")); // When able to find text box after App is rendered, type 'john wick'
    await waitFor(() => user.click(screen.getByText(/submit/i)));
    await waitFor(() => user.click(screen.getAllByLabelText('movieDetailLink')[0]));

    expect(fetch).toHaveBeenCalledTimes(4); // Check that fetch was called once
});

test("search results fetch works with start year filter", async() => {
    const user = userEvent.setup();

    fetch.mockResponseOnce(JSON.stringify({uuid: "51234", username: "user", password: "test"}), { status: 200 })
        .mockResponseOnce(JSON.stringify([]))
        .mockResponseOnce(JSON.stringify({results: [{ backdropPath: "/test", cast: null, genres: null,
            movieId: "12345",
            overview: "",
            posterPath: "/fZPSd91yGE9fCcCe6OoQr6E3Bev.jpg",
            productionCompanies: null,
            releaseDate: "2022-01-01",
            title: "test"
        }], totalResults: 1, totalPages: 1}))
        .mockResponseOnce(JSON.stringify({ backdropPath: "/test",
            cast: [{character: "test character", knownForDepartment: "", name: "test actor", order: 0, personId: "", profilePath: null}],
            genres: null,
            movieId: "12345",
            overview: "",
            posterPath: "/fZPSd91yGE9fCcCe6OoQr6E3Bev.jpg",
            productionCompanies: null,
            releaseDate: "2022-01-01",
            title: "test",
            director: null
        }));

    render(<App />, { wrapper: BrowserRouter });

    const dropdown = screen.getByTestId('selectCategory');
    await waitFor(() => user.selectOptions(dropdown, "title"));
    await waitFor(() => user.type(screen.getByRole('textbox', {name: "searchTerm"}), "john wick"));
    await waitFor(() => user.click(screen.getByText(/filter/i)));
    await waitFor(() => user.type(screen.getByLabelText("yearStartFilter"), "2020"));
    await waitFor(() => user.click(screen.getByText(/submit/i)));
    await waitFor(() => user.click(screen.getAllByLabelText('movieDetailLink')[0]));

    expect(fetch).toHaveBeenCalledTimes(4);
});

test("search results fetch works with end year filter", async() => {
    const user = userEvent.setup();

    fetch.mockResponseOnce(JSON.stringify({uuid: "51234", username: "user", password: "test"}), { status: 200 })
        .mockResponseOnce(JSON.stringify([]))
        .mockResponseOnce(JSON.stringify({results: [{ backdropPath: "/test", cast: null, genres: null,
            movieId: "12345",
            overview: "",
            posterPath: "/fZPSd91yGE9fCcCe6OoQr6E3Bev.jpg",
            productionCompanies: null,
            releaseDate: "2012-01-01",
            title: "test"
        }], totalResults: 1, totalPages: 1}))
        .mockResponseOnce(JSON.stringify({ backdropPath: "/test",
            cast: null,
            genres: null,
            movieId: "12345",
            overview: "",
            posterPath: "/fZPSd91yGE9fCcCe6OoQr6E3Bev.jpg",
            productionCompanies: null,
            releaseDate: "2012-01-01",
            title: "test",
            director: null
        }));

    render(<App />, { wrapper: BrowserRouter });

    const dropdown = screen.getByTestId('selectCategory');
    await waitFor(() => user.selectOptions(dropdown, "title"));
    await waitFor(() => user.type(screen.getByRole('textbox', {name: "searchTerm"}), "test"));
    await waitFor(() => user.click(screen.getByText(/filter/i)));
    await waitFor(() => user.type(screen.getByLabelText("yearEndFilter"), "2020"));
    await waitFor(() => user.click(screen.getByText(/submit/i)));
    await waitFor(() => user.click(screen.getAllByLabelText('movieDetailLink')[0]));

    expect(fetch).toHaveBeenCalledTimes(4);
});

test("search results fetch works with no year filter and no category", async() => {
    const user = userEvent.setup();

    render(<App />, { wrapper: BrowserRouter });

    fetch.mockResponseOnce(JSON.stringify({uuid: "51234", username: "user", password: "test"}), { status: 200 })
        .mockResponseOnce(JSON.stringify([]))
        .mockResponseOnce(JSON.stringify({results: [{id: "123", name: "test"}], totalResults: 1}))
        .mockResponseOnce(JSON.stringify({results: [{ backdropPath: "/test", cast: null, genres: [{id: "123", name: "test"}],
                movieId: "12345",
                overview: "",
                posterPath: "/fZPSd91yGE9fCcCe6OoQr6E3Bev.jpg",
                productionCompanies: null,
                releaseDate: "",
                title: "title"
            }], totalResults: 1, totalPages: 1}))
        .mockResponseOnce(JSON.stringify({ backdropPath: "/test", cast: null, genres: [{id: "123", name: "test"}],
            movieId: "12345",
            overview: "",
            posterPath: "/fZPSd91yGE9fCcCe6OoQr6E3Bev.jpg",
            productionCompanies: null,
            releaseDate: "",
            title: "title"
        }));

    await waitFor(() => user.type(screen.getByRole('textbox', {name: "searchTerm"}), "test"));
    await waitFor(() => user.click(screen.getByText(/submit/i)));
    await waitFor(() => user.click(screen.getAllByLabelText('movieDetailLink')[0]));

    expect(fetch).toHaveBeenCalledTimes(5);
});


test("load more search results works without fetching", async() => {
    const user = userEvent.setup();

    const mockResults = new Array(20).fill(null).map(()=> ({ backdropPath: "/test", cast: null, genres: null,
        movieId: "12345",
        overview: "",
        posterPath: "/fZPSd91yGE9fCcCe6OoQr6E3Bev.jpg",
        productionCompanies: null,
        releaseDate: "",
        title: "test"
    }));

    fetch.mockResponseOnce(JSON.stringify({uuid: "51234", username: "user", password: "test"}), { status: 200 })
        .mockResponseOnce(JSON.stringify([]))
        .mockResponse(JSON.stringify({results: mockResults, totalResults: 40, totalPages: 2}));

    render(<App />, { wrapper: BrowserRouter });

    const dropdown = screen.getByTestId('selectCategory');
    await waitFor(() => user.selectOptions(dropdown, "title"));
    await waitFor(() => user.type(screen.getByRole('textbox', {name: "searchTerm"}), "test"));
    await waitFor(() => user.click(screen.getByText(/submit/i)));

    expect(fetch).toHaveBeenCalledTimes(3);

    await waitFor(() => expect(screen.getByText(/Load more/i)).toBeInTheDocument());
    await waitFor(() => user.click(screen.getByText(/Load more/i)));
});

test("load more fetching more results works", async() => {
    const user = userEvent.setup();

    const mockResults = new Array(20).fill(null).map((value, index)=>
        ({ backdropPath: "/test", cast: null, genres: null,
        movieId: index,
        overview: "",
        posterPath: "/fZPSd91yGE9fCcCe6OoQr6E3Bev.jpg",
        productionCompanies: null,
        releaseDate: "",
        title: "test"
    }));

    const mockDetailsResults = new Array(10).fill(null).map((value, index)=>
        ([JSON.stringify({ backdropPath: "/test", cast: null, genres: null,
            movieId: index,
            overview: "",
            posterPath: "/fZPSd91yGE9fCcCe6OoQr6E3Bev.jpg",
            productionCompanies: null,
            releaseDate: "",
            title: "test"
        }), {status: 200}]));

    const mockDetailsResults2 = new Array(10).fill(null).map((value, index)=>
        ([JSON.stringify({ backdropPath: "/test", cast: null, genres: null,
            movieId: index+10,
            overview: "",
            posterPath: "/fZPSd91yGE9fCcCe6OoQr6E3Bev.jpg",
            productionCompanies: null,
            releaseDate: "",
            title: "test"
        }), {status: 200}]));

    fetch.mockResponseOnce(JSON.stringify({uuid: "51234", username: "user", password: "test"}), { status: 200 })
        .mockResponseOnce(JSON.stringify([]))
        .mockResponseOnce(JSON.stringify({results: mockResults, totalResults: 20, totalPages: 2, lastPage: 1}))
        .mockResponses(...mockDetailsResults, [JSON.stringify({results: mockResults, totalResults: 20, totalPages: 2, lastPage: 2}), {status: 200}], ...mockDetailsResults2);

    render(<App />, { wrapper: BrowserRouter });
    const dropdown = screen.getByTestId('selectCategory');
    await waitFor(() => user.selectOptions(dropdown, "title"));
    await waitFor(() => user.type(screen.getByRole('textbox', {name: "searchTerm"}), "test"));
    await waitFor(() => user.click(screen.getByText(/submit/i)));

    await waitFor(() => user.click(screen.getByText(/Load more/i)));
    //await waitFor(() => user.click(screen.getByText(/Load more/i)));
    expect(fetch).toHaveBeenCalledTimes(24);
});

test("fetching fails on the search results page with no connection and unable to find user", async () => {
    const user = userEvent.setup();

    fetch.mockResponseOnce(JSON.stringify({uuid: "51234", username: "user", password: "test"}), { status: 200 })
        .mockRejectOnce(new Error("Unable to find user")).mockRejectOnce(new Error("API is down"));

    render(<App />, { wrapper: BrowserRouter });

    const dropdown = screen.getByTestId('selectCategory');
    await waitFor(() => user.selectOptions(dropdown, "title"));
    await waitFor(() => user.type(screen.getByRole('textbox', {name: "searchTerm"}), "test"));
    await waitFor(() => user.click(screen.getByText(/submit/i)));

    expect(fetch).toHaveBeenCalledTimes(3);
});

test("fetching fails on the search results page with malformed API response", async () => {
    const user = userEvent.setup();

    fetch.mockResponseOnce(JSON.stringify({uuid: "51234", username: "user", password: "test"}), { status: 200 })
        .mockResponseOnce(JSON.stringify(null )).mockResponseOnce(null, {status: 400});

    render(<App />, { wrapper: BrowserRouter });

    const dropdown = screen.getByTestId('selectCategory');
    await waitFor(() => user.selectOptions(dropdown, "title"));
    await waitFor(() => user.type(screen.getByRole('textbox', {name: "searchTerm"}), "test"));
    await waitFor(() => user.click(screen.getByText(/submit/i)));

    expect(fetch).toHaveBeenCalledTimes(3);
});

test("search by keyword works with valid keyword id", async() => {
    const user = userEvent.setup();

    render(<App />, { wrapper: BrowserRouter });

    fetch.mockResponseOnce(JSON.stringify({uuid: "51234", username: "user", password: "test"}), { status: 200 })
        .mockResponseOnce(JSON.stringify([]))
        .mockResponseOnce(JSON.stringify({results: [{id: "123", name: "test"}], totalResults: 1}))
        .mockResponseOnce(JSON.stringify({results: [{ backdropPath: "/test", cast: null, genres: [{id: "123", name: "test"}],
                movieId: "12345",
                overview: "",
                posterPath: "/fZPSd91yGE9fCcCe6OoQr6E3Bev.jpg",
                productionCompanies: null,
                releaseDate: "",
                title: "title"
            }], totalResults: 1, totalPages: 1}))
        .mockResponseOnce(JSON.stringify({ backdropPath: "/test", cast: null, genres: [{id: "123", name: "test"}],
            movieId: "12345",
            overview: "",
            posterPath: "/fZPSd91yGE9fCcCe6OoQr6E3Bev.jpg",
            productionCompanies: null,
            releaseDate: "",
            title: "title"
        }));

    const dropdown = screen.getByTestId('selectCategory');
    await waitFor(() => user.selectOptions(dropdown, "keyword"));
    await waitFor(() => user.type(screen.getByRole('textbox', {name: "searchTerm"}), "test"));
    await waitFor(() => user.click(screen.getByText(/submit/i)));
    await waitFor(() => user.click(screen.getAllByLabelText('movieDetailLink')[0]));

    expect(fetch).toHaveBeenCalledTimes(5); // Check that fetch was called once
});

test("search by keyword fails with bad api response", async() => {
    const user = userEvent.setup();

    render(<App />, { wrapper: BrowserRouter });

    fetch.mockResponseOnce(JSON.stringify({uuid: "51234", username: "user", password: "test"}), { status: 200 })
        .mockResponseOnce(JSON.stringify([]))
        .mockResponseOnce(null, {status: 400});

    const dropdown = screen.getByTestId('selectCategory');
    await waitFor(() => user.selectOptions(dropdown, "keyword"));
    await waitFor(() => user.type(screen.getByRole('textbox', {name: "searchTerm"}), "test"));
    await waitFor(() => user.click(screen.getByText(/submit/i)));


    expect(fetch).toHaveBeenCalledTimes(3);
});

test("search by keyword fails with error", async() => {
    const user = userEvent.setup();

    render(<App />, { wrapper: BrowserRouter });

    fetch.mockResponseOnce(JSON.stringify({uuid: "51234", username: "user", password: "test"}), { status: 200 })
        .mockResponseOnce(JSON.stringify([]))
        .mockRejectOnce(new Error("Error: no results for keyword"));

    const dropdown = screen.getByTestId('selectCategory');
    await waitFor(() => user.selectOptions(dropdown, "keyword"));
    await waitFor(() => user.type(screen.getByRole('textbox', {name: "searchTerm"}), "test"));
    await waitFor(() => user.click(screen.getByText(/submit/i)));


    expect(fetch).toHaveBeenCalledTimes(3);
});

test("Create list works", async() => {
    const user = userEvent.setup();
    render(<CreateNewListPage {...props}/>, { wrapper: BrowserRouter });

    fetch.mockResponseOnce(JSON.stringify({listId: 1, listName: "newList", movieIds: null}));

    await waitFor(() => user.type(screen.getByLabelText(/newListName/i), "newlist"));
    await waitFor(() => user.click(screen.getByLabelText(/createNewListButton/i)));
    expect(fetch).toHaveBeenCalledTimes(1);
})

test("Add movie to list works", async() => {
    const user = userEvent.setup();

    fetch.mockResponseOnce(JSON.stringify({uuid: "51234", username: "user", password: "test"}), { status: 200 })
        .mockResponseOnce(JSON.stringify([{listId: 1, listName: "newList", movieIds: null}]))
        .mockResponseOnce(JSON.stringify({results: [{ backdropPath: "/test", cast: null, genres: null,
            movieId: "12345",
            overview: "",
            posterPath: "/fZPSd91yGE9fCcCe6OoQr6E3Bev.jpg",
            productionCompanies: null,
            releaseDate: "",
            title: "test"
        }], totalResults: 1, totalPages: 1}))
        .mockResponseOnce(JSON.stringify({ backdropPath: "/test",
            cast: null,
            genres: null,
            movieId: "12345",
            overview: "",
            posterPath: "/fZPSd91yGE9fCcCe6OoQr6E3Bev.jpg",
            productionCompanies: null,
            releaseDate: "",
            title: "test",
            director: null
        }));

    render(<App />, { wrapper: BrowserRouter });
    const dropdown = screen.getByTestId('selectCategory');
    await waitFor(() => user.selectOptions(dropdown, "title"));
    await waitFor(() => user.type(screen.getByRole('textbox', {name: "searchTerm"}), "test"));
    await waitFor(() => user.click(screen.getByText(/submit/i)));

    fetch.mockResponseOnce(JSON.stringify({listId: 1, listName: "newList", movieIds: ["12345"]}))
        .mockResponseOnce(JSON.stringify([{listId: 1, listName: "newList", movieIds: ["12345"]}]));
    await waitFor(() => user.click(screen.getByLabelText('addMovieButton')));
    await waitFor(() => user.click(screen.getByLabelText('newList')));
    await waitFor(() => user.click(screen.getByLabelText('seeMovieListsButton')));
    expect(fetch).toHaveBeenCalledTimes(6);
});

test("Adding movie to list fails", async() => {
    const user = userEvent.setup();

    fetch.mockResponseOnce(JSON.stringify({uuid: "51234", username: "user", password: "test"}), { status: 200 })
        .mockResponseOnce(JSON.stringify([{listId: 1, listName: "newList", movieIds: null}]))
        .mockResponseOnce(JSON.stringify({results: [{ backdropPath: "/test", cast: null, genres: null,
            movieId: "12345",
            overview: "",
            posterPath: "/fZPSd91yGE9fCcCe6OoQr6E3Bev.jpg",
            productionCompanies: null,
            releaseDate: "",
            title: "test"
        }], totalResults: 1, totalPages: 1}))
        .mockResponseOnce(JSON.stringify({ backdropPath: "/test",
            cast: null,
            genres: null,
            movieId: "12345",
            overview: "",
            posterPath: "/fZPSd91yGE9fCcCe6OoQr6E3Bev.jpg",
            productionCompanies: null,
            releaseDate: "",
            title: "test",
            director: null
        }));

    render(<App />, { wrapper: BrowserRouter });
    const dropdown = screen.getByTestId('selectCategory');
    await waitFor(() => user.selectOptions(dropdown, "title"));
    await waitFor(() => user.type(screen.getByRole('textbox', {name: "searchTerm"}), "test"));
    await waitFor(() => user.click(screen.getByText(/submit/i)));

    fetch.mockRejectOnce(new Error("unable to add movie to list"));
    await waitFor(() => user.click(screen.getByLabelText('addMovieButton')));
    await waitFor(() => user.click(screen.getByLabelText('newList')));
    expect(fetch).toHaveBeenCalledTimes(5);
});

test("Create list on add movie button works", async() => {
    const user = userEvent.setup();

    fetch.mockResponseOnce(JSON.stringify({uuid: "51234", username: "user", password: "test"}), { status: 200 })
        .mockResponseOnce(JSON.stringify([]))
        .mockResponseOnce(JSON.stringify({results: [{ backdropPath: "/test", cast: null, genres: null,
            movieId: "12345",
            overview: "",
            posterPath: "/fZPSd91yGE9fCcCe6OoQr6E3Bev.jpg",
            productionCompanies: null,
            releaseDate: "",
            title: "test"
        }], totalResults: 1, totalPages: 1}))
        .mockResponseOnce(JSON.stringify({ backdropPath: "/test",
            cast: null,
            genres: null,
            movieId: "12345",
            overview: "",
            posterPath: "/fZPSd91yGE9fCcCe6OoQr6E3Bev.jpg",
            productionCompanies: null,
            releaseDate: "",
            title: "test",
            director: null
        }));

    render(<App />, { wrapper: BrowserRouter });
    const dropdown = screen.getByTestId('selectCategory');
    await waitFor(() => user.selectOptions(dropdown, "title"));
    await waitFor(() => user.type(screen.getByRole('textbox', {name: "searchTerm"}), "test"));
    await waitFor(() => user.click(screen.getByText(/submit/i)));

    await waitFor(() => user.click(screen.getByLabelText('addMovieButton')));
    await waitFor(() => user.click(screen.getByLabelText('addListButton')));
    expect(fetch).toHaveBeenCalledTimes(5);
});

test("Get free movie tickets button works", async() => {
    const user = userEvent.setup();

    fetch.mockResponseOnce(JSON.stringify({uuid: "51234", username: "user", password: "test"}), { status: 200 })
        .mockResponseOnce(JSON.stringify([]))
        .mockResponseOnce(JSON.stringify({results: [{ backdropPath: "/test", cast: null, genres: null,
            movieId: "12345",
            overview: "",
            posterPath: "/fZPSd91yGE9fCcCe6OoQr6E3Bev.jpg",
            productionCompanies: null,
            releaseDate: "",
            title: "test"
        }], totalResults: 1, totalPages: 1}))
        .mockResponseOnce(JSON.stringify({ backdropPath: "/test",
            cast: null,
            genres: null,
            movieId: "12345",
            overview: "",
            posterPath: "/fZPSd91yGE9fCcCe6OoQr6E3Bev.jpg",
            productionCompanies: null,
            releaseDate: "",
            title: "test",
            director: null
        }));

    render(<App />, { wrapper: BrowserRouter });
    const dropdown = screen.getByTestId('selectCategory');
    await waitFor(() => user.selectOptions(dropdown, "title"));
    await waitFor(() => user.type(screen.getByRole('textbox', {name: "searchTerm"}), "test"));
    await waitFor(() => user.click(screen.getByText(/submit/i)));

    await waitFor(() => user.click(screen.getByLabelText('freeTicketButton')));
    await waitFor(() => user.click(screen.getByLabelText('Close')));
    expect(fetch).toHaveBeenCalledTimes(4);
});
