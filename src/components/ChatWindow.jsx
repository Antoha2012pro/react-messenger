import { useState } from "react";
import { useTheme } from "../ThemeContext";

const ChatWindow = ({
    activeUser,
    activeMessages,
    currentUserId,
    onSendMessage,
}) => {
    const [messageText, setMessageText] = useState("");
    const { theme } = useTheme();

    const handleSubmit = e => {
        e.preventDefault();

        if (!messageText.trim()) return;

        onSendMessage(messageText);
        setMessageText("");
    };

    return (
        <main style={{
            display: "flex",
            flexDirection: "column",
            height: "100vh",
            minHeight: 0,
            width: "100%",
            backgroundColor: "var(--bg)",
        }}>
            <div style={{
                display: "flex", flexDirection: "row", alignItems: "center", gap: 18,
                borderBottom: "1px solid #303030",
                padding: "16px 0 16px 46px"
            }}>
                <img src={activeUser.avatar} alt="Avatar" style={{ width: 64, height: 64, borderRadius: "50%", border: "1px solid #4E4E4E", backgroundColor: "#00000060" }} />
                <span style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                    <h2>{activeUser.name}</h2>
                    <p>{activeUser.isOnline ? "В мережі" : "Поза мережою"}</p>
                </span>
            </div>

            <div style={{
                flex: 1,
                overflowY: "auto",
                overflowX: "hidden",
                minHeight: 0,
                padding: "16px 66px 26px 46px",
            }}>
                {activeMessages.map(message => (
                    <div style={{
                        backgroundColor: message.senderId !== currentUserId
                            ? "var(--msg-bcg)"
                            : "#00A3FF"
                    }}>
                        {message.senderId !== currentUserId && (<img src={activeUser.avatar} alt="" style={{ width: 64, height: 64, borderRadius: "50%", border: "1px solid #4E4E4E", backgroundColor: "#00000060" }} />)}
                        <p
                            key={message.id}
                            style={{
                                textAlign: message.senderId === currentUserId ? "right" : "left",
                                marginBottom: "12px",
                                color: theme === "light" && message.senderId !== currentUserId
                                    ? "black"
                                    : "white"
                            }}
                        >
                            {message.text}
                        </p>
                    </div>

                ))}
            </div>

            <form onSubmit={handleSubmit} style={{
                flexShrink: 0,
                borderTop: "1px solid #303030",
                padding: "22px 46px 22px 46px",
                display: "flex",
                gap: "10px",
            }}>
                <input
                    type="text"
                    value={messageText}
                    onChange={e => setMessageText(e.target.value)}
                    placeholder="Введите сообщение"
                />
                <button type="submit" style={{ color: "white" }}>Отправить</button>
            </form>
        </main>
    );
};

export default ChatWindow;