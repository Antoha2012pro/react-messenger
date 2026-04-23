import { useCallback, useEffect, useState } from "react";
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
  mergeMessagesById,
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

  const [chatMetaById, setChatMetaById] = useState({});

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

  const fetchChatMessages = useCallback(async chatId => {
    const messagesData = await chatsApi.getMessages(chatId);

    return mergeMessagesById(
      (messagesData.messages || []).map(normalizeMessage)
    );
  }, []);

  const updateChatMeta = useCallback((localChatId, patch) => {
    setChatMetaById(prev => ({
      ...prev,
      [localChatId]: {
        ...prev[localChatId],
        ...patch,
      },
    }));
  }, []);

  const syncChatPreview = useCallback(async (otherUserId, localChatId) => {
    try {
      const data = await chatsApi.createDirectChat(Number(otherUserId));
      const realChatId = String(data.chat.id);

      const normalizedMessages = await fetchChatMessages(realChatId);
      const lastMessage =
        normalizedMessages[normalizedMessages.length - 1] || null;

      updateChatMeta(localChatId, {
        serverChatId: realChatId,
        lastMessage,
      });

      return {
        realChatId,
        messages: normalizedMessages,
        lastMessage,
      };
    } catch (error) {
      console.error(error);

      updateChatMeta(localChatId, {
        serverChatId: null,
        lastMessage: null,
      });

      return null;
    }
  }, [fetchChatMessages, updateChatMeta]);

  useEffect(() => {
    if (!contacts.length) return;

    const preloadChatPreviews = async () => {
      await Promise.all(
        contacts.map(contact =>
          syncChatPreview(contact.id, `direct-${contact.id}`)
        )
      );
    };

    preloadChatPreviews();
  }, [contacts, syncChatPreview]);

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

  // const loadChatMessages = useCallback(async chatId => {
  //   try {
  //     const messagesData = await chatsApi.getMessages(chatId);
  //     const nextMessages = (messagesData.messages || []).map(normalizeMessage);

  //     setMessages(prev => mergeMessagesById([...prev, ...nextMessages]));
  //   } catch (error) {
  //     console.error(error);
  //   }
  // }, []);

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

  useEffect(() => {
    if (!serverChatId || !activeChatId) return;

    const intervalId = setInterval(async () => {
      try {
        const normalizedMessages = await fetchChatMessages(serverChatId);

        setMessages(normalizedMessages);

        updateChatMeta(activeChatId, {
          serverChatId,
          lastMessage:
            normalizedMessages[normalizedMessages.length - 1] || null,
        });
      } catch (error) {
        console.error(error);
      }
    }, 3000);

    return () => clearInterval(intervalId);
  }, [serverChatId, activeChatId, fetchChatMessages, updateChatMeta]);

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
      let realChatId = chatMetaById[chatId]?.serverChatId;
      let normalizedMessages = [];

      if (!realChatId) {
        const syncedChat = await syncChatPreview(otherUserId, chatId);

        if (!syncedChat) {
          setServerChatId(null);
          setMessages([]);
          return;
        }

        realChatId = syncedChat.realChatId;
        normalizedMessages = syncedChat.messages;
      } else {
        normalizedMessages = await fetchChatMessages(realChatId);

        updateChatMeta(chatId, {
          serverChatId: realChatId,
          lastMessage:
            normalizedMessages[normalizedMessages.length - 1] || null,
        });
      }

      setServerChatId(realChatId);
      setMessages(normalizedMessages);
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

      const nextMessages = mergeMessagesById([
        ...messages,
        normalizeMessage(data.message),
      ]);

      setMessages(nextMessages);

      updateChatMeta(activeChatId, {
        serverChatId,
        lastMessage: nextMessages[nextMessages.length - 1] || null,
      });
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
              currentUserId={currentUserId}
              activeChatId={activeChatId}
              chatMetaById={chatMetaById}
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