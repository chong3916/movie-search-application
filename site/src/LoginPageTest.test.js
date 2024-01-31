import React from "react";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import App from "./App";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
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

test("Login Page rendering", async () => {
  render(<App />, { wrapper: BrowserRouter });
  render(<LoginPage {...props}/>, { wrapper: BrowserRouter });

  // verify page content for default route
  await waitFor(() => expect(screen.getByText(/login page/i)).toBeInTheDocument());
  await waitFor(() => expect(screen.getByLabelText("username")).toBeInTheDocument());
  await waitFor(() => expect(screen.getByLabelText("password")).toBeInTheDocument());
});

test("SignUp Page rendering after pressing sign up button", async () => {
    render(<LoginPage {...props}/>, { wrapper: BrowserRouter });
    const user = userEvent.setup();

    // verify page content for default route
    await waitFor(() => user.click(screen.getByLabelText('Sign Up')));
    render(<SignUpPage {...props}/>, { wrapper: BrowserRouter });
    await waitFor(() => expect(screen.getByText(/create a new account/i)).toBeInTheDocument());
});

test("Handle change for password and username", async () => {
  const user = userEvent.setup();
  render(<App />, { wrapper: BrowserRouter });
  render(<LoginPage {...props}/>, { wrapper: BrowserRouter });

  // verify page content for default route
  await waitFor(() => user.type(screen.getByLabelText("username"), "test"));
  await waitFor(() => user.type(screen.getByLabelText("password"), "test"));
  expect(screen.getByLabelText("username")).toBeInTheDocument();
});

test("login page valid response", async () => {
  const user = userEvent.setup();
  // Mock response of fetch. Fetch shouldn't be called as search term is blank
  fetch
    .mockResponseOnce(JSON.stringify({ username: "test", email: "testing@gmail.com", uuid: "1234" }))

  render(<App />, { wrapper: BrowserRouter }); // Render App first
  render(<LoginPage {...props}/>, { wrapper: BrowserRouter });

  // Check if components are on page
  await waitFor(() => user.type(screen.getByLabelText("username"), "test"));
  await waitFor(() => user.type(screen.getByLabelText("password"), "test"));
  await waitFor(() => user.click(screen.getByLabelText("submit")));
  await waitFor(() => expect(screen.getByLabelText("searchTerm")).toBeInTheDocument());
  expect(fetch).toHaveBeenCalledTimes(1); // Check that fetch was called once
});

test("login page api bad response no user", async () => {
  const user = userEvent.setup();
  // Mock response of fetch. Fetch shouldn't be called as search term is blank
  fetch.mockResponseOnce(null, {status: 404});

  render(<App />, { wrapper: BrowserRouter }); // Render App first
  render(<LoginPage {...props}/>, { wrapper: BrowserRouter });

  // Check if components are on page
  await waitFor(() => user.type(screen.getByLabelText("username"), "test"));
  await waitFor(() => user.type(screen.getByLabelText("password"), "test"));
  await waitFor(() => user.click(screen.getByLabelText("submit")));
  await waitFor(() => expect(screen.getByText(/submit/i)).toBeInTheDocument());
  await waitFor(() => expect(screen.getByLabelText("username")).toBeInTheDocument());
  await waitFor(() => expect(screen.getByLabelText("password")).toBeInTheDocument());
  expect(fetch).toHaveBeenCalledTimes(1); // Check that fetch was called once
});

test("login page api bad response wrong password", async () => {
  const user = userEvent.setup();
  // Mock response of fetch. Fetch shouldn't be called as search term is blank
  fetch.mockResponseOnce(null, {status: 400});

  render(<App />, { wrapper: BrowserRouter }); // Render App first
  render(<LoginPage {...props}/>, { wrapper: BrowserRouter });

  // Check if components are on page
  await waitFor(() => user.type(screen.getByLabelText("username"), "test"));
  await waitFor(() => user.type(screen.getByLabelText("password"), "test"));
  await waitFor(() => user.click(screen.getByLabelText("submit")));
  await waitFor(() => expect(screen.getByText(/submit/i)).toBeInTheDocument());
  await waitFor(() => expect(screen.getByLabelText("username")).toBeInTheDocument());
  await waitFor(() => expect(screen.getByLabelText("password")).toBeInTheDocument());
  expect(fetch).toHaveBeenCalledTimes(1); // Check that fetch was called once
});

test("login page api bad response locked account", async () => {
  const user = userEvent.setup();
  // Mock response of fetch. Fetch shouldn't be called as search term is blank
  fetch.mockResponseOnce(null, {status: 429});

  render(<App />, { wrapper: BrowserRouter }); // Render App first
  render(<LoginPage {...props}/>, { wrapper: BrowserRouter });

  // Check if components are on page
  await waitFor(() => user.type(screen.getByLabelText("username"), "test"));
  await waitFor(() => user.type(screen.getByLabelText("password"), "test"));
  await waitFor(() => user.click(screen.getByLabelText("submit")));
  await waitFor(() => expect(screen.getByText(/submit/i)).toBeInTheDocument());
  await waitFor(() => expect(screen.getByLabelText("username")).toBeInTheDocument());
  await waitFor(() => expect(screen.getByLabelText("password")).toBeInTheDocument());
  expect(fetch).toHaveBeenCalledTimes(1); // Check that fetch was called once
});

test("login page api bad response account still locked", async () => {
  const user = userEvent.setup();
  // Mock response of fetch. Fetch shouldn't be called as search term is blank
  fetch.mockResponseOnce(null, {status: 503});

  render(<App />, { wrapper: BrowserRouter }); // Render App first
  render(<LoginPage {...props}/>, { wrapper: BrowserRouter });

  // Check if components are on page
  await waitFor(() => user.type(screen.getByLabelText("username"), "test"));
  await waitFor(() => user.type(screen.getByLabelText("password"), "test"));
  await waitFor(() => user.click(screen.getByLabelText("submit")));
  await waitFor(() => expect(screen.getByText(/submit/i)).toBeInTheDocument());
  await waitFor(() => expect(screen.getByLabelText("username")).toBeInTheDocument());
  await waitFor(() => expect(screen.getByLabelText("password")).toBeInTheDocument());
  expect(fetch).toHaveBeenCalledTimes(1); // Check that fetch was called once
});

test("login page api responded with error", async () => {
  const user = userEvent.setup();
  // Mock response of fetch. Fetch shouldn't be called as search term is blank
  fetch.mockRejectOnce(new Error("api responded with malformed response"));

  render(<App />, { wrapper: BrowserRouter }); // Render App first
  render(<LoginPage {...props}/>, { wrapper: BrowserRouter });

  // Check if components are on page
  await waitFor(() => user.type(screen.getByLabelText("username"), "test"));
  await waitFor(() => user.type(screen.getByLabelText("password"), "test"));
  await waitFor(() => user.click(screen.getByLabelText("submit")));
  await waitFor(() => expect(screen.getByText(/submit/i)).toBeInTheDocument());
  await waitFor(() => expect(screen.getByLabelText("username")).toBeInTheDocument());
  await waitFor(() => expect(screen.getByLabelText("password")).toBeInTheDocument());
  expect(fetch).toHaveBeenCalledTimes(1); // Check that fetch was called once
});
