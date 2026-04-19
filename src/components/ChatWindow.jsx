import { useState } from "react";
import { useTheme } from "../ThemeContext";
import ProfileImg from "./ProfileImg";
import { formatMessageTime } from "../utils/formatMessageTime";
import {
    ButtonContextMenuStyled,
    ChatBackButtonStyled,
    ChatHeaderInfoStyled,
    ChatHeaderStyled,
    ChatStatusStyled,
    ChatTitleStyled,
    ChatWindowWrapStyled,
    ContextMenuCloseButtonStyled,
    ContextMenuDeleteButtonStyled,
    ContextMenuStyled,
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

const ChatWindow = ({
    activeUser,
    activeMessages,
    currentUserId,
    onSendMessage,
    onDeleteMessage,
    onBack,
}) => {
    const [messageText, setMessageText] = useState("");
    const [menu, setMenu] = useState({
        isOpen: false,
        x: 0,
        y: 0,
        messageId: null,
    });
    const { theme } = useTheme();

    const openMenu = (event, messageId) => {
        event.preventDefault();

        const isRightClick = event.type === "contextmenu";

        setMenu({
            isOpen: true,
            x: isRightClick
                ? event.clientX
                : event.currentTarget.getBoundingClientRect().right - 160,
            y: isRightClick
                ? event.clientY
                : event.currentTarget.getBoundingClientRect().bottom + 6,
            messageId,
        });
    };

    const closeMenu = () => {
        setMenu({
            isOpen: false,
            x: 0,
            y: 0,
            messageId: null,
        });
    };

    const handleSubmit = event => {
        event.preventDefault();

        if (!messageText.trim()) return;

        onSendMessage(messageText);
        setMessageText("");
    };

    const isGroupedMessage = (messages, index) => {
        if (index === 0) return false;

        const prev = messages[index - 1];
        const current = messages[index];

        return (
            prev.senderId === current.senderId &&
            new Date(current.createdAt) - new Date(prev.createdAt) <= 5 * 60 * 1000
        );
    };

    const formatDayLabel = dateString => {
        const date = new Date(dateString);

        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();

        return `${day}.${month}.${year}`;
    };

    const isNewDay = (messages, index) => {
        if (index === 0) return true;

        const prev = new Date(messages[index - 1].createdAt);
        const current = new Date(messages[index].createdAt);

        return prev.toDateString() !== current.toDateString();
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
                {activeMessages.map((message, index) => {
                    const isGrouped = isGroupedMessage(activeMessages, index);
                    const isOwn = message.senderId === currentUserId;
                    const showDayLabel = isNewDay(activeMessages, index);

                    return (
                        <div
                            key={message.id}
                            onClick={() => {
                                if (menu.isOpen) {
                                    closeMenu();
                                }
                            }}
                        >
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
                                                {!isOwn ? (
                                                    <MessageAuthorStyled>{activeUser.name}</MessageAuthorStyled>
                                                ) : (
                                                    <MessageAuthorStyled>Ви</MessageAuthorStyled>
                                                )}

                                                <p>{formatMessageTime(message.createdAt)}</p>
                                            </MessageMetaStyled>
                                        )}

                                        <MessageBubbleRowStyled $isOwn={isOwn}>
                                            <MessageBubbleStyled
                                                $isOwn={isOwn}
                                                $lightTheme={theme === "light"}
                                                onContextMenu={event => openMenu(event, message.id)}
                                            >
                                                {message.text}
                                            </MessageBubbleStyled>

                                            <ButtonContextMenuStyled
                                                onClick={event => openMenu(event, message.id)}
                                                aria-label="Открыть меню сообщения"
                                            >
                                                ⋮
                                            </ButtonContextMenuStyled>
                                        </MessageBubbleRowStyled>
                                    </MessageContentStyled>
                                </MessageInnerStyled>
                            </MessageOuterStyled>
                        </div>
                    );
                })}

                {menu.isOpen && (
                    <ContextMenuStyled $x={menu.x} $y={menu.y}>
                        <ContextMenuDeleteButtonStyled
                            onClick={() => {
                                onDeleteMessage(menu.messageId);
                                closeMenu();
                            }}
                            aria-label="Удалить"
                        >
                            Удалить
                        </ContextMenuDeleteButtonStyled>

                        <ContextMenuCloseButtonStyled onClick={closeMenu} aria-label="Закрыть">
                            Закрыть
                        </ContextMenuCloseButtonStyled>
                    </ContextMenuStyled>
                )}
            </MessagesWrapStyled>

            <MessageFormStyled onSubmit={handleSubmit}>
                <MessageFormLeftStyled>
                    <button aria-label="Емодзи">😊</button>

                    <InputMessageStyled
                        className="chat-window-input"
                        type="text"
                        value={messageText}
                        onChange={event => setMessageText(event.target.value)}
                        placeholder="Введите сообщение"
                    />
                </MessageFormLeftStyled>

                <MessageFormRightStyled>
                    <button aria-label="Голосове сообщение">🎙️</button>
                    <button aria-label="Прикрепить файл">📂</button>

                    <SendButtonStyled type="submit">
                        <svg>
                            <use href="/img/symbol-defs.svg#icon-planet"></use>
                        </svg>
                    </SendButtonStyled>
                </MessageFormRightStyled>
            </MessageFormStyled>
        </ChatWindowWrapStyled>
    );
};

export default ChatWindow;