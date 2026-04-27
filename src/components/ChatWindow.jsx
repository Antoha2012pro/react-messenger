import { useEffect, useRef, useState } from "react";
import { useTheme } from "../ThemeContext";
import ProfileImg from "./ProfileImg";
import { formatMessageTime } from "../utils/formatMessageTime";
import {
    ChatBackButtonStyled,
    ChatHeaderInfoStyled,
    ChatHeaderStyled,
    ChatStatusStyled,
    ChatTitleStyled,
    ChatWindowWrapStyled,
    DayDividerStyled,
    DayDividerWrapStyled,
    InputMessageStyled,
    MessageAuthorStyled,
    MessageAvatarSpacerStyled,
    MessageBubbleRowStyled,
    MessageBubbleStyled,
    MessageContentStyled,
    MessageFormLeftStyled,
    MessageFormRightStyled,
    MessageFormStyled,
    MessageInnerStyled,
    MessageMetaStyled,
    MessageOuterStyled,
    MessagesWrapStyled,
    SendButtonStyled,
} from "../styles/messenger.styled";

const formatDayLabel = dateString => {
    const date = new Date(dateString);

    return `${String(date.getDate()).padStart(2, "0")}.${String(
        date.getMonth() + 1
    ).padStart(2, "0")}.${date.getFullYear()}`;
};

const isGroupedMessage = (messages, index) =>
    index > 0 &&
    messages[index - 1].senderId === messages[index].senderId &&
    new Date(messages[index].createdAt) - new Date(messages[index - 1].createdAt) <=
    5 * 60 * 1000;

const isNewDay = (messages, index) =>
    index === 0 ||
    new Date(messages[index - 1].createdAt).toDateString() !==
    new Date(messages[index].createdAt).toDateString();

const ChatWindow = ({
    activeUser,
    activeMessages,
    currentUserId,
    onSendMessage,
    onBack,
}) => {
    const [messageText, setMessageText] = useState("");
    const messagesEndRef = useRef(null);

    const { theme } = useTheme();
    const messages = Array.isArray(activeMessages) ? activeMessages : [];
    const hasText = messageText.trim().length > 0;
    const lastMessageId = messages[messages.length - 1]?.id;

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "end",
        });
    }, [lastMessageId]);

    const handleSubmit = event => {
        event.preventDefault();
        if (!hasText) return;

        onSendMessage(messageText);
        setMessageText("");
    };

    return (
        <ChatWindowWrapStyled>
            <ChatHeaderStyled>
                <ChatBackButtonStyled type="button" onClick={onBack} aria-label="Назад">
                    ←
                </ChatBackButtonStyled>

                <ProfileImg url={activeUser.avatar} />

                <ChatHeaderInfoStyled>
                    <ChatTitleStyled>{activeUser.name}</ChatTitleStyled>
                    <ChatStatusStyled $online={activeUser.isOnline}>
                        {activeUser.isOnline
                            ? activeUser.isTyping
                                ? "Пише..."
                                : "В мережі"
                            : "Поза мережою"}
                    </ChatStatusStyled>
                </ChatHeaderInfoStyled>
            </ChatHeaderStyled>

            <MessagesWrapStyled>
                {messages.map((message, index) => {
                    const isOwn = String(message.senderId) === currentUserId;
                    const isGrouped = isGroupedMessage(messages, index);
                    const showDayLabel = isNewDay(messages, index);

                    return (
                        <div key={message.id}>
                            {showDayLabel && (
                                <DayDividerWrapStyled>
                                    <DayDividerStyled>
                                        {formatDayLabel(message.createdAt)}
                                    </DayDividerStyled>
                                </DayDividerWrapStyled>
                            )}

                            <MessageOuterStyled
                                $isOwn={isOwn}
                                $mt={index === 0 ? 0 : isGrouped ? 4 : 10}
                            >
                                <MessageInnerStyled $isOwn={isOwn}>
                                    {!isOwn &&
                                        (isGrouped ? (
                                            <MessageAvatarSpacerStyled />
                                        ) : (
                                            <ProfileImg url={activeUser.avatar} size="small" />
                                        ))}

                                    <MessageContentStyled $isOwn={isOwn}>
                                        {!isGrouped && (
                                            <MessageMetaStyled $isOwn={isOwn}>
                                                <MessageAuthorStyled>
                                                    {isOwn ? "Ви" : activeUser.name}
                                                </MessageAuthorStyled>
                                                <p>{formatMessageTime(message.createdAt)}</p>
                                            </MessageMetaStyled>
                                        )}

                                        <MessageBubbleRowStyled $isOwn={isOwn}>
                                            <MessageBubbleStyled
                                                $isOwn={isOwn}
                                                $lightTheme={theme === "light"}
                                            >
                                                {message.text}
                                            </MessageBubbleStyled>
                                        </MessageBubbleRowStyled>
                                    </MessageContentStyled>
                                </MessageInnerStyled>
                            </MessageOuterStyled>
                        </div>
                    );
                })}

                <div ref={messagesEndRef} />
            </MessagesWrapStyled>

            <MessageFormStyled onSubmit={handleSubmit}>
                <MessageFormLeftStyled>
                    <button aria-label="Емодзи" type="button">😊</button>

                    <InputMessageStyled
                        type="text"
                        value={messageText}
                        onChange={event => setMessageText(event.target.value)}
                        placeholder="Введите сообщение"
                    />
                </MessageFormLeftStyled>

                <MessageFormRightStyled>
                    <button aria-label="Прикрепить файл" type="button">📂</button>

                    <SendButtonStyled
                        type="submit"
                        disabled={!hasText}
                        aria-label="Отправить сообщение"
                    >
                        ➤
                    </SendButtonStyled>
                </MessageFormRightStyled>
            </MessageFormStyled>
        </ChatWindowWrapStyled>
    );
};

export default ChatWindow;
