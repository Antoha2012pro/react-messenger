import styled, { keyframes } from "styled-components";

const messageIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(6px) scale(0.98);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`;

export const ChatInfoStyled = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const ContactButtonStyled = styled.button`
  display: block;
  width: 100%;
  padding: 0;
`;

export const ContactButtonInnerStyled = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 16px;
  padding: 12px 0 12px 10px;
  width: 100%;
  border-radius: 14px;
  background: ${({ $active, theme }) =>
    $active ? theme.contactBgColor : "transparent"};
  transition: background-color 0.18s ease, transform 0.18s ease;

  &:hover {
    background: ${({ $active, theme }) =>
      $active ? theme.contactBgColor : "rgba(0, 163, 255, 0.08)"};
  }

  &:active {
    transform: scale(0.99);
  }
`;

export const ContactTextWrapStyled = styled.div`
  position: relative;
  width: 100%;
  text-align: start;
  padding-right: 60px;
  min-width: 0;
`;

export const ContactNameStyled = styled.h2`
  color: ${({ theme }) => theme.title};
  width: 100%;
  max-width: 200px;
  font-size: 18px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

export const ContactPreviewStyled = styled.p`
  color: ${({ $typing, theme }) => ($typing ? "#00A3FF" : theme.text)};
  width: 100%;
  max-width: 250px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-size: 14px;
`;

export const ContactTimeStyled = styled.p`
  position: absolute;
  inset: 0 10px auto auto;

  @media (min-width: 425px) {
    inset: 0 8px auto auto;
  }
`;

export const ChatWindowWrapStyled = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  min-height: 0;
  width: 100%;
  background: ${({ theme }) => theme.bg};
`;

export const ChatHeaderStyled = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 18px;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  padding: 16px 0 16px 46px;
  transition: border-color 0.2s ease, background-color 0.2s ease;

  @media (max-width: 768px) {
    padding: 14px 16px;
  }
`;

export const ChatBackButtonStyled = styled.button`
  display: none;

  @media (max-width: 768px) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    margin-right: 6px;
    width: 38px;
    height: 38px;
    border-radius: 12px;
    transition: background-color 0.18s ease, transform 0.18s ease;

    &:active {
      transform: scale(0.94);
    }
  }
`;

export const ChatHeaderInfoStyled = styled.span`
  display: flex;
  flex-direction: column;
  gap: 3px;
  min-width: 0;
`;

export const ChatTitleStyled = styled.h2`
  color: ${({ theme }) => theme.contactNameColor};
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

export const ChatStatusStyled = styled.p`
  color: ${({ $online, theme }) => ($online ? "#00A3FF" : theme.text)};
`;

export const MessagesWrapStyled = styled.div`
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  min-height: 0;
  padding: 16px 8px 26px 8px;
  display: flex;
  flex-direction: column;
  scroll-behavior: smooth;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 999px;
    background: rgba(0, 163, 255, 0.28);
  }

  @media (min-width: 768px) {
    padding: 16px 66px 26px 46px;
  }
`;

export const DayDividerWrapStyled = styled.div`
  display: flex;
  justify-content: center;
  margin: 12px 0 20px;
`;

export const DayDividerStyled = styled.span`
  padding: 6px 12px;
  border-radius: 999px;
  background: ${({ theme }) => theme.dateChatColor};
  color: ${({ theme }) => theme.text};
  font-size: 14px;
`;

export const MessageOuterStyled = styled.div`
  display: flex;
  justify-content: ${({ $isOwn }) => ($isOwn ? "flex-end" : "flex-start")};
  width: 100%;
  margin-top: ${({ $mt }) => `${$mt}px`};
  animation: ${messageIn} 0.18s ease both;
`;

export const MessageInnerStyled = styled.div`
  display: flex;
  flex-direction: row;
  gap: ${({ $isOwn }) => ($isOwn ? "0" : "14px")};
  align-items: flex-start;
  width: fit-content;
  max-width: 90%;
  
  @media (min-width: 768px) {
    max-width: 70%;
  }
`;

export const MessageAvatarSpacerStyled = styled.div`
  width: 40px;
  flex-shrink: 0;
`;

export const MessageContentStyled = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: ${({ $isOwn }) => ($isOwn ? "flex-end" : "flex-start")};
  text-align: ${({ $isOwn }) => ($isOwn ? "right" : "left")};
`;

export const MessageMetaStyled = styled.div`
  display: flex;
  flex-direction: ${({ $isOwn }) => ($isOwn ? "row-reverse" : "row")};
  gap: 16px;
  align-items: center;
`;

export const MessageAuthorStyled = styled.h3`
  color: ${({ theme }) => theme.title};
`;

export const MessageBubbleRowStyled = styled.div`
  display: flex;
  gap: 6px;
  flex-direction: ${({ $isOwn }) => ($isOwn ? "row-reverse" : "row")};
`;

export const MessageBubbleStyled = styled.p`
  background: ${({ $isOwn, theme }) => ($isOwn ? "#00A3FF" : theme.msgBg)};
  padding: 10px 16px;
  border-radius: ${({ $isOwn }) =>
    $isOwn ? "14px 0 14px 14px" : "0 14px 14px 14px"};
  color: ${({ $isOwn, $lightTheme }) =>
    $isOwn ? "white" : $lightTheme ? "black" : "white"};
  max-width: 100%;
  word-break: break-word;
  overflow-wrap: anywhere;
  white-space: pre-wrap;
  text-align: start;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
  transition: transform 0.18s ease, box-shadow 0.18s ease, background-color 0.18s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 10px 24px rgba(0, 0, 0, 0.12);
  }

  @media (min-width: 768px) {
    padding: 16px 24px;
  }
`;

export const InputMessageStyled = styled.input`
  color: #a0a0a0;
  font-size: 24px;
  font-weight: 400;
  background-color: transparent;
  outline: none;
  border: none;
  width: 100%;

  &:focus {
    outline: none;
  }

  @media (max-width: 768px) {
    font-size: 18px;
  }
`;

export const ButtonContextMenuStyled = styled.button`
  display: none;
  font-size: 18px;
  color: ${({ theme }) => theme.text};
  padding: 4px 8px;
  border-radius: 8px;

  @media (hover: none) and (pointer: coarse) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
`;

export const ContextMenuStyled = styled.div`
  position: fixed;
  top: ${({ $y }) => `${$y}px`};
  left: ${({ $x }) => `${$x}px`};
  background: #111;
  color: #fff;
  border-radius: 12px;
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  z-index: 1000;
  min-width: 160px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
`;

export const ContextMenuDeleteButtonStyled = styled.button`
  color: red;
  text-align: left;
`;

export const ContextMenuCloseButtonStyled = styled.button`
  text-align: left;
`;

export const MessageFormStyled = styled.form`
  flex-shrink: 0;
  border-top: 1px solid ${({ theme }) => theme.border};
  padding: 22px 46px 22px 46px;
  display: flex;
  justify-content: space-between;
  gap: 16px;
  transition: border-color 0.2s ease, background-color 0.2s ease;

  @media (max-width: 768px) {
    padding: 14px 16px;
  }
`;

export const MessageFormLeftStyled = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 16px;
  width: 100%;
  min-width: 0;
`;

export const MessageFormRightStyled = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
`;

export const SendButtonStyled = styled.button`
  width: 42px;
  height: 42px;
  border-radius: 14px;
  background-color: #00a3ff;
  color: white;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 18px;
  transition: transform 0.18s ease, background-color 0.18s ease, opacity 0.18s ease;

  &:hover:not(:disabled) {
    background-color: #19adff;
  }

  &:active:not(:disabled) {
    transform: scale(0.94);
  }

  &:disabled {
    cursor: default;
    opacity: 0.35;
  }

  svg {
    fill: #00A3FF;
    width: 20px;
    height: 20px;
  }
`;

export const MicButtonStyled = styled.button`
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background-color: #00a3ff;
  color: white;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: transform 0.18s ease, background-color 0.18s ease, opacity 0.18s ease;

  &:active {
    transform: scale(0.94);
  }
`;

export const StopRecordButtonStyled = styled.button`
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background-color: #ff4d4f;
  color: white;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: transform 0.18s ease, background-color 0.18s ease, opacity 0.18s ease;

  &:active {
    transform: scale(0.94);
  }
`;

export const VideoCircleWrapStyled = styled.div`
  width: 220px;
  height: 220px;
  border-radius: 50%;
  overflow: hidden;
  background: #000;
  flex-shrink: 0;
`;

export const VideoCircleStyled = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`;
