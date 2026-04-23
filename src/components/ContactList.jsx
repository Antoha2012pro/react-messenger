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

const cutText = (text, maxLength = 28) => {
  if (!text) return "Нет сообщений";
  return text.length > maxLength ? `${text.slice(0, maxLength)}…` : text;
};

const ContactList = ({
  chats,
  users,
  currentUserId,
  activeChatId,
  chatMetaById,
  onSelectChat,
}) => {
  return (
    <div>
      {chats.map(chat => {
        const otherUserId = chat.members.find(id => id !== currentUserId);
        const otherUser = users.find(user => user.id === otherUserId);

        const chatMeta = chatMetaById[chat.id];
        const lastMessage = chatMeta?.lastMessage || null;

        return (
          <ContactButtonStyled
            key={chat.id}
            onClick={() => onSelectChat(chat.id)}
          >
            <ContactButtonInnerStyled $active={activeChatId === chat.id}>
              <ProfileImg url={otherUser?.avatar} size="telefon" />

              <ContactTextWrapStyled>
                <ChatInfoStyled>
                  <ContactNameStyled>
                    {otherUser?.name || "Unknown user"}
                  </ContactNameStyled>

                  <ContactPreviewStyled $typing={false}>
                    {cutText(lastMessage?.text)}
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