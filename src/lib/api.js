const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

async function apiRequest(path, options = {}) {
    const token = localStorage.getItem("token");

    const headers = {
        "Content-Type": "application/json",
        ...(options.headers || {}),
    };

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}${path}`, {
        ...options,
        headers,
    });

    const contentType = response.headers.get("content-type");
    const isJson = contentType && contentType.includes("application/json");
    const data = isJson ? await response.json() : await response.text();

    if (!response.ok) {
        const message =
            typeof data === "object" && data?.message
                ? data.message
                : "Ошибка запроса";
        throw new Error(message);
    }

    return data;
}

export const authApi = {
    register: ({ email, username, password }) =>
        apiRequest("/api/auth/register", {
            method: "POST",
            body: JSON.stringify({ email, username, password }),
        }),

    login: ({ email, password }) =>
        apiRequest("/api/auth/login", {
            method: "POST",
            body: JSON.stringify({ email, password }),
        }),

    getMe: () =>
        apiRequest("/api/auth/me", {
            method: "GET",
        }),
};

export const usersApi = {
    getUsers: () =>
        apiRequest("/api/users", {
            method: "GET",
        }),
};

export const chatsApi = {
    createDirectChat: userId =>
        apiRequest("/api/chats/direct", {
            method: "POST",
            body: JSON.stringify({ userId }),
        }),
    getMessages: chatId =>
        apiRequest(`/api/chats/${chatId}/messages`, {
            method: "GET",
        }),

    sendMessage: ({ chatId, text }) =>
        apiRequest("/api/messages", {
            method: "POST",
            body: JSON.stringify({ chatId, text }),
        }),
};