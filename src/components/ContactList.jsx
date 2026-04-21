import ProfileImg from "./ProfileImg";
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
  currentUserId,
  activeChatId,
  onSelectChat,
}) => {
  return (
    <div>
      {chats.map(chat => {
        const otherUserId = chat.members.find(id => id !== currentUserId);
        const otherUser = users.find(user => user.id === otherUserId);

        return (
          <ContactButtonStyled
            key={chat.id}
            onClick={() => onSelectChat(chat.id)}
          >
            <ContactButtonInnerStyled $active={activeChatId === chat.id}>
              <ProfileImg url={otherUser.avatar} size="telefon" />

              <ContactTextWrapStyled>
                <ChatInfoStyled>
                  <ContactNameStyled>{otherUser.name}</ContactNameStyled>

                  <ContactPreviewStyled $typing={false}>
                      Открыть чат
                  </ContactPreviewStyled>
                </ChatInfoStyled>

                <ContactTimeStyled />
              </ContactTextWrapStyled>
            </ContactButtonInnerStyled>
          </ContactButtonStyled>
        );
      })}
    </div>
  );
};

export default ContactList;