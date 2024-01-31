import React from 'react';
import {render, screen, waitFor} from '@testing-library/react';
import {MemoryRouter} from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import NavigationBar from './components/NavigationBar';
import {act} from "react-dom/test-utils";

const sessionStorageEvent = new Event("sessionStorageEvent");
const props = { setBanner: jest.fn().mockResolvedValueOnce({message: null, variant: null}),
  banner: {message: null, variant: null},
  sessionStorageEvent: sessionStorageEvent};

const renderWithRouter = (ui, { route = '/' } = {}) => {
  window.history.pushState({}, 'Test page', route);
  return render(ui, { wrapper: MemoryRouter });
};

describe('NavigationBar', () => {

  test('renders Home Page link', async () => {
    const user = userEvent.setup();
    renderWithRouter(<NavigationBar {...props}/>);
    const homeLink = screen.getByText('Movie Time');
    expect(homeLink).toBeInTheDocument();
    await waitFor(() => user.click(homeLink));
    expect(homeLink).toBeInTheDocument();
  });

  test('renders Login link when not logged in', async () => {
    const user = userEvent.setup();
    renderWithRouter(<NavigationBar {...props}/>);
    const loginLink = screen.getByText('Login');
    expect(loginLink).toBeInTheDocument();
    await waitFor(() => user.click(loginLink));
    expect(loginLink).toBeInTheDocument();
  });

  test('renders View Profile link when logged in', async () => {
    const user = userEvent.setup();
    sessionStorage.setItem('user', "12345");
    renderWithRouter(<NavigationBar {...props}/>);
    await act(async () => {document.dispatchEvent(sessionStorageEvent)});
    const profileLink = screen.getByText('View Profile');
    expect(profileLink).toBeInTheDocument();
    await waitFor(() => user.click(profileLink));
    expect(profileLink).toBeInTheDocument();
    sessionStorage.clear();
  });

  test('renders Logout link when logged in', async() => {
    const user = userEvent.setup();
    sessionStorage.setItem('user', "12345");
    renderWithRouter(<NavigationBar {...props}/>);
    await act(async () => {document.dispatchEvent(sessionStorageEvent)});
    const logoutLink = screen.getByText('Logout');
    expect(logoutLink).toBeInTheDocument();
    await waitFor(() => user.click(logoutLink));
    expect(logoutLink).not.toBeInTheDocument();
    sessionStorage.clear();
  });

  test('does not render Login link when logged in', async () => {
    sessionStorage.setItem('user', "12345");
    renderWithRouter(<NavigationBar {...props}/>);
    await act(async () => {
      document.dispatchEvent(sessionStorageEvent)
    });
    const loginLink = screen.queryByText('Login');
    expect(loginLink).not.toBeInTheDocument();
    sessionStorage.clear();
  });

  test('does not render View Profile link when not logged in', () => {
    renderWithRouter(<NavigationBar {...props}/>);
    const profileLink = screen.queryByText('View Profile');
    expect(profileLink).not.toBeInTheDocument();
  });

   test('does not render Logout link when not logged in', () => {
      renderWithRouter(<NavigationBar {...props}/>);
      const logoutLink = screen.queryByText('Logout');
      expect(logoutLink).not.toBeInTheDocument();
   });
});
