const getByUserId = async (userId) => {
    const response = await fetch(`/api/lists/${userId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })
    return response.json();
}

const getPublic = async () => {
    const response = await fetch("/api/lists/public", {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    });
    return response.json();
}

const getListById = async (listId, userId) => {
    const publicLists = await getPublic();
    const userLists = await getByUserId(userId);

    // find returns first list matching List ID
    return [...publicLists, ...userLists].find(list => list.listId === listId);
}

const newListWithMovies = async (userId, newListName, privacy, movieIds) => {
    const response = await fetch("/api/lists/new/withMovies", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            newListRequest: {uuid: userId, listName: newListName, privacy: privacy},
            movieIds: movieIds
        })
    });
    return response;
}

const newListWithoutMovies = async (userId, newListName, privacy) => {
    const response = await fetch("/api/lists/new", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({uuid: userId, listName: newListName, privacy: privacy})
    });
    return response;
}


export const List = {
    getByUserId,
    getPublic,
    getListById,
    newListWithMovies,
    newListWithoutMovies
}