import { useState } from "react";
import { useTheme } from "../ThemeContext";
// import { useRecorderAction } from "../hooks/useRecorderAction";
import ProfileImg from "./ProfileImg";
// import ComposerActionButton from "./ComposerActionButton";
import { formatMessageTime } from "../utils/formatMessageTime";
import {
    // ButtonContextMenuStyled,
    ChatBackButtonStyled,
    ChatHeaderInfoStyled,
    ChatHeaderStyled,
    ChatStatusStyled,
    ChatTitleStyled,
    ChatWindowWrapStyled,
    // ContextMenuCloseButtonStyled,
    // ContextMenuDeleteButtonStyled,
    // ContextMenuStyled,
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

    const { theme } = useTheme();

    const handleSubmit = event => {
        event.preventDefault();
        if (!messageText.trim()) return;

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
                {activeMessages.map((message, index) => {
                    const isOwn = message.senderId === currentUserId;
                    const isGrouped = isGroupedMessage(activeMessages, index);
                    const showDayLabel = isNewDay(activeMessages, index);

                    return (
                        <div key={message.id} 
                        // onClick={() => menu.isOpen && closeMenu()}
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
                                                // onContextMenu={event => openMenu(event, message.id)}
                                            >
                                                {message.text}
                                            </MessageBubbleStyled>

                                            {/* <ButtonContextMenuStyled
                                                onClick={event => openMenu(event, message.id)}
                                                aria-label="Открыть меню сообщения"
                                            >
                                                ⋮
                                            </ButtonContextMenuStyled> */}
                                        </MessageBubbleRowStyled>
                                    </MessageContentStyled>
                                </MessageInnerStyled>
                            </MessageOuterStyled>
                        </div>
                    );
                })}

                {/* {menu.isOpen && (
                    <ContextMenuStyled $x={menu.x} $y={menu.y}>
                        <ContextMenuDeleteButtonStyled
                            onClick={() => {
                                closeMenu();
                            }}
                            aria-label="Удалить"
                        >
                            Удалить
                        </ContextMenuDeleteButtonStyled>

                        <ContextMenuCloseButtonStyled
                            onClick={closeMenu}
                            aria-label="Закрыть"
                        >
                            Закрыть
                        </ContextMenuCloseButtonStyled>
                    </ContextMenuStyled>
                )} */}
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

                    {/* <ComposerActionButton
                        hasText={hasText}
                        isRecording={isRecording}
                        recordType={recordType}
                        onPointerDown={handleRecordPointerDown}
                        onClick={handleRecordClick}
                    /> */}
                    <button type="submit">O</button>

                </MessageFormRightStyled>
            </MessageFormStyled>
        </ChatWindowWrapStyled>
    );
};

export default ChatWindow;