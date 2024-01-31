const getById = async (movieId) => {
  const response = await fetch(`/api/movie/${movieId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  });
  return response.json();
};

const getManyById = async (movieIds) => {
  const response = await fetch(`/api/movie/list`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(movieIds)
  });
  return response.json();
}

export const Movie = {
  getById,
  getManyById
};
