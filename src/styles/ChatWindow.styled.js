import styled from "styled-components";

export const InputMessageStyled = styled.input`
    color: #A0A0A0;
    font-family: Inter;
    font-size: 24px;
    font-weight: 400;
    background-color: transparent;
    outline: none;
    border: none;
    width: 100%;

    &:focus {
        outline: none;
    }
`;

export const ButtonContextMenuStyled = styled.button`
    display: none;
    font-size: 18px;
    color: var(--text);
    padding: 4px 8px;
    border-radius: 8px;

    @media (hover: none) and (pointer: coarse) {
        display: inline-flex;
        align-items: center;
        justify-content: center;
    }
`;