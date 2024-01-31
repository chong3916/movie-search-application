const login = async (username, password) => {
  const payload = {
    username,
    password
  };
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });
  return response;
};

const signup = async (username, password) => {
  const payload = {
    username,
    password
  };

  const response = await fetch("/api/auth/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  return await response.json();
};

const validateUserId = async (userId) => {
  const response = await fetch(`/api/users/${userId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  });
  
  if (response.status !== 200) {
    return false;
  }
  return true;
};

export const Auth = {
  login,
  signup,
  validateUserId
};