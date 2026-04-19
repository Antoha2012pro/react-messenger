import { useState } from "react";
import { supabase } from "../lib/supabase";

const AuthScreen = () => {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async event => {
    event.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      const action =
        mode === "login"
          ? supabase.auth.signInWithPassword({ email, password })
          : supabase.auth.signUp({ email, password });

      const { error } = await action;

      if (error) {
        setMessage(error.message);
      } else {
        setMessage(
          mode === "login"
            ? "Вход выполнен"
            : "Аккаунт создан. Проверь почту, если у тебя включено подтверждение email."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24 }}>
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