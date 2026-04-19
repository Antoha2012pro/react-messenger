import { useEffect, useState } from "react";
import ContactList from "./components/ContactList";
import ChatWindow from "./components/ChatWindow";
import AsideLogo from "./components/AsideLogo";
import { ThemeContext } from "./ThemeContext";
import { ThemeProvider } from "styled-components";
import { lightTheme, darkTheme } from "./styles/theme";
import {
  GlobalStyles,
  AppLayout,
  AppSidebar,
  AppChat,
  ChatEmpty,
  ResizeHandleStyled,
} from "./styles/app.styled";

const currentUserId = "u2";

const users = [
  {
    id: "u1",
    name: "Анна",
    avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSsc3WLwt1VO_zCe9FTBOByMFq7iya4QO38gA&s",
    isTyping: false,
    isOnline: false,
  },
  {
    id: "u2",
    name: "Я",
    avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSsc3WLwt1VO_zCe9FTBOByMFq7iya4QO38gA&s",
    isTyping: false,
    isOnline: true,
  },
  {
    id: "u3",
    name: "Макс",
    avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSfcbg4vgnOEYx67CzLzBbmfSYJ82mdXVA08g&s",
    isTyping: true,
    isOnline: true,
  },
];

const chats = [
  { id: "c1", members: ["u1", "u2"] },
  { id: "c2", members: ["u2", "u3"] },
];

const initialMessages = [
  {
    id: "m1",
    chatId: "c1",
    senderId: "u1",
    text: "Привет",
    createdAt: "2026-04-18T17:11:26.542Z",
  },
  {
    id: "m2",
    chatId: "c1",
    senderId: "u2",
    text: "Дароу!",
    createdAt: "2026-04-18T17:12:26.542Z",
  },
  {
    id: "m3",
    chatId: "c2",
    senderId: "u3",
    text: "Ты тут?",
    createdAt: "2024-04-16T17:14:26.542Z",
  },
];

function App() {
  const [theme, setTheme] = useState("dark");
  const [activeChatId, setActiveChatId] = useState(null);
  const [messages, setMessages] = useState(initialMessages);

  const [sidebarWidth, setSidebarWidth] = useState(390);
  const [isResizing, setIsResizing] = useState(false);

  useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = event => {
      if (window.innerWidth <= 768) return;

      const minWidth = 280;
      const maxWidth = 600;

      const nextWidth = Math.max(minWidth, Math.min(maxWidth, event.clientX));
      setSidebarWidth(nextWidth);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing]);

  const handleDeleteMessage = messageId => {
    setMessages(prev => prev.filter(message => message.id !== messageId));
  };

  const toggleTheme = () => {
    setTheme(prev => (prev === "dark" ? "light" : "dark"));
  };

  const activeChat = chats.find(chat => chat.id === activeChatId) || null;

  const activeMessages = activeChatId
    ? messages.filter(message => message.chatId === activeChatId)
    : [];

  const otherUserId = activeChat?.members.find(id => id !== currentUserId);
  const activeUser = users.find(user => user.id === otherUserId) || null;

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
      <ThemeProvider theme={theme === "dark" ? darkTheme : lightTheme}>
        <GlobalStyles />

        <AppLayout>
          <AppSidebar $chatOpen={!!activeChatId} $width={sidebarWidth}>
            <AsideLogo />
            <ContactList
              chats={chats}
              users={users}
              messages={messages}
              currentUserId={currentUserId}
              activeChatId={activeChatId}
              onSelectChat={setActiveChatId}
            />
          </AppSidebar>

          <ResizeHandleStyled
            onMouseDown={event => {
              event.preventDefault();
              setIsResizing(true);
            }}
          />

          <AppChat $chatOpen={!!activeChatId}>
            {activeUser ? (
              <ChatWindow
                key={activeChatId}
                activeUser={activeUser}
                activeMessages={activeMessages}
                currentUserId={currentUserId}
                onSendMessage={handleSendMessage}
                onDeleteMessage={handleDeleteMessage}
                onBack={() => setActiveChatId(null)}
              />
            ) : (
              <ChatEmpty>Выбери чат</ChatEmpty>
            )}
          </AppChat>
        </AppLayout>
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}

export default App;