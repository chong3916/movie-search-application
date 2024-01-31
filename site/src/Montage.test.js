import { cleanup, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { act } from 'react-dom/test-utils';
import { BrowserRouter } from 'react-router-dom';
import userEvent from "@testing-library/user-event";
import Montage from './pages/Montage';
import WatchlistMoviesPage from './pages/WatchlistMoviesPage';
import { multipleMovieDetails, multipleWatchlists, movieDetails } from './fixtures';

const props = { setBanner: jest.fn().mockResolvedValueOnce({message: null, variant: null})};

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useParams: () => ({
        listId: 1
    }),
}));

beforeEach(() => {
    fetch.resetMocks();
});

afterEach(() => {
    window.history.pushState(null, document.title, "/");
    cleanup();
    window.sessionStorage.clear();
})

describe('Montage', () => {
    test('renders error message when less than 10 images', async () => {
        const numberOfMovies = 1;
        window.sessionStorage.setItem("user", "51234");
        fetch.mockResponseOnce(JSON.stringify(multipleWatchlists(1, numberOfMovies, true)))
            .mockResponseOnce(JSON.stringify(multipleWatchlists(1, numberOfMovies, true)))
            .mockResponseOnce(JSON.stringify(multipleMovieDetails(numberOfMovies)));
        
        await act(async () => {render(<Montage/>, { wrapper: BrowserRouter})});
        await waitFor(() => expect(screen.getByText("Error: cannot load ten or more images for montage.")).toBeInTheDocument());
        await waitFor(() => expect(screen.getAllByAltText("Movie Image")).toHaveLength(numberOfMovies*2));
        await waitFor(() => expect(fetch).toHaveBeenCalledTimes(3));
    })

    test('renders error message when no images are availabe', async () => {
        const numberOfMovies = 0;
        window.sessionStorage.setItem("user", "51234");
        fetch.mockResponseOnce(JSON.stringify(multipleWatchlists(1, numberOfMovies, true)))
            .mockResponseOnce(JSON.stringify(multipleWatchlists(1, numberOfMovies, true)))
        
        await act(async () => {render(<Montage/>, { wrapper: BrowserRouter})});
        await waitFor(() => expect(screen.getByText("Error: cannot load ten or more images for montage.")).toBeInTheDocument());
        await waitFor(() => expect(fetch).toHaveBeenCalledTimes(2));
    })

    test('renders image when 10 or more images', async () => {
        window.sessionStorage.setItem("user", "51234");
        const numberOfMovies = 5;
        fetch.mockResponseOnce(JSON.stringify(multipleWatchlists(1, numberOfMovies, true)))
            .mockResponseOnce(JSON.stringify(multipleWatchlists(1, numberOfMovies, true)))
            .mockResponseOnce(JSON.stringify(multipleMovieDetails(numberOfMovies)));
        
        await act(async ()=> {render(<Montage/>, { wrapper: BrowserRouter})});
        await waitFor(() => expect(screen.getAllByAltText("Movie Image")).toHaveLength(numberOfMovies*2));
        await waitFor(() => expect(fetch).toHaveBeenCalledTimes(3));
    })

    test('render montage page from WatchlistMoviesPage', async () => {
        window.sessionStorage.setItem("user","51234");
        const user = userEvent.setup();

        fetch.mockResponseOnce(JSON.stringify(multipleWatchlists(1, 1, true)))
            .mockResponseOnce(JSON.stringify(multipleMovieDetails(1)))
            .mockResponseOnce(JSON.stringify(multipleMovieDetails(1)))
            .mockResponseOnce(JSON.stringify(multipleWatchlists(1, 1, true)))
            .mockResponseOnce(JSON.stringify(movieDetails));
    
        await act(async () => {render(<WatchlistMoviesPage {...props}/>, { wrapper: BrowserRouter }) });

        fetch.mockResponseOnce(JSON.stringify(multipleWatchlists(1, 1, true)))
            .mockResponseOnce(JSON.stringify(multipleWatchlists(1, 1, true)))
            .mockResponseOnce(JSON.stringify(multipleMovieDetails(1)));
        await waitFor(() => user.click(screen.getByText('View Montage')));
    
        await waitFor(() => expect(fetch).toHaveBeenCalledTimes(5));
    })
});