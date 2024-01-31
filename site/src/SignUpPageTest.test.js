import React from "react";
import {cleanup, render, screen, waitFor} from "@testing-library/react";
import App from "./App";
import SignUpPage from "./pages/SignUpPage"
import LoginPage from "./pages/LoginPage"
import { BrowserRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";

const sessionStorageEvent = new Event("sessionStorageEvent");
const props = { setBanner: jest.fn().mockResolvedValueOnce({message: null, variant: null}),
    sessionStorageEvent: sessionStorageEvent};
beforeEach(() => {
    fetch.resetMocks();
});

// Reset the browser history after each test
afterEach(() => {
    window.history.pushState(null, document.title, "/");
    cleanup();
});

test("SignUp Page rendering", async () => {
    render(<App />, { wrapper: BrowserRouter });
    render(<SignUpPage {...props}/>, { wrapper: BrowserRouter });

    // verify page content for default route
    await waitFor(() => expect(screen.getByText(/create a new account/i)).toBeInTheDocument());
    await waitFor(() => expect(screen.getByLabelText('username')).toBeInTheDocument());
    await waitFor(() => expect(screen.getByLabelText('password')).toBeInTheDocument());
    await waitFor(() => expect(screen.getByLabelText('confirmPassword')).toBeInTheDocument());
});

test("Login Page rendering after pressing login", async () => {
    render(<SignUpPage {...props}/>, { wrapper: BrowserRouter });
    const user = userEvent.setup();

    // verify page content for default route
    await waitFor(() => user.click(screen.getByLabelText('Login')));
    render(<LoginPage {...props}/>, { wrapper: BrowserRouter });
    await waitFor(() => expect(screen.getByText(/login page/i)).toBeInTheDocument());
});

test("Handle change for password, confirm password, username, and email", async () => {
    const user = userEvent.setup();
    render(<App />, { wrapper: BrowserRouter });
    render(<SignUpPage {...props}/>, { wrapper: BrowserRouter });

    // verify page content for default route
    await waitFor(() => user.type(screen.getByLabelText('username'), "test"));
    await waitFor(() => user.type(screen.getByLabelText('password'), "test"));
    await waitFor(() => user.type(screen.getByLabelText('confirmPassword'), "test"));
    await waitFor(() => expect(screen.getByLabelText('username')).toBeInTheDocument());
});

test("signup page valid response", async() => {
    const user = userEvent.setup();
    // Mock response of fetch. Fetch shouldn't be called as search term is blank
    fetch.mockResponseOnce(JSON.stringify({username:'test', uuid:'1234'})).mockResponseOnce(JSON.stringify({listId: 1, listName: 'test', movieIds: null}));

    render(<App />, { wrapper: BrowserRouter }); // Render App first
    render(<SignUpPage {...props}/>, { wrapper: BrowserRouter });

    // Check if components are on page
    await waitFor(() => user.type(screen.getByLabelText('username'), "test"));
    await waitFor(() => user.type(screen.getByLabelText('password'), "test"));
    await waitFor(() => user.type(screen.getByLabelText('confirmPassword'), "test"));
    await waitFor(() => user.click(screen.getByLabelText('submit')));
    await waitFor(() => expect(screen.getByLabelText('searchTerm')).toBeInTheDocument());
    expect(fetch).toHaveBeenCalledTimes(1); // Check that fetch was called once
});

test("signup page malformed response", async() => {
    const user = userEvent.setup();
    // Mock response of fetch. Fetch shouldn't be called as search term is blank
    fetch.mockRejectOnce(new Error('user already found'));

    render(<App />, { wrapper: BrowserRouter }); // Render App first
    render(<SignUpPage {...props}/>, { wrapper: BrowserRouter });

    // Check if components are on page
    await waitFor(() => user.type(screen.getByLabelText('username'), "test"));
    await waitFor(() => user.type(screen.getByLabelText('password'), "test"));
    await waitFor(() => user.type(screen.getByLabelText('confirmPassword'), "test"));
    await waitFor(() => user.click(screen.getByLabelText('submit')));
    await waitFor(() => expect(screen.getByLabelText('username')).toBeInTheDocument());
    await waitFor(() => expect(screen.getByLabelText('password')).toBeInTheDocument());
    await waitFor(() => expect(screen.getByLabelText('confirmPassword')).toBeInTheDocument());
    expect(fetch).toHaveBeenCalledTimes(1); // Check that fetch was called once
});

test("password and confirm password mismatch rejects signup", async() => {
    const user = userEvent.setup();

    render(<App />, { wrapper: BrowserRouter }); // Render App first
    render(<SignUpPage {...props}/>, { wrapper: BrowserRouter });

    // Check if components are on page
    await waitFor(() => user.type(screen.getByLabelText('username'), "test"));
    await waitFor(() => user.type(screen.getByLabelText('password'), "test"));
    await waitFor(() => user.type(screen.getByLabelText('confirmPassword'), "test1"));
    await waitFor(() => user.click(screen.getByLabelText('submit')));
    await waitFor(() => expect(screen.getByLabelText('username')).toBeInTheDocument());
    await waitFor(() => expect(screen.getByLabelText('password')).toBeInTheDocument());
    await waitFor(() => expect(screen.getByLabelText('confirmPassword')).toBeInTheDocument());
    expect(fetch).toHaveBeenCalledTimes(0); // Check that fetch was not called
});
