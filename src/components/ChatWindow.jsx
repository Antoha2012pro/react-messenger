import { useState } from "react";
import { useTheme } from "../ThemeContext";
import ProfileImg from "./ProfileImg";
import { InputMessageStyled } from "../styles/ChatWindow.styled";

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
                <ProfileImg url={activeUser.avatar} />
                <span style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                    <h2 style={{ color: "var(--сontact-name-color)" }}>{activeUser.name}</h2>
                    <p style={{ color: activeUser.isOnline ? "#00A3FF" : "var(--text)" }}>{activeUser.isOnline ? activeUser.isTyping ? "Пише..." : "В мережі" : "Поза мережою"}</p>
                </span>
            </div>

            <div style={{
                flex: 1,
                overflowY: "auto",
                overflowX: "hidden",
                minHeight: 0,
                padding: "16px 66px 26px 46px",
                display: "flex",
                flexDirection: "column",
                gap: 20,
            }}>
                {activeMessages.map(message => (
                    <div key={message.id} style={{
                        display: "flex",
                        flexDirection: "row",
                        gap: 14,
                        alignItems: "start",
                        margin: message.senderId !== currentUserId
                                        ? "0 auto 0 0"
                                        : "0 0 0 auto",
                    }}>
                        {message.senderId !== currentUserId && (<ProfileImg url={activeUser.avatar} size="small" />)}
                        <div style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 12,
                            alignItems: "start",
                            width: "100%",
                            textAlign: message.senderId === currentUserId ? "right" : "left",
                        }}>
                            <div style={{ display: "flex", flexDirection: "row", gap: 16 }}>
                                {message.senderId !== currentUserId && (<h3 style={{ color: "var(--title)" }}>{activeUser.name}</h3>)}
                                <p>{message
                                    ? new Date(message?.createdAt).toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        second: "2-digit",
                                    })
                                    : ""}</p>
                            </div>
                            <p
                                style={{
                                    backgroundColor: message.senderId !== currentUserId
                                        ? "var(--msg-bcg)"
                                        : "#00A3FF",
                                    padding: "16px 24px 16px 24px",
                                    borderRadius: message.senderId !== currentUserId
                                        ? "0 14px 14px 14px"
                                        : "14px 0 14px 14px",
                                    marginBottom: "12px",
                                    color: theme === "light" && message.senderId !== currentUserId
                                        ? "black"
                                        : "white"
                                }}
                            >
                                {message.text}
                            </p>
                        </div>
                    </div>

                ))}
            </div>

            <form onSubmit={handleSubmit} style={{
                flexShrink: 0,
                borderTop: "1px solid #303030",
                padding: "22px 46px 22px 46px",
                display: "flex",
                justifyContent: "space-between",
            }}>
                <div style={{
                    display: "flex", flexDirection: "row",
                    alignItems: "center", gap: 16,
                    width: "100%"
                }}>
                    <button>😊</button>
                    <InputMessageStyled
                        className="chat-window-input"
                        type="text"
                        value={messageText}
                        onChange={e => setMessageText(e.target.value)}
                        placeholder="Введите сообщение"
                    />
                </div>
                <div style={{
                    display: "flex", flexDirection: "row",
                    alignItems: "center", gap: 20
                }}>
                    <button>🎙️</button>
                    <button>📂</button>
                    <button type="submit" style={{
                        color: "white", padding: "10px 18px 10px 18px",
                        borderRadius: 12,
                        backgroundColor: "#00A3FF",
                        display: "flex",
                        flexDirection: "row",
                        gap: 8,
                    }}>Send</button>
                </div>
            </form>
        </main>
    );
};

export default ChatWindow;