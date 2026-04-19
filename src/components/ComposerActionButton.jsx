import {
  MicButtonStyled,
  SendButtonStyled,
  StopRecordButtonStyled,
} from "../styles/messenger.styled";

const ComposerActionButton = ({
  hasText,
  isRecording,
  recordType,
  onPointerDown,
  onClick,
}) => {
  if (hasText) {
    return (
      <SendButtonStyled type="submit" aria-label="Отправить сообщение">
        <svg>
          <use href="/img/symbol-defs.svg#icon-planet"></use>
        </svg>
      </SendButtonStyled>
    );
  }

  const ButtonStyled = isRecording ? StopRecordButtonStyled : MicButtonStyled;

  return (
    <ButtonStyled
      type="button"
      onPointerDown={onPointerDown}
      onClick={onClick}
      aria-label={
        recordType === "audio"
          ? "Клик для переключения на кружок, удерживайте для записи голосового"
          : "Клик для переключения на голосовое, удерживайте для записи кружка"
      }
    >
      {isRecording ? "■" : recordType === "audio" ? "🎙️" : "🎥"}
    </ButtonStyled>
  );
};

export default ComposerActionButton;