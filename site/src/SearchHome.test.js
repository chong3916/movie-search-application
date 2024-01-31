import React from "react";
import {cleanup, render, screen, waitFor} from "@testing-library/react";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";

beforeEach(() => {
    fetch.resetMocks();
});

// Reset the browser history after each test
afterEach(() => {
    window.history.pushState(null, document.title, "/");
    cleanup();
});

test("Search Home rendering", async () => {
    const user = userEvent.setup();
    render(<App />, { wrapper: BrowserRouter });

    // verify page content for default route
    await waitFor(() => expect(screen.getByText(/submit/i)).toBeInTheDocument());
    await waitFor(() => expect(screen.getByRole('option', {name: /keyword/i})).toBeInTheDocument());
    await waitFor(() => expect(screen.getByRole('textbox', {name: "searchTerm"})).toBeInTheDocument());
    await waitFor(() => expect(screen.getByText(/filter/i)).toBeInTheDocument());
    await waitFor(() => user.click(screen.getByText("Filter")));
    await waitFor(() => expect(screen.getByLabelText("yearStartFilter")).toBeInTheDocument());
    await waitFor(() => expect(screen.getByLabelText("yearEndFilter")).toBeInTheDocument());
});
