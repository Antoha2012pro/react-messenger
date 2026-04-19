import ProfileImg from "./ProfileImg";
import { formatMessageTime } from "../utils/formatMessageTime";
import {
  ChatInfoStyled,
  ContactButtonStyled,
  ContactButtonInnerStyled,
  ContactTextWrapStyled,
  ContactNameStyled,
  ContactPreviewStyled,
  ContactTimeStyled,
} from "../styles/messenger.styled";

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
          <ContactButtonStyled
            key={chat.id}
            onClick={() => onSelectChat(chat.id)}
          >
            <ContactButtonInnerStyled $active={activeChatId === chat.id}>
              <ProfileImg url={otherUser.avatar} />

              <ContactTextWrapStyled>
                <ChatInfoStyled>
                  <ContactNameStyled>{otherUser.name}</ContactNameStyled>

                  <ContactPreviewStyled $typing={otherUser.isTyping}>
                    {otherUser.isTyping
                      ? "Пише..."
                      : lastMessage?.text || "Немає повідомленнь"}
                  </ContactPreviewStyled>
                </ChatInfoStyled>

                <ContactTimeStyled>
                  {lastMessage ? formatMessageTime(lastMessage.createdAt) : ""}
                </ContactTimeStyled>
              </ContactTextWrapStyled>
            </ContactButtonInnerStyled>
          </ContactButtonStyled>
        );
      })}
    </div>
  );
};

export default ContactList;