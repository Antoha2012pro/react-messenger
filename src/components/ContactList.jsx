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
                            <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 16, padding: "12px 0 12px 24px", backgroundColor: activeChatId === chat.id ? "#006eff60" : "transparent", }}>
                                <img src={otherUser.avatar} alt="Avatar" style={{ width: 64, height: 64, borderRadius: "50%", border: "1px solid #4E4E4E", backgroundColor: "#00000060" }} />
                                <div className="chat-info">
                                    <h2 style={{color: "var(--title)"}}>{otherUser.name}</h2>
                                    <p>{otherUser.isTyping
                                        ? "Пише..."
                                        : lastMessage?.text || "Немає повідомленнь"}</p>
                                </div>
                            </div>
                        </button>
                    );
                })}
        </div>
    );
};

export default ContactList;