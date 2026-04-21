import { useEffect, useState } from "react";
import ContactList from "./components/ContactList";
import ChatWindow from "./components/ChatWindow";
import AsideLogo from "./components/AsideLogo";
import AuthScreen from "./components/AuthScreen";
import { ThemeContext } from "./ThemeContext";
import { ThemeProvider } from "styled-components";
import { authApi, usersApi, chatsApi } from "./lib/api";
import { lightTheme, darkTheme } from "./styles/theme";
import {
  GlobalStyles,
  AppLayout,
  AppSidebar,
  AppChat,
  ChatEmpty,
  ResizeHandleStyled,
} from "./styles/app.styled";
import {
  normalizeMessage,
  mapUserToContact,
  buildDirectChats,
  getOtherUserId,
} from "./utils/chat";

function App() {
  const [theme, setTheme] = useState("dark");
  const [activeChatId, setActiveChatId] = useState(null);
  const [messages, setMessages] = useState([]);

  const [sidebarWidth, setSidebarWidth] = useState(390);
  const [isResizing, setIsResizing] = useState(false);

  const [authLoading, setAuthLoading] = useState(true);

  const [currentUser, setCurrentUser] = useState(null);
  const [contacts, setContacts] = useState([]);

  const [serverChatId, setServerChatId] = useState(null);

  const currentUserId = currentUser ? String(currentUser.id) : null;

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setAuthLoading(false);
        return;
      }

      try {
        const data = await authApi.getMe();
        setCurrentUser(data.user);
      } catch (error) {
        localStorage.removeItem("token");
        setCurrentUser(null);
      } finally {
        setAuthLoading(false);
      }
    };

    loadUser();
  }, []);

  useEffect(() => {
    if (!currentUser) return;

    const loadUsers = async () => {
      try {
        const data = await usersApi.getUsers();

        const mappedUsers = (data.users || [])
          .filter(item => String(item.id) !== String(currentUser.id))
          .map(mapUserToContact);

        setContacts(mappedUsers);
      } catch (error) {
        console.error(error);
        setContacts([]);
      }
    };

    loadUsers();
  }, [currentUser]);

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

  const toggleTheme = () => {
    setTheme(prev => (prev === "dark" ? "light" : "dark"));
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setCurrentUser(null);
    setContacts([]);
    setActiveChatId(null);
    setMessages([]);
    setServerChatId(null);
  };

  const handleAuthSuccess = nextUser => {
    setCurrentUser(nextUser);
  };

  const handleSelectChat = async chatId => {
    setActiveChatId(chatId);
    setServerChatId(null);
    setMessages([]);

    const otherUserId = chatId.replace("direct-", "");

    try {
      const data = await chatsApi.createDirectChat(Number(otherUserId));
      const realChatId = String(data.chat.id);

      setServerChatId(realChatId);

      const messagesData = await chatsApi.getMessages(realChatId);
      setMessages((messagesData.messages || []).map(normalizeMessage));
    } catch (error) {
      console.error(error);
      setServerChatId(null);
      setMessages([]);
    }
  };

  if (authLoading) {
    return <div>Загрузка...</div>;
  }

  if (!currentUser) {
    return <AuthScreen onAuthSuccess={handleAuthSuccess} />;
  }

  const chats = buildDirectChats(contacts, currentUserId);

  const activeChat = chats.find(chat => chat.id === activeChatId) || null;

  const otherUserId = activeChat
  ? getOtherUserId(activeChat.members, currentUserId)
  : null;
  
  const activeUser = contacts.find(item => item.id === otherUserId) || null;

  const handleSendMessage = async text => {
    const trimmedText = text.trim();

    if (!trimmedText || !serverChatId) return;

    try {
      const data = await chatsApi.sendMessage({
        chatId: Number(serverChatId),
        text: trimmedText,
      });

      setMessages(prev => [...prev, normalizeMessage(data.message)]);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <ThemeProvider theme={theme === "dark" ? darkTheme : lightTheme}>
        <GlobalStyles />

        <AppLayout>
          <AppSidebar $chatOpen={!!activeChatId} $width={sidebarWidth}>
            <AsideLogo onLogout={handleLogout} />
            <ContactList
              chats={chats}
              users={contacts}
              // messages={messages}
              currentUserId={currentUserId}
              activeChatId={activeChatId}
              onSelectChat={handleSelectChat}
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
                activeMessages={messages}
                currentUserId={currentUserId}
                onSendMessage={handleSendMessage}
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