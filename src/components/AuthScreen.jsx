import { useState } from "react";
import { authApi } from "../lib/api";

const AuthScreen = ({ onAuthSuccess }) => {
    const [mode, setMode] = useState("login");
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleSubmit = async event => {
        event.preventDefault();
        setIsLoading(true);
        setMessage("");

        try {
            const data =
                mode === "login"
                    ? await authApi.login({ email, password })
                    : await authApi.register({ email, username, password });

            localStorage.setItem("token", data.token);
            onAuthSuccess(data.user);
        } catch (error) {
            setMessage(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                display: "grid",
                placeItems: "center",
                padding: 24,
            }}
        >
            <form
                onSubmit={handleSubmit}
                style={{
                    width: "100%",
                    maxWidth: 380,
                    display: "flex",
                    flexDirection: "column",
                    gap: 12,
                    padding: 24,
                    borderRadius: 16,
                    border: "1px solid #333",
                    background: "#1b1b1b",
                }}
            >
                <h1 style={{ margin: 0, fontSize: 24 }}>
                    {mode === "login" ? "Вход" : "Регистрация"}
                </h1>

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={event => setEmail(event.target.value)}
                    required
                />

                {mode === "register" && (
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={event => setUsername(event.target.value)}
                        required
                    />
                )}

                <input
                    type="password"
                    placeholder="Пароль"
                    value={password}
                    onChange={event => setPassword(event.target.value)}
                    required
                    minLength={6}
                />

                <button type="submit" disabled={isLoading}>
                    {isLoading
                        ? "Подожди..."
                        : mode === "login"
                            ? "Войти"
                            : "Создать аккаунт"}
                </button>

                <button
                    type="button"
                    onClick={() =>
                        setMode(prev => (prev === "login" ? "register" : "login"))
                    }
                >
                    {mode === "login"
                        ? "Нет аккаунта? Зарегистрироваться"
                        : "Уже есть аккаунт? Войти"}
                </button>

                {message && <p style={{ margin: 0 }}>{message}</p>}
            </form>
        </div>
    );
};

export default AuthScreen;