import styled, { createGlobalStyle } from "styled-components";

export const GlobalStyles = createGlobalStyle`
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  html {
    -webkit-text-size-adjust: 100%;
    text-size-adjust: 100%;
    scroll-behavior: smooth;
  }

  body {
    margin: 0;
    min-height: 100vh;
    background: ${({ theme }) => theme.bg};
    color: ${({ theme }) => theme.text};
    font-family: Inter, sans-serif;
  }

  h1, h2, h3, h4, h5, h6, p {
    margin: 0;
    font-weight: 400;
  }

  ul, ol {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  button,
  input,
  textarea,
  select {
    font: inherit;
    color: inherit;
  }

  button {
    border: none;
    cursor: pointer;
    background: none;
  }

  img,
  picture,
  video,
  canvas,
  svg {
    display: block;
    max-width: 100%;
    height: auto;
  }

  address {
    font-style: normal;
  }
`;

export const AppLayout = styled.div`
  display: flex;
  flex-direction: row;
  min-height: 100vh;
  background: ${({ theme }) => theme.bg};

  @media (max-width: 768px) {
    position: relative;
    overflow: hidden;
  }
`;

export const AppSidebar = styled.aside`
  width: ${({ $width }) => `${$width}px`};
  flex-shrink: 0;
  border-right: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.bg};

  @media (max-width: 768px) {
    position: absolute;
    inset: 0;
    width: 100%;
    border-right: none;
    transition: transform 0.25s ease;
    z-index: 2;
    transform: ${({ $chatOpen }) =>
      $chatOpen ? "translateX(-100%)" : "translateX(0)"};
  }
`;

export const AppChat = styled.main`
  flex: 1;
  min-width: 0;
  background: ${({ theme }) => theme.bg};

  @media (max-width: 768px) {
    position: absolute;
    inset: 0;
    width: 100%;
    transition: transform 0.25s ease;
    z-index: 3;
    transform: ${({ $chatOpen }) =>
      $chatOpen ? "translateX(0)" : "translateX(100%)"};
  }
`;

export const ChatEmpty = styled.div`
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.text};
`;

export const ResizeHandleStyled = styled.div`
  width: 6px;
  flex-shrink: 0;
  cursor: col-resize;
  position: relative;
  background: transparent;

  &:hover {
    background: rgba(0, 163, 255, 0.15);
  }

  &::before {
    content: "";
    position: absolute;
    inset: 0;
  }

  @media (max-width: 768px) {
    display: none;
  }
`;