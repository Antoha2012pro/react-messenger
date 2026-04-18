import ProfileImg from "./ProfileImg";

const ContactList = ({
    chats,
    users,
    messages,
    currentUserId,
    activeChatId,
    onSelectChat,
}) => {
    return (
        <div>
            {chats.map(chat => {
                const otherUserId = chat.members.find(id => id !== currentUserId);
                const otherUser = users.find(user => user.id === otherUserId);

                const chatMessages = messages.filter(message => message.chatId === chat.id);
                const lastMessage = chatMessages[chatMessages.length - 1];

                return (
                    <button
                        key={chat.id}
                        onClick={() => onSelectChat(chat.id)}
                        style={{
                            display: "block",
                            marginBottom: "10px",
                            fontWeight: activeChatId === chat.id ? "bold" : "normal",
                            padding: 0,
                            width: "100%"
                        }}
                    >
                        <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 16, padding: "12px 0 12px 24px", width: "100%", backgroundColor: activeChatId === chat.id ? "var(--сontact-bg-color)" : "transparent", }}>
                            <ProfileImg url={otherUser.avatar} />
                            <div className="chat-info" style={{ position: "relative", width: "100%", textAlign: "start" }}>
                                <h2 style={{ color: "var(--title)", width: "100%", maxWidth: "200px" }}>{otherUser.name}</h2>
                                <p style={{
                                    color: otherUser.isTyping
                                        ? "#00A3FF"
                                        : "var(--text)", width: "100%", maxWidth: "250px"
                                }}>{otherUser.isTyping
                                    ? "Пише..."
                                    : lastMessage?.text || "Немає повідомленнь"}</p>
                                <p style={{ position: "absolute", inset: "0 8px auto auto" }}>{lastMessage
                                    ? new Date(lastMessage?.createdAt).toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })
                                    : ""}</p>
                            </div>
                        </div>
                    </button>
                );
            })}
        </div>
    );
};

export default ContactList;