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

// const demoUsers = [
//   {
//     id: "u1",
//     name: "Анна",
//     avatar:
//       "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSsc3WLwt1VO_zCe9FTBOByMFq7iya4QO38gA&s",
//     isTyping: false,
//     isOnline: false,
//   },
//   {
//     id: "u3",
//     name: "Макс",
//     avatar:
//       "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSfcbg4vgnOEYx67CzLzBbmfSYJ82mdXVA08g&s",
//     isTyping: false,
//     isOnline: true,
//   },
//   {
//     id: "u4",
//     name: "Mr_Donnotella",
//     avatar:
//       "https://cdn.discordapp.com/attachments/1199628062124429332/1495399729767518208/a43039e40fb6d153bebb1e201ec373ab.png?ex=69e61b06&is=69e4c986&hm=8c030c042cbd75674b6d7643708c6377c91f316f568922ca461288788ca482bb&",
//     isTyping: false,
//     isOnline: false,
//   },
// ];

// const createChats = currentUserId => [
//   { id: "c1", members: [currentUserId, "u1"] },
//   { id: "c2", members: [currentUserId, "u3"] },
//   { id: "c3", members: [currentUserId, "u4"] },
// ];

// const createInitialMessages = currentUserId => [
//   {
//     id: "m1",
//     chatId: "c1",
//     senderId: "u1",
//     text: "Привет",
//     createdAt: "2026-04-18T17:11:26.542Z",
//   },
//   {
//     id: "m2",
//     chatId: "c1",
//     senderId: currentUserId,
//     text: "Дароу!",
//     createdAt: "2026-04-18T17:12:26.542Z",
//   },
//   {
//     id: "m3",
//     chatId: "c2",
//     senderId: "u3",
//     text: "Ты тут?",
//     createdAt: "2024-04-16T17:14:26.542Z",
//   },
//   {
//     id: "m4",
//     chatId: "c3",
//     senderId: "u4",
//     text: "qwerty?????????????????????????????????????",
//     createdAt: "2024-04-16T17:14:26.542Z",
//   },
// ];

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

  const [, setSelectedChat] = useState(null);

  const currentUserId = currentUser ? String(currentUser.id) : null;

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setAuthLoading(false);
        return;
      }

      try {
        const data = await authApi.me();
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

  const fallbackAvatar =
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSsc3WLwt1VO_zCe9FTBOByMFq7iya4QO38gA&s";

  useEffect(() => {
    if (!currentUser) return;

    const loadUsers = async () => {
      try {
        const data = await usersApi.getUsers();

        const mappedUsers = (data.users || []).map(item => ({
          id: String(item.id),
          name: item.username,
          avatar: item.avatarUrl || fallbackAvatar,
          isTyping: false,
          isOnline: false,
          email: item.email,
        }));

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

  const handleDeleteMessage = messageId => {
    setMessages(prev => prev.filter(message => message.id !== messageId));
  };

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

    const otherUserId = chatId.replace("direct-", "");

    try {
      const data = await chatsApi.createDirectChat(Number(otherUserId));

      setSelectedChat(data.chat);
      setServerChatId(String(data.chat.id));
    } catch (error) {
      console.error(error);
      setSelectedChat(null);
      setServerChatId(null);
    }
  };

  if (authLoading) {
    return <div>Загрузка...</div>;
  }

  if (!currentUser) {
    return <AuthScreen onAuthSuccess={handleAuthSuccess} />;
  }

  const chats = contacts.map(item => ({
    id: `direct-${item.id}`,
    members: [currentUserId, item.id],
  }));

  const activeChat = chats.find(chat => chat.id === activeChatId) || null;

  const activeMessages = serverChatId
    ? messages.filter(message => String(message.chatId) === String(serverChatId))
    : [];

  const otherUserId = activeChat?.members.find(id => id !== currentUserId);
  const activeUser = contacts.find(item => item.id === otherUserId) || null;

  const handleSendMessage = async text => {
    const trimmedText = text.trim();

    if (!trimmedText || !serverChatId) return;

    try {
      const data = await chatsApi.sendMessage({
        chatId: Number(serverChatId),
        text: trimmedText,
      });

      setMessages(prev => [...prev, data.message]);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSendAudioMessage = audioUrl => {
    const newMessage = {
      id: Date.now().toString(),
      chatId: activeChatId,
      senderId: currentUserId,
      type: "audio",
      audioUrl,
      createdAt: new Date().toISOString(),
    };

    setMessages(prev => [...prev, newMessage]);
  };

  const handleSendVideoMessage = videoUrl => {
    const newMessage = {
      id: Date.now().toString(),
      chatId: activeChatId,
      senderId: currentUserId,
      type: "video",
      videoUrl,
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
            <AsideLogo onLogout={handleLogout} />
            <ContactList
              chats={chats}
              users={contacts}
              messages={messages}
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
                activeMessages={activeMessages}
                currentUserId={currentUserId}
                onSendMessage={handleSendMessage}
                onSendAudioMessage={handleSendAudioMessage}
                onSendVideoMessage={handleSendVideoMessage}
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