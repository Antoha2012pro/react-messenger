const API_URL = "http://localhost:5000/api";

const getToken = () => localStorage.getItem("token");

const getHeaders = (withAuth = false) => {
  const headers = {
    "Content-Type": "application/json",
  };

  if (withAuth) {
    const token = getToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  return headers;
};

const handleResponse = async response => {
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Ошибка запроса");
  }

  return data;
};

export const api = {
  register: async body => {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(body),
    });

    return handleResponse(response);
  },

  login: async body => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(body),
    });

    return handleResponse(response);
  },

  getMe: async () => {
    const response = await fetch(`${API_URL}/auth/me`, {
      method: "GET",
      headers: getHeaders(true),
    });

    return handleResponse(response);
  },

  getUsers: async () => {
    const response = await fetch(`${API_URL}/users`, {
      method: "GET",
      headers: getHeaders(true),
    });

    return handleResponse(response);
  },

  createDirectChat: async userId => {
    const response = await fetch(`${API_URL}/chats/direct`, {
      method: "POST",
      headers: getHeaders(true),
      body: JSON.stringify({ userId }),
    });

    return handleResponse(response);
  },
};