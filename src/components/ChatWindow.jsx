import { useState } from "react";
import { useTheme } from "../ThemeContext";
import ProfileImg from "./ProfileImg";
import { ButtonContextMenuStyled, InputMessageStyled } from "../styles/ChatWindow.styled";
import { formatMessageTime } from "../utils/formatMessageTime";

const ChatWindow = ({
    activeUser,
    activeMessages,
    currentUserId,
    onSendMessage,
    onDeleteMessage,
}) => {
    const [messageText, setMessageText] = useState("");
    const [menu, setMenu] = useState({
        isOpen: false,
        x: 0,
        y: 0,
        messageId: null,
    });
    const { theme } = useTheme();

    const openMenu = (event, messageId) => {
        event.preventDefault();

        const isRightClick = event.type === "contextmenu";

        setMenu({
            isOpen: true,
            x: isRightClick ? event.clientX : event.currentTarget.getBoundingClientRect().right - 160,
            y: isRightClick ? event.clientY : event.currentTarget.getBoundingClientRect().bottom + 6,
            messageId,
        });
    };

    const closeMenu = () => {
        setMenu({
            isOpen: false,
            x: 0,
            y: 0,
            messageId: null,
        });
    };

    const handleSubmit = event => {
        event.preventDefault();

        if (!messageText.trim()) return;

        onSendMessage(messageText);
        setMessageText("");
    };

    const isGroupedMessage = (messages, index) => {
        if (index === 0) return false;

        const prev = messages[index - 1];
        const current = messages[index];

        return (
            prev.senderId === current.senderId &&
            new Date(current.createdAt) - new Date(prev.createdAt) <= 5 * 60 * 1000
        );
    };

    const formatDayLabel = dateString => {
        const date = new Date(dateString);

        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();

        return `${day}.${month}.${year}`;
    };

    const isNewDay = (messages, index) => {
        if (index === 0) return true;

        const prev = new Date(messages[index - 1].createdAt);
        const current = new Date(messages[index].createdAt);

        return prev.toDateString() !== current.toDateString();
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
            }}>
                {activeMessages.map((message, index) => {
                    const isGrouped = isGroupedMessage(activeMessages, index);
                    const isOwn = message.senderId === currentUserId;
                    const showDayLabel = isNewDay(activeMessages, index);

                    return (
                        <div onClick={() => {
                            if (menu.isOpen) {

                                closeMenu();
                            }
                        }} key={message.id}>
                            {showDayLabel && (
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "center",
                                        margin: "12px 0 20px",
                                    }}
                                >
                                    <span
                                        style={{
                                            padding: "6px 12px",
                                            borderRadius: 999,
                                            backgroundColor: "var(--date-chat-color)",
                                            color: "var(--text)",
                                            fontSize: 14,
                                        }}
                                    >
                                        {formatDayLabel(message.createdAt)}
                                    </span>
                                </div>
                            )}
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: isOwn ? "flex-end" : "flex-start",
                                    width: "100%",
                                    marginTop: index === 0 ? 0 : isGrouped ? 4 : 10,
                                }}
                            >
                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "row",
                                        gap: isOwn ? 0 : 14,
                                        alignItems: "flex-start",
                                        width: "fit-content",
                                        maxWidth: "70%",
                                    }}
                                >
                                    {!isOwn && (
                                        isGrouped
                                            ? <div style={{ width: 40, flexShrink: 0 }} />
                                            : <ProfileImg url={activeUser.avatar} size="small" />
                                    )}

                                    <div
                                        style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: 12,
                                            alignItems: isOwn ? "flex-end" : "flex-start",
                                            textAlign: isOwn ? "right" : "left",
                                        }}
                                    >
                                        {!isGrouped && (
                                            <div style={{ display: "flex", flexDirection: isOwn ? "row-reverse" : "row", gap: 16, alignItems: "center" }}>
                                                {!isOwn ? (
                                                    <h3 style={{ color: "var(--title)" }}>{activeUser.name}</h3>
                                                ) : <h3 style={{ color: "var(--title)" }}>Ви</h3>}
                                                <p>
                                                    {formatMessageTime(message.createdAt)}
                                                </p>
                                            </div>
                                        )}

                                        <div style={{display: "flex", gap: 6, flexDirection: isOwn ? "row-reverse" : "row",}}>

                                            <p
                                                onContextMenu={(e) => openMenu(e, message.id)}
                                                style={{
                                                    backgroundColor: !isOwn ? "var(--msg-bcg)" : "#00A3FF",
                                                    padding: "16px 24px",
                                                    borderRadius: !isOwn ? "0 14px 14px 14px" : "14px 0 14px 14px",
                                                    color: theme === "light" && !isOwn ? "black" : "white",
                                                    maxWidth: "100%",
                                                    wordBreak: "break-word",
                                                    overflowWrap: "anywhere",
                                                    whiteSpace: "pre-wrap",
                                                    textAlign: "start",
                                                }}
                                            >
                                                {message.text}
                                            </p>
                                            <ButtonContextMenuStyled
                                                onClick={(e) => openMenu(e, message.id)}
                                            >
                                                ⋮
                                            </ButtonContextMenuStyled>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}

                {menu.isOpen && (
                    <div
                        style={{
                            position: "fixed",
                            top: menu.y,
                            left: menu.x,
                            backgroundColor: "#111",
                            color: "#fff",
                            borderRadius: 12,
                            padding: 8,
                            display: "flex",
                            flexDirection: "column",
                            gap: 8,
                            zIndex: 1000,
                            minWidth: 160,
                            boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
                        }}
                    >
                        <button
                            onClick={() => {
                                onDeleteMessage(menu.messageId);
                                closeMenu();
                            }}
                            style={{ color: "red", textAlign: "left" }}
                        >
                            Удалить
                        </button>

                        <button
                            onClick={() => {
                                closeMenu();
                            }}
                            style={{ textAlign: "left" }}
                        >
                            Закрыть
                        </button>
                    </div>
                )}
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
                        onChange={event => setMessageText(event.target.value)}
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
        </main >
    );
};

export default ChatWindow;