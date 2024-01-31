export const watchlist = (numberOfMovies, privacy) => ({
    listId: 1,
    listName: "Test List",
    movieIds: numberOfMovies === 0 ? null : Array(numberOfMovies).fill("680"),
    privacy: privacy
});

export const watchlistWithId = (listId, numberOfMovies, privacy) => ({
    listId: listId,
    listName: "Test List" + listId.toString(),
    movieIds: numberOfMovies === 0 ? null : Array.from(Array(numberOfMovies), (_, index) => index.toString()),
    privacy: privacy
});

export const watchlistWithIdAndName = (listId, listName, numberOfMovies, privacy) => ({
    listId: listId,
    listName: listName,
    movieIds: numberOfMovies === 0 ? null : Array.from(Array(numberOfMovies), (_, index) => index.toString()),
    privacy: privacy
});

export const movieDetails = {
    title: "Pulp Fiction",
    overview: "A description",
    genres: [
        {
            id: "53",
            name: "Genre"
        },
    ],
    cast: null,
    director: null,
    movieId: "680",
    releaseDate: "1994-09-10",
    posterPath: "https://image.tmdb.org/t/p/original/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg",
    productionCompanies: [
        {
            id: "14",
            name: "Producer"
        },
    ],
    backdropPath: "https://image.tmdb.org/t/p/w1280/suaEOtk1N1sgg2MTM7oZd2cfVp3.jpg"
};

export const multipleMovieDetails = (numberOfMovies) => (
    Array(numberOfMovies).fill(movieDetails)
);

export const multipleWatchlists = (numberOfWatchlists, numberOfMovies, privacy) => (
    Array(numberOfWatchlists).fill(watchlist(numberOfMovies, privacy))
);

export const multipleWatchlistsWithId = (numberOfWatchlists, numberOfMovies, privacy, listIds) => (
    Array.from(Array(numberOfWatchlists), (_, index) => watchlistWithId(listIds[index], numberOfMovies, privacy))
);

export const multipleWatchlistsWithIdAndName = (numberOfWatchlists, numberOfMovies, privacy, listIds, listNames) => (
    Array.from(Array(numberOfWatchlists), (_, index) => watchlistWithIdAndName(listIds[index], listNames[index], numberOfMovies, privacy))
);

export const mockUser = { uuid: "51234", username: "user", password: "test" };
