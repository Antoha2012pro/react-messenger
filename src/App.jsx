import { useEffect, useState } from "react";
import ContactList from "./components/ContactList";
import ChatWindow from "./components/ChatWindow";
import AsideLogo from "./components/AsideLogo";
import AuthScreen from "./components/AuthScreen";
import { ThemeContext } from "./ThemeContext";
import { ThemeProvider } from "styled-components";
import { supabase } from "./lib/supabase";
import { lightTheme, darkTheme } from "./styles/theme";
import {
  GlobalStyles,
  AppLayout,
  AppSidebar,
  AppChat,
  ChatEmpty,
  ResizeHandleStyled,
} from "./styles/app.styled";

const demoUsers = [
  {
    id: "u1",
    name: "Анна",
    avatar:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSsc3WLwt1VO_zCe9FTBOByMFq7iya4QO38gA&s",
    isTyping: false,
    isOnline: false,
  },
  {
    id: "u3",
    name: "Макс",
    avatar:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSfcbg4vgnOEYx67CzLzBbmfSYJ82mdXVA08g&s",
    isTyping: false,
    isOnline: true,
  },
  {
    id: "u4",
    name: "Mr_Donnotella",
    avatar:
      "https://cdn.discordapp.com/attachments/1199628062124429332/1495399729767518208/a43039e40fb6d153bebb1e201ec373ab.png?ex=69e61b06&is=69e4c986&hm=8c030c042cbd75674b6d7643708c6377c91f316f568922ca461288788ca482bb&",
    isTyping: false,
    isOnline: false,
  },
];

const createChats = currentUserId => [
  { id: "c1", members: [currentUserId, "u1"] },
  { id: "c2", members: [currentUserId, "u3"] },
  { id: "c3", members: [currentUserId, "u4"] },
];

const createInitialMessages = currentUserId => [
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
    senderId: currentUserId,
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
  {
    id: "m4",
    chatId: "c3",
    senderId: "u4",
    text: "qwerty?????????????????????????????????????",
    createdAt: "2024-04-16T17:14:26.542Z",
  },
];

function App() {
  const [theme, setTheme] = useState("dark");
  const [activeChatId, setActiveChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [sidebarWidth, setSidebarWidth] = useState(390);
  const [isResizing, setIsResizing] = useState(false);
  const [session, setSession] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  const currentUserId = session?.user?.id ?? null;

  useEffect(() => {
    const loadSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session ?? null);
      setAuthLoading(false);
    };

    loadSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession ?? null);
      setActiveChatId(null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!currentUserId) {
      setMessages([]);
      return;
    }

    setMessages(createInitialMessages(currentUserId));
  }, [currentUserId]);

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

  const handleSendMessage = text => {
    const trimmedText = text.trim();
    if (!trimmedText || !activeChatId || !currentUserId) return;

    const newMessage = {
      id: Date.now().toString(),
      chatId: activeChatId,
      senderId: currentUserId,
      text: trimmedText,
      createdAt: new Date().toISOString(),
    };

    setMessages(prev => [...prev, newMessage]);
  };

  const handleSendAudioMessage = audioUrl => {
    if (!activeChatId || !currentUserId) return;

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
    if (!activeChatId || !currentUserId) return;

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

  if (authLoading) {
    return <div>Загрузка...</div>;
  }

  if (!session) {
    return <AuthScreen />;
  }

  const currentUser = {
    id: currentUserId,
    name:
      session.user.user_metadata?.username ||
      session.user.email?.split("@")[0] ||
      "Вы",
    avatar:
      session.user.user_metadata?.avatar_url ||
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSsc3WLwt1VO_zCe9FTBOByMFq7iya4QO38gA&s",
    isTyping: false,
    isOnline: true,
  };

  const users = [currentUser, ...demoUsers];
  const chats = createChats(currentUserId);

  const activeChat = chats.find(chat => chat.id === activeChatId) || null;

  const activeMessages = activeChatId
    ? messages.filter(message => message.chatId === activeChatId)
    : [];

  const otherUserId = activeChat?.members.find(id => id !== currentUserId);
  const activeUser = users.find(user => user.id === otherUserId) || null;

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