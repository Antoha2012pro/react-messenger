import { useState } from "react";
import "./App.css";
import ContactList from "./components/ContactList";
import ChatWindow from "./components/ChatWindow";
import AsideLogo from "./components/AsideLogo";
import { ThemeContext } from "./ThemeContext";

const currentUserId = "u2";

const users = [
  {
    id: "u1", name: "Анна", avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSsc3WLwt1VO_zCe9FTBOByMFq7iya4QO38gA&s",
    isTyping: false, isOnline: false
  },
  {
    id: "u2", name: "Я", avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSsc3WLwt1VO_zCe9FTBOByMFq7iya4QO38gA&s",
    isTyping: false, isOnline: true
  },
  {
    id: "u3", name: "Макс", avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSfcbg4vgnOEYx67CzLzBbmfSYJ82mdXVA08g&s",
    isTyping: true, isOnline: true
  },
];

const chats = [
  { id: "c1", members: ["u1", "u2"] },
  { id: "c2", members: ["u2", "u3"] },
];

const initialMessages = [
  { id: "m1", chatId: "c1", senderId: "u1", text: "Привет", createdAt: "2026-04-18T17:11:26.542Z", },
  { id: "m2", chatId: "c1", senderId: "u2", text: "Привет!", createdAt: "2026-04-18T17:12:26.542Z", },
  { id: "m3", chatId: "c2", senderId: "u3", text: "Ты тут?", createdAt: "2026-04-18T17:14:26.542Z", },
];

function App() {
  const [theme, setTheme] = useState("dark");
  const [activeChatId, setActiveChatId] = useState("c2");
  const [messages, setMessages] = useState(initialMessages);
  // console.log(messages);
  // console.log(activeChatId);
  
  

  const toggleTheme = () => {
    setTheme(prev => (prev === "dark" ? "light" : "dark"));
  };

  const activeChat = chats.find(chat => chat.id === activeChatId);

  const activeMessages = messages.filter(
    message => message.chatId === activeChatId
  );

  const otherUserId = activeChat.members.find(id => id !== currentUserId);
  const activeUser = users.find(user => user.id === otherUserId);

  const handleSendMessage = text => {
    const trimmedText = text.trim();

    if (!trimmedText) return;

    const newMessage = {
      id: Date.now().toString(),
      chatId: activeChatId,
      senderId: currentUserId,
      text: trimmedText,
      createdAt: new Date().toISOString(),
    };

    setMessages(prev => [...prev, newMessage]);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
    <div data-theme={theme} style={{ display: "flex", flexDirection: "row", backgroundColor: "var(--bg)", }}>
      <aside style={{ width: "100%", maxWidth: "390px", borderRight: "1px solid #303030" }}>
        <AsideLogo />
        <ContactList
          chats={chats}
          users={users}
          messages={messages}
          currentUserId={currentUserId}
          activeChatId={activeChatId}
          onSelectChat={setActiveChatId}
        />
      </aside>

      <ChatWindow
        key={activeChatId}
        activeUser={activeUser}
        activeMessages={activeMessages}
        currentUserId={currentUserId}
        onSendMessage={handleSendMessage}
      />
    </div>
    </ThemeContext.Provider>
  );
}

export default App;