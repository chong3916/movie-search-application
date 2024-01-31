import React from "react";
import {cleanup, render, screen, waitFor} from "@testing-library/react";
import {BrowserRouter} from "react-router-dom";
import userEvent from "@testing-library/user-event";
import WatchlistPage from "./pages/WatchlistPage";
import PrivateRoute from "./components/PrivateRoute";
import {act} from "react-dom/test-utils";
import WatchlistMoviesPage from "./pages/WatchlistMoviesPage";
import EditListPage from "./pages/EditListPage";
import CreateNewListPage from "./pages/CreateNewListPage";
import {
    mockUser,
    movieDetails,
    multipleWatchlists,
    multipleWatchlistsWithId,
    multipleWatchlistsWithIdAndName,
    watchlist, watchlistWithId
} from "./fixtures";

let mockPrivacy = true;
const sessionStorageEvent = new Event("sessionStorageEvent");
const props = { setBanner: jest.fn().mockResolvedValueOnce({message: null, variant: null}),
    sessionStorageEvent: sessionStorageEvent};

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useParams: () => ({
        listId: 1
    }),
    useLocation: () => ({
        state: { privacy: mockPrivacy, listId: 1}
    }),
}));

beforeEach(() => {
    fetch.resetMocks();
});

// Reset the browser history after each test
afterEach(() => {
    mockPrivacy = true;
    window.history.pushState(null, document.title, "/");
    cleanup();
    window.sessionStorage.clear();
});

test("Create new list works", async () => {
    window.sessionStorage.setItem("user","51234");
    const user = userEvent.setup();
    await act(async () => {render(<CreateNewListPage {...props}/>, { wrapper: BrowserRouter }) });
    fetch.mockResponseOnce(JSON.stringify(watchlist(1, 0, true)))
        .mockResponseOnce(JSON.stringify(watchlist(1, 0, true)));
    await waitFor(() => user.type((screen.getByLabelText("newListName")), "Test List"));
    const privacyDropdown = screen.getByLabelText('listPrivacy');
    await waitFor(() => user.selectOptions(privacyDropdown, "private"));
    await waitFor(() => user.click(screen.getByLabelText(/createNewListButton/i)));

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
});

test("Create new list fails", async () => {
    window.sessionStorage.setItem("user","51234");
    const user = userEvent.setup();
    await act(async () => {render(<CreateNewListPage {...props}/>, { wrapper: BrowserRouter }) });
    fetch.mockRejectOnce(new Error("unable to create list"));

    await waitFor(() => user.type((screen.getByLabelText("newListName")), "new list"));
    const privacyDropdown = screen.getByLabelText('listPrivacy');
    await waitFor(() => user.selectOptions(privacyDropdown, "private"));
    await waitFor(() => user.click(screen.getByLabelText(/createNewListButton/i)));

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
});

test("Create new list fails due to duplicate name", async () => {
    window.sessionStorage.setItem("user","51234");
    const user = userEvent.setup();
    await act(async () => {render(<CreateNewListPage {...props}/>, { wrapper: BrowserRouter }) });
    fetch.mockResponseOnce(null, {status: 400});

    await waitFor(() => user.type((screen.getByLabelText("newListName")), "new list"));
    const privacyDropdown = screen.getByLabelText('listPrivacy');
    await waitFor(() => user.selectOptions(privacyDropdown, "private"));
    await waitFor(() => user.click(screen.getByLabelText(/createNewListButton/i)));

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
});

test("Watchlist page rendering when logged in", async () => {
    window.sessionStorage.setItem("user","51234");
    fetch.mockResponse(JSON.stringify([]));
    await act(async () => (render(<WatchlistPage {...props}/>, { wrapper: BrowserRouter })));

    await waitFor(() => expect(screen.getByLabelText(/newListButton/i)).toBeInTheDocument());
});

test("Watchlist page doesn't render when not logged in", async () => {
    window.sessionStorage.clear();
    await act(async () => (render(<PrivateRoute {...props}><WatchlistPage {...props}/></PrivateRoute>, { wrapper: BrowserRouter })));

    await waitFor(() => expect(screen.queryByLabelText(/newListButton/i)).not.toBeInTheDocument());
});

test("Watchlist page doesn't render when controller returns error", async () => {
    window.sessionStorage.setItem("user","51234");
    fetch.mockRejectOnce(new Error("user not found"));
    render(<PrivateRoute {...props}><WatchlistPage {...props}/></PrivateRoute>, { wrapper: BrowserRouter });

    await waitFor(() => expect(screen.queryByLabelText(/newListButton/i)).not.toBeInTheDocument());
});

test("Watchlist page doesn't render when user is not found", async () => {
    window.sessionStorage.setItem("user","51234");
    fetch.mockResponseOnce(null, {status: 400});
    await act(async () => (render(<PrivateRoute {...props}><WatchlistPage {...props}/></PrivateRoute>, { wrapper: BrowserRouter })));

    await waitFor(() => expect(screen.queryByLabelText(/newListButton/i)).not.toBeInTheDocument());
});

test("Navigate to new list page from user watchlist page works", async () => {
    const user = userEvent.setup();
    window.sessionStorage.setItem("user","51234");
    fetch.mockResponses([JSON.stringify(mockUser), { status: 200 }], [JSON.stringify([])], [JSON.stringify([])]); //empty watchlist array when watchlist page first loads in

    await act(async () => (render(<PrivateRoute {...props}><WatchlistPage {...props}/></PrivateRoute>, { wrapper: BrowserRouter })));
    await waitFor(() => user.click(screen.getByLabelText(/newListButton/i)));

    expect(fetch).toHaveBeenCalledTimes(3);
});

test("Navigate to watchlist movies page by clicking watchlist card", async () => {
    const user = userEvent.setup();
    window.sessionStorage.setItem("user","51234");
    fetch.mockResponses([JSON.stringify(mockUser), { status: 200 }], [JSON.stringify(multipleWatchlists(1, 1, true))], [JSON.stringify([])]);

    await act(async () => (render(<PrivateRoute {...props}><WatchlistPage {...props}/></PrivateRoute>, { wrapper: BrowserRouter })));
    await waitFor(() => user.click(screen.getByLabelText("Test List")));

    expect(fetch).toHaveBeenCalledTimes(3);
});

test("Fetching user watchlist on watchlist page works", async () => {
    window.sessionStorage.setItem("user","51234");
    fetch.mockResponseOnce(JSON.stringify(multipleWatchlistsWithId(2, 1, true, [1, 2])))
        .mockResponseOnce(JSON.stringify(multipleWatchlistsWithId(1, 1, false, [1])));
    await act(async () => {render(<WatchlistPage {...props}/>, { wrapper: BrowserRouter }) });

    expect(fetch).toHaveBeenCalledTimes(2);
});

test("Fetching user and public watchlists on watchlist page fails", async () => {
    window.sessionStorage.setItem("user","51234");
    fetch.mockRejectOnce(new Error("Unable to find user"))
        .mockRejectOnce(new Error("Unable to get public watchlists"));
    await act(async () => {render(<WatchlistPage {...props}/>, { wrapper: BrowserRouter }) });

    expect(fetch).toHaveBeenCalledTimes(2);
});

test("Fetching all movies in watchlist movies page works and remove movie button works", async () => {
    window.sessionStorage.setItem("user","51234");
    const user = userEvent.setup();

    fetch.mockResponseOnce(JSON.stringify([]))
        .mockResponseOnce(JSON.stringify(multipleWatchlists(1, 1, false)))
        .mockResponseOnce(JSON.stringify(Array(1).fill(movieDetails)))
        .mockResponseOnce(JSON.stringify(multipleWatchlists(1, 1, false)))
        .mockResponseOnce(JSON.stringify(movieDetails));

    await act(async () => {render(<WatchlistMoviesPage {...props}/>, { wrapper: BrowserRouter }) });

    fetch.mockResponseOnce(JSON.stringify(watchlist(1, 0, true)))
        .mockResponseOnce(JSON.stringify(multipleWatchlists(1, 0, true)))
        .mockResponseOnce(JSON.stringify([]))
        .mockResponseOnce(JSON.stringify(multipleWatchlists(1, 0, false)))

    await waitFor(() => user.click((screen.getByLabelText(/removeMovieButton/i))));

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(9));
});

test("Fetching public list, comparing, and creating lists from common movies works", async () => {
    window.sessionStorage.setItem("user","51234");
    const user = userEvent.setup();
    mockPrivacy = false;

    fetch.mockResponseOnce(JSON.stringify(multipleWatchlistsWithId(1, 2, false, [1])))
        .mockResponseOnce(JSON.stringify(multipleWatchlistsWithId(1, 1, false, [2])))
        .mockResponseOnce(JSON.stringify(Array(1).fill(movieDetails)))
        .mockResponseOnce(JSON.stringify(multipleWatchlistsWithId(1, 1, false, [2])))
        .mockResponseOnce(JSON.stringify(movieDetails));

    await act(async () => {render(<WatchlistMoviesPage {...props}/>, { wrapper: BrowserRouter }) });

    fetch.mockResponseOnce(JSON.stringify(Array(1).fill(movieDetails)))
        .mockResponseOnce(JSON.stringify(movieDetails));

    await waitFor(() => user.click((screen.getByText("Compare List"))));
    await waitFor(() => user.click((screen.getByLabelText("Test List2"))));

    fetch.mockResponseOnce(JSON.stringify({listId: 3, listName: "A: Test List2 B: Test List1", movieIds: ["1234"], privacy: true}));
    await waitFor(() => user.click((screen.getByLabelText("comparisonNewListButton"))));

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(8));
});

test("Comparing lists returns error", async () => {
    window.sessionStorage.setItem("user","51234");
    const user = userEvent.setup();
    mockPrivacy = false;

    fetch.mockResponseOnce(JSON.stringify(multipleWatchlistsWithId(1, 2, false, [1])))
        .mockResponseOnce(JSON.stringify(multipleWatchlistsWithId(1, 1, false, [2])))
        .mockResponseOnce(JSON.stringify(Array(1).fill(movieDetails)))
        .mockResponseOnce(JSON.stringify(multipleWatchlistsWithId(1, 1, false, [2])))
        .mockResponseOnce(JSON.stringify(movieDetails));

    await act(async () => {render(<WatchlistMoviesPage {...props}/>, { wrapper: BrowserRouter }) });

    fetch.mockRejectOnce(new Error("api had bad response"));

    await waitFor(() => user.click((screen.getByText("Compare List"))));
    await waitFor(() => user.click((screen.getByLabelText("Test List2"))));

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(6));
});

test("Creating list from comparison returns error", async () => {
    window.sessionStorage.setItem("user","51234");
    const user = userEvent.setup();
    mockPrivacy = false;

    fetch.mockResponseOnce(JSON.stringify(multipleWatchlistsWithId(1, 2, false, [1])))
        .mockResponseOnce(JSON.stringify(multipleWatchlistsWithId(1, 1, false, [2])))
        .mockResponseOnce(JSON.stringify(Array(1).fill(movieDetails)))
        .mockResponseOnce(JSON.stringify(multipleWatchlistsWithId(1, 1, false, [2])))
        .mockResponseOnce(JSON.stringify(movieDetails));

    await act(async () => {render(<WatchlistMoviesPage {...props}/>, { wrapper: BrowserRouter }) });

    fetch.mockResponseOnce(JSON.stringify(Array(1).fill(movieDetails)))
        .mockResponseOnce(JSON.stringify(movieDetails));

    await waitFor(() => user.click((screen.getByText("Compare List"))));
    await waitFor(() => user.click((screen.getByLabelText("Test List2"))));

    fetch.mockResponseOnce(JSON.stringify(null), {status: 404});
    await waitFor(() => user.click((screen.getByLabelText("comparisonNewListButton"))));

    fetch.mockRejectOnce(new Error("Error creating new list"))
    await waitFor(() => user.click((screen.getByLabelText("comparisonNewListButton"))));

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(9));
});

test("Creating comparison list when another common list exists works", async () => {
    window.sessionStorage.setItem("user","51234");
    const user = userEvent.setup();
    mockPrivacy = false;

    //fetch.mockResponseOnce(JSON.stringify(multipleWatchlistsWithId(1, 2, false, [1])))
    fetch.mockResponseOnce(JSON.stringify(multipleWatchlistsWithIdAndName(2, 2, false, [2, 3], ["Test List2", "A: Test List2 B: Test List1"])))
        .mockResponseOnce(JSON.stringify(multipleWatchlistsWithIdAndName(1, 2, false, [1], ["Test List1"])))
        .mockResponseOnce(JSON.stringify(Array(1).fill(movieDetails)))
        .mockResponseOnce(JSON.stringify(multipleWatchlistsWithIdAndName(2, 2, false, [2, 3], ["Test List2", "A: Test List2 B: Test List1"])))
        .mockResponseOnce(JSON.stringify(movieDetails));

    await act(async () => {render(<WatchlistMoviesPage {...props}/>, { wrapper: BrowserRouter }) });

    fetch.mockResponseOnce(JSON.stringify(Array(1).fill(movieDetails)))
        .mockResponseOnce(JSON.stringify(movieDetails));

    await waitFor(() => user.click((screen.getByText("Compare List"))));
    await waitFor(() => user.click((screen.getByLabelText("Test List2"))));

    fetch.mockResponseOnce(JSON.stringify({listId: 4, listName: "A: Test List2 B: Test List1 1", movieIds: ["1234"], privacy: true}));
    await waitFor(() => user.click((screen.getByLabelText("comparisonNewListButton"))));

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(8));
});

test("Generate recommendations fails due to no list selected", async () => {
    const user = userEvent.setup();

    window.sessionStorage.setItem("user","51234");
    fetch.mockResponseOnce(JSON.stringify(multipleWatchlistsWithId(2, 1, false, [1, 3])))
        .mockResponseOnce(JSON.stringify(multipleWatchlistsWithId(1, 1, false, [1])))

    await act(async () => {render(<WatchlistPage {...props}/>, { wrapper: BrowserRouter }) });

    await waitFor(() => user.click((screen.getByText(/Recommendations/i))));
    await waitFor(() => user.type((screen.getByLabelText("recommendationNum")), "1"));
    await waitFor(() => user.click((screen.getByLabelText("recommendationsSubmit"))));

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(2));
})

test("Generate recommendations fails due to api bad response", async () => {
    const user = userEvent.setup();

    window.sessionStorage.setItem("user","51234");
    fetch.mockResponseOnce(JSON.stringify(multipleWatchlistsWithId(2, 1, false, [1, 3])))
        .mockResponseOnce(JSON.stringify(multipleWatchlistsWithId(1, 1, false, [1])))

    await act(async () => {render(<WatchlistPage {...props}/>, { wrapper: BrowserRouter }) });

    fetch.mockRejectOnce(new Error("api malformed response"))

    await waitFor(() => user.click((screen.getByText(/Recommendations/i))));
    await waitFor(() => user.type((screen.getByLabelText("recommendationNum")), "1"));
    await waitFor(() => user.click((screen.getByLabelText("Test List1CheckBox"))));
    await waitFor(() => user.click((screen.getByLabelText("recommendationsSubmit"))));

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(3));
})

test("remove movie button fails", async () => {
    window.sessionStorage.setItem("user","51234");
    const user = userEvent.setup();

    fetch.mockResponseOnce(JSON.stringify(multipleWatchlistsWithId(1, 1, false, [1])))
        .mockResponseOnce(JSON.stringify(multipleWatchlistsWithIdAndName(1, 2, false, [1, 3], ["Test List2", "A: Test List2, Test List1"])))
        .mockResponseOnce(JSON.stringify(Array(1).fill(movieDetails)))
        .mockResponseOnce(JSON.stringify(multipleWatchlistsWithIdAndName(1, 2, false, [1, 3], ["Test List2", "A: Test List2, Test List1"])))
        .mockResponseOnce(JSON.stringify(movieDetails));

    await act(async () => {render(<WatchlistMoviesPage {...props}/>, { wrapper: BrowserRouter }) });

    fetch.mockRejectOnce(new Error("unable to remove movie from watchlist"));
    await waitFor(() => user.click((screen.getByLabelText(/removeMovieButton/i))));

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(7));
});

test("Fetching movies with null movieIds array works", async () => {
    window.sessionStorage.setItem("user","51234");

    fetch.mockResponseOnce(JSON.stringify([]))
        .mockResponseOnce(JSON.stringify(multipleWatchlists(1, 0, false)))
        .mockResponseOnce(JSON.stringify(multipleWatchlists(1, 0, true)))

    await act(async () => {render(<WatchlistMoviesPage {...props}/>, { wrapper: BrowserRouter }) });

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(3));
});

test("Fetching watchlist with listId fails due to unable to find listId", async () => {
    window.sessionStorage.setItem("user","51234");
    mockPrivacy = false; // look for public list

    fetch.mockResponseOnce(JSON.stringify(multipleWatchlistsWithIdAndName(1, 0, false, [3], ["Test List"])))
        .mockResponseOnce(JSON.stringify(multipleWatchlistsWithId(1, 0, false, [3])))
        .mockResponseOnce(JSON.stringify(multipleWatchlistsWithId(1, 0, false, [3])));

    await act(async () => {render(<WatchlistMoviesPage {...props}/>, { wrapper: BrowserRouter }) });

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(3));
});

test("Fetching watchlist with listId fails due to error during fetching user list", async () => {
    window.sessionStorage.setItem("user","51234");
    mockPrivacy = false; // look for public list

    fetch.mockResponseOnce(JSON.stringify(multipleWatchlistsWithId(1, 0, false, [3])))
        .mockRejectOnce(new Error("api had bad response"));
    await act(async () => {render(<WatchlistMoviesPage {...props}/>, { wrapper: BrowserRouter }) });

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(2));
});

test("Fetching watchlist with listId fails due to error during fetching public list", async () => {
    window.sessionStorage.setItem("user","51234");

    fetch.mockRejectOnce(new Error("unable to get watchlists"));

    await act(async () => {render(<WatchlistMoviesPage {...props}/>, { wrapper: BrowserRouter }) });

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
});

test("Fetching movies in watchlist movies page fails", async () => {
    window.sessionStorage.setItem("user","51234");

    fetch.mockResponseOnce(JSON.stringify([]))
        .mockResponseOnce(JSON.stringify(multipleWatchlists(1, 1, true)))
        .mockRejectOnce(new Error("unable to get movie"))
        .mockResponseOnce(JSON.stringify(multipleWatchlists(1, 1, true)));

    await act(async () => {render(<WatchlistMoviesPage {...props}/>, { wrapper: BrowserRouter }) });

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(4));
});

test("Getting user watchlists fails on watchlist movies page", async () => {
    window.sessionStorage.setItem("user","51234");

    fetch.mockResponseOnce(JSON.stringify([]))
        .mockResponseOnce(JSON.stringify(multipleWatchlists(1, 0, true)))
        .mockRejectOnce(new Error("unable to get user list"))

    await act(async () => {render(<WatchlistMoviesPage {...props}/>, { wrapper: BrowserRouter }) });

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(3));
});

test("Edit list name and privacy to public works", async () => {
    window.sessionStorage.setItem("user","51234");
    const user = userEvent.setup();

    fetch.mockResponseOnce(JSON.stringify([]))
        .mockResponseOnce(JSON.stringify(multipleWatchlists(1, 0, true)))
        .mockResponseOnce(JSON.stringify(multipleWatchlists(1, 0, true)))

    await act(async () => {render(<WatchlistMoviesPage {...props}/>, { wrapper: BrowserRouter }) });

    await waitFor(() => user.click((screen.getByLabelText(/editListButton/i))));
    await act(async () => {render(<EditListPage {...props}/>, { wrapper: BrowserRouter }) });

    fetch.mockResponseOnce(JSON.stringify(multipleWatchlists(1, 0, false)))
        .mockResponseOnce(JSON.stringify(multipleWatchlists(1, 0, false)))

    await waitFor(() => user.type(screen.getByLabelText('editListName'), "Test List1"));
    const privacyDropdown = screen.getByLabelText('editListPrivacy');
    await waitFor(() => user.selectOptions(privacyDropdown, "public"));
    await waitFor(() => user.click(screen.getByLabelText('saveListEdit')));

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(5));
});

test("Edit list name and privacy to private works", async () => {
    window.sessionStorage.setItem("user","51234");
    const user = userEvent.setup();
    mockPrivacy = false;

    fetch.mockResponseOnce(JSON.stringify([]))
        .mockResponseOnce(JSON.stringify(multipleWatchlists(1, 0, false)))
        .mockResponseOnce(JSON.stringify(multipleWatchlists(1, 0, false)));

    await act(async () => {render(<WatchlistMoviesPage {...props}/>, { wrapper: BrowserRouter }) });

    await waitFor(() => user.click((screen.getByLabelText(/editListButton/i))));
    await act(async () => {render(<EditListPage {...props}/>, { wrapper: BrowserRouter }) });

    fetch.mockResponseOnce(JSON.stringify(multipleWatchlists(1, 0, true)))
        .mockResponseOnce(JSON.stringify(multipleWatchlists(1, 0, true)))

    await waitFor(() => user.type(screen.getByLabelText('editListName'), "Test List1"));
    const privacyDropdown = screen.getByLabelText('editListPrivacy');
    await waitFor(() => user.selectOptions(privacyDropdown, "private"));
    await waitFor(() => user.click(screen.getByLabelText('saveListEdit')));

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(5));
});

test("Edit list fails due to error during rename", async () => {
    window.sessionStorage.setItem("user","51234");
    const user = userEvent.setup();

    fetch.mockResponseOnce(JSON.stringify([]))
        .mockResponseOnce(JSON.stringify(multipleWatchlists(1, 0, true)))
        .mockResponseOnce(JSON.stringify(multipleWatchlists(1, 0, true)));

    await act(async () => {render(<WatchlistMoviesPage {...props}/>, { wrapper: BrowserRouter }) });

    await waitFor(() => user.click((screen.getByLabelText(/editListButton/i))));
    await act(async () => {render(<EditListPage {...props}/>, { wrapper: BrowserRouter }) });

    fetch.mockRejectOnce(new Error("unable to find list"));
    await waitFor(() => user.type(screen.getByLabelText('editListName'), "Test List 1"));
    const privacyDropdown = screen.getByLabelText('editListPrivacy');
    await waitFor(() => user.selectOptions(privacyDropdown, "private"));
    await waitFor(() => user.click(screen.getByLabelText('saveListEdit')));

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(4));
});

test("Edit list fails due to error during change privacy", async () => {
    window.sessionStorage.setItem("user","51234");
    const user = userEvent.setup();

    fetch.mockResponseOnce(JSON.stringify([]))
        .mockResponseOnce(JSON.stringify(multipleWatchlists(1, 0, true)))
        .mockResponseOnce(JSON.stringify(multipleWatchlists(1, 0, true)));

    await act(async () => {render(<WatchlistMoviesPage {...props}/>, { wrapper: BrowserRouter }) });

    await waitFor(() => user.click((screen.getByLabelText(/editListButton/i))));
    await act(async () => {render(<EditListPage {...props}/>, { wrapper: BrowserRouter }) });

    fetch.mockResponseOnce(JSON.stringify(multipleWatchlists(1, 0, false)))
        .mockRejectOnce(new Error("unable to find list"));

    const privacyDropdown = screen.getByLabelText('editListPrivacy');
    await waitFor(() => user.selectOptions(privacyDropdown, "private"));
    await waitFor(() => user.click(screen.getByLabelText('saveListEdit')));

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(5));
});

test("Edit list api returns status not found", async () => {
    window.sessionStorage.setItem("user","51234");
    const user = userEvent.setup();

    fetch.mockResponseOnce(JSON.stringify([]))
        .mockResponseOnce(JSON.stringify(multipleWatchlists(1, 0, true)))
        .mockResponseOnce(JSON.stringify(multipleWatchlists(1, 0, true)));

    await act(async () => {render(<WatchlistMoviesPage {...props}/>, { wrapper: BrowserRouter }) });

    await waitFor(() => user.click((screen.getByLabelText(/editListButton/i))));
    await act(async () => {render(<EditListPage {...props}/>, { wrapper: BrowserRouter }) });

    fetch.mockResponseOnce(null, {status: 404});
    await waitFor(() => user.type(screen.getByLabelText('editListName'), "Test List1"));
    await waitFor(() => user.click(screen.getByLabelText('saveListEdit')));

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(4));
});

test("Edit list api returns status bad request", async () => {
    window.sessionStorage.setItem("user","51234");
    const user = userEvent.setup();

    fetch.mockResponseOnce(JSON.stringify([]))
        .mockResponseOnce(JSON.stringify(multipleWatchlists(1, 0, true)))
        .mockResponseOnce(JSON.stringify(multipleWatchlists(1, 0, true)));

    await act(async () => {render(<WatchlistMoviesPage {...props}/>, { wrapper: BrowserRouter }) });

    await waitFor(() => user.click((screen.getByLabelText(/editListButton/i))));
    await act(async () => {render(<EditListPage {...props}/>, { wrapper: BrowserRouter }) });

    fetch.mockResponseOnce(null, {status: 400});

    await waitFor(() => user.type(screen.getByLabelText('editListName'), "newlist2"));
    await waitFor(() => user.click(screen.getByLabelText('saveListEdit')));

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(4));
});

test("Copy movie button works", async () => {
    window.sessionStorage.setItem("user","51234");
    const user = userEvent.setup();

    fetch.mockResponseOnce(JSON.stringify([]))
        .mockResponseOnce(JSON.stringify(multipleWatchlistsWithId(2, 1, false, [1, 3])))
        .mockResponseOnce(JSON.stringify(Array(2).fill(movieDetails)))
        .mockResponseOnce(JSON.stringify(multipleWatchlistsWithId(2, 1, false, [1, 3])))
        .mockResponseOnce(JSON.stringify(movieDetails))
        .mockResponseOnce(JSON.stringify(movieDetails));

    await act(async () => {render(<WatchlistMoviesPage {...props}/>, { wrapper: BrowserRouter }) });

    fetch.mockResponseOnce(JSON.stringify(multipleWatchlistsWithId(2, 1, false, [1, 3])))
        .mockResponseOnce(JSON.stringify([]))
        .mockResponseOnce(JSON.stringify(multipleWatchlistsWithId(2, 1, false, [1, 3])))
        .mockResponseOnce(JSON.stringify(Array(2).fill(movieDetails)))
        .mockResponseOnce(JSON.stringify(multipleWatchlistsWithId(2, 1, false, [1, 3])));

    await waitFor(() => user.click((screen.getAllByLabelText("copyMovieButton")[0])));
    await waitFor(() => user.click((screen.getByLabelText("Test List1"))));

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(11));
});

test("Copy movie button fails", async () => {
    window.sessionStorage.setItem("user","51234");
    const user = userEvent.setup();

    fetch.mockResponseOnce(JSON.stringify([]))
        .mockResponseOnce(JSON.stringify(multipleWatchlistsWithId(2, 1, false, [1, 3])))
        .mockResponseOnce(JSON.stringify(Array(2).fill(movieDetails)))
        .mockResponseOnce(JSON.stringify(multipleWatchlistsWithId(2, 1, false, [1, 3])))
        .mockResponseOnce(JSON.stringify(movieDetails))
        .mockResponseOnce(JSON.stringify(movieDetails));

    await act(async () => {render(<WatchlistMoviesPage {...props}/>, { wrapper: BrowserRouter }) });

    fetch.mockRejectOnce(new Error("Unable to find list"));
    await waitFor(() => user.click((screen.getAllByLabelText("copyMovieButton")[0])));
    await waitFor(() => user.click((screen.getByLabelText("Test List1"))));

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(7));
});

test("Create new list in copy movie button works", async () => {
    window.sessionStorage.setItem("user","51234");
    const user = userEvent.setup();

    fetch.mockResponseOnce(JSON.stringify([]))
        .mockResponseOnce(JSON.stringify(multipleWatchlistsWithId(2, 1, false, [1, 3])))
        .mockResponseOnce(JSON.stringify(Array(2).fill(movieDetails)))
        .mockResponseOnce(JSON.stringify(multipleWatchlistsWithId(2, 1, false, [1, 3])))
        .mockResponseOnce(JSON.stringify(movieDetails))
        .mockResponseOnce(JSON.stringify(movieDetails));

    await act(async () => {render(<WatchlistMoviesPage {...props}/>, { wrapper: BrowserRouter }) });

    await waitFor(() => user.click((screen.getAllByLabelText("copyMovieButton")[0])));
    await waitFor(() => user.click((screen.getByLabelText("addListButton"))));

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(6));
});

test("Move movie button works", async () => {
    window.sessionStorage.setItem("user","51234");
    const user = userEvent.setup();

    fetch.mockResponseOnce(JSON.stringify([]))
        .mockResponseOnce(JSON.stringify(multipleWatchlistsWithId(2, 1, true, [1, 2])))
        .mockResponseOnce(JSON.stringify(Array(1).fill(movieDetails)))
        .mockResponseOnce(JSON.stringify(multipleWatchlistsWithId(2, 1, true, [1, 2])))
        .mockResponseOnce(JSON.stringify(movieDetails));

    await act(async () => {render(<WatchlistMoviesPage {...props}/>, { wrapper: BrowserRouter }) });

    fetch.mockResponseOnce(JSON.stringify(watchlist(1, true)))
        .mockResponseOnce(JSON.stringify(watchlistWithId(2, 1, true)))
        .mockResponseOnce(JSON.stringify(multipleWatchlistsWithId(1, 1, true, [1])))
        .mockResponseOnce(JSON.stringify(multipleWatchlistsWithId(1, 1, true, [2])))
        .mockResponseOnce(JSON.stringify(Array(1).fill(movieDetails)))
        .mockResponseOnce(JSON.stringify(multipleWatchlistsWithId(2, 1, false, [1, 2])))

    await waitFor(() => user.click((screen.getByLabelText("moveMovieButton"))));
    await waitFor(() => user.click((screen.getByLabelText("Test List2"))));

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(11));
});

test("Move movie button fails when removing movie", async () => {
    window.sessionStorage.setItem("user","51234");
    const user = userEvent.setup();

    fetch.mockResponseOnce(JSON.stringify([]))
        .mockResponseOnce(JSON.stringify(multipleWatchlistsWithId(2, 1, true, [1, 2])))
        .mockResponseOnce(JSON.stringify(Array(1).fill(movieDetails)))
        .mockResponseOnce(JSON.stringify(multipleWatchlistsWithId(2, 1, true, [1, 2])))
        .mockResponseOnce(JSON.stringify(movieDetails));

    await act(async () => {render(<WatchlistMoviesPage {...props}/>, { wrapper: BrowserRouter }) });

    fetch.mockRejectOnce(new Error("unable to remove movie from watchlist"));

    await waitFor(() => user.click((screen.getByLabelText("moveMovieButton"))));
    await waitFor(() => user.click((screen.getByLabelText("Test List2"))));

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(6));
});

test("Move movie button fails when adding movie", async () => {
    window.sessionStorage.setItem("user","51234");
    const user = userEvent.setup();

    fetch.mockResponseOnce(JSON.stringify([]))
        .mockResponseOnce(JSON.stringify(multipleWatchlistsWithId(2, 1, true, [1, 2])))
        .mockResponseOnce(JSON.stringify(Array(1).fill(movieDetails)))
        .mockResponseOnce(JSON.stringify(multipleWatchlistsWithId(2, 1, true, [1, 2])))
        .mockResponseOnce(JSON.stringify(movieDetails));

    await act(async () => {render(<WatchlistMoviesPage {...props}/>, { wrapper: BrowserRouter }) });

    fetch.mockResponseOnce(JSON.stringify(watchlist(1, false)))
        .mockRejectOnce(new Error("unable to find list"));

    await waitFor(() => user.click((screen.getByLabelText("moveMovieButton"))));
    await waitFor(() => user.click((screen.getByLabelText("Test List2"))));

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(7));
});

test("Move movie button create new list button works", async () => {
    window.sessionStorage.setItem("user","51234");
    const user = userEvent.setup();

    fetch.mockResponseOnce(JSON.stringify([]))
        .mockResponseOnce(JSON.stringify(multipleWatchlistsWithId(2, 1, true, [1, 2])))
        .mockResponseOnce(JSON.stringify(Array(1).fill(movieDetails)))
        .mockResponseOnce(JSON.stringify(multipleWatchlistsWithId(2, 1, true, [1, 2])))
        .mockResponseOnce(JSON.stringify(movieDetails));

    await act(async () => {render(<WatchlistMoviesPage {...props}/>, { wrapper: BrowserRouter }) });

    fetch.mockResponseOnce(JSON.stringify({listId: 1, listName: "new list", movieIds: null, privacy: false}))
    await waitFor(() => user.click((screen.getByLabelText("moveMovieButton"))));
    await waitFor(() => user.click((screen.getByLabelText("addListButton"))));

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(6));
});

test("Delete watchlist works", async() => {
    const user = userEvent.setup();
    window.sessionStorage.setItem("user","51234");

    fetch.mockResponseOnce(JSON.stringify(multipleWatchlists(1, 0, true)))
        .mockResponseOnce(JSON.stringify([]));

    await act(async () => {render(<WatchlistPage {...props}/>, { wrapper: BrowserRouter }) });

    fetch.mockResponseOnce(JSON.stringify([]))
        .mockResponseOnce(JSON.stringify([]))
        .mockResponseOnce(JSON.stringify([]));

    await waitFor(() => user.click((screen.getByLabelText("deleteListButton"))));
    await waitFor(() => user.click((screen.getByLabelText("deleteListCancelButton"))));
    await waitFor(() => user.click((screen.getByLabelText("deleteListButton"))));
    await waitFor(() => user.click((screen.getByLabelText("deleteListConfirmButton"))));

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(5));
});

test("Delete watchlist fails", async() => {
    const user = userEvent.setup();
    window.sessionStorage.setItem("user","51234");

    fetch.mockResponseOnce(JSON.stringify(multipleWatchlists(1, 0, true)))
        .mockResponseOnce(JSON.stringify([]));

    await act(async () => {render(<WatchlistPage {...props}/>, { wrapper: BrowserRouter }) });

    fetch.mockRejectOnce(new Error("Error deleting list"));
    await waitFor(() => user.click((screen.getByLabelText("deleteListButton"))));
    await waitFor(() => user.click((screen.getByLabelText("deleteListConfirmButton"))));

    fetch.mockResponseOnce(null, {status: 400});
    await waitFor(() => user.click((screen.getByLabelText("deleteListButton"))));
    await waitFor(() => user.click((screen.getByLabelText("deleteListConfirmButton"))));

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(4));
});

