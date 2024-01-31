import {cleanup, render, screen, waitFor} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {act} from "react-dom/test-utils";
import WatchlistPage from "./pages/WatchlistPage";
import {BrowserRouter} from "react-router-dom";
import CreateNewListPage from "./pages/CreateNewListPage";
import React from "react";
import NavigationBar from "./components/NavigationBar";

let mockPrivacy = true;
const sessionStorageEvent = new Event("sessionStorageEvent");
const props = { setBanner: jest.fn().mockResolvedValueOnce({message: null, variant: null}),
    banner: {message: "created new list", variant: null},
    sessionStorageEvent: sessionStorageEvent};
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useParams: () => ({
        listId: 1,
    }),
    useLocation: () => ({
        state: { privacy: mockPrivacy, listId: 1 , movieIds: ["56789"], paramMessage: "Created new list from recommendations"}
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
});

test("Create new list from recommendations works", async () => {
    const user = userEvent.setup();

    window.sessionStorage.setItem("user", "51234");
    fetch.mockResponseOnce(JSON.stringify([{listId: 1, listName: "new list", movieIds: ["1234"], privacy: false}, {listId: 3, listName: "new list 2", movieIds: ["01293"], privacy: true}]))
        .mockResponseOnce(JSON.stringify([{listId: 1, listName: "new list", movieIds: ["1234"], privacy: false}]));

    await act(async () => {render(<NavigationBar {...props}/>, { wrapper: BrowserRouter }) });
    await act(async () => {render(<WatchlistPage {...props}/>, { wrapper: BrowserRouter }) });

    fetch.mockResponseOnce(JSON.stringify([{backdropPath: "", cast: null, director: null, genres: null,
        movieId: "56789", overview: "overview", posterPath: "", productionCompanies: null, releaseDate: "", title: "title"}]))
        .mockResponseOnce(JSON.stringify({backdropPath: "", cast: null, director: null, genres: null,
            movieId: "56789", overview: "overview", posterPath: "", productionCompanies: null, releaseDate: "", title: "title"}));

    await waitFor(() => user.click((screen.getByText("Recommendations"))));
    await waitFor(() => user.type((screen.getByLabelText("recommendationNum")), "1"));
    await waitFor(() => user.click((screen.getByLabelText("new listCheckBox"))));
    await waitFor(() => user.click((screen.getByLabelText("recommendationsSubmit"))));

    fetch.mockResponseOnce(JSON.stringify({listId: 2, listName: "new list 2", movieIds: ["56789"]}));

    await waitFor(() => user.click((screen.getByLabelText("recommendationsNewListButton"))));
    await act(async () => {render(<CreateNewListPage {...props}/>, { wrapper: BrowserRouter }) });

    await waitFor(() => user.type((screen.getByLabelText("newListName")), "new list 2"));
    const privacyDropdown = screen.getByLabelText('listPrivacy');
    await waitFor(() => user.selectOptions(privacyDropdown, "private"));
    await waitFor(() => user.click(screen.getByLabelText(/createNewListButton/i)));
    await waitFor(() => user.click((screen.getByLabelText("Close alert"))));

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(5));
    window.sessionStorage.clear();
})

test("Create new list with movies fails", async () => {
    window.sessionStorage.setItem("user", "51234");
    const user = userEvent.setup();
    await act(async () => {render(<CreateNewListPage {...props}/>, { wrapper: BrowserRouter }) });
    fetch.mockRejectOnce(new Error("unable to create list"));

    await waitFor(() => user.type((screen.getByLabelText("newListName")), "new list 2"));
    const privacyDropdown = screen.getByLabelText('listPrivacy');
    await waitFor(() => user.selectOptions(privacyDropdown, "private"));
    await waitFor(() => user.click(screen.getByLabelText(/createNewListButton/i)));

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
    window.sessionStorage.clear();
});

