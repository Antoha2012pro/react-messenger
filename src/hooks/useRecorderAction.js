import { useEffect, useRef, useState } from "react";

const HOLD_DELAY = 180;

export const useRecorderAction = ({
    hasText,
    onSendAudioMessage,
    onSendVideoMessage,
}) => {
    const [recordType, setRecordType] = useState("audio");
    const [isRecording, setIsRecording] = useState(false);

    const holdTimerRef = useRef(null);
    const didHoldRef = useRef(false);
    const skipClickRef = useRef(false);

    const mediaRecorderRef = useRef(null);
    const streamRef = useRef(null);
    const chunksRef = useRef([]);

    const stopStream = () => {
        streamRef.current?.getTracks().forEach(track => track.stop());
        streamRef.current = null;
    };

    const resetRecorderRefs = () => {
        mediaRecorderRef.current = null;
        chunksRef.current = [];
    };

    const resetRecordingState = () => {
        clearTimeout(holdTimerRef.current);
        holdTimerRef.current = null;
        didHoldRef.current = false;
        skipClickRef.current = false;
        setIsRecording(false);

        const recorder = mediaRecorderRef.current;

        if (recorder && recorder.state !== "inactive") {
            recorder.stop();
            return;
        }

        stopStream();
        resetRecorderRefs();
    };

    useEffect(() => {
        return () => {
            clearTimeout(holdTimerRef.current);
            stopStream();
        };
    }, []);

    const getConstraints = type =>
        type === "video"
            ? {
                audio: true,
                video: {
                    facingMode: "user",
                    width: { ideal: 240 },
                    height: { ideal: 240 },
                },
            }
            : { audio: true };

    const getMimeType = type => {
        if (type === "video") {
            if (MediaRecorder.isTypeSupported("video/webm;codecs=vp8,opus")) {
                return "video/webm;codecs=vp8,opus";
            }

            if (MediaRecorder.isTypeSupported("video/webm")) {
                return "video/webm";
            }

            return "";
        }

        if (MediaRecorder.isTypeSupported("audio/webm;codecs=opus")) {
            return "audio/webm;codecs=opus";
        }

        if (MediaRecorder.isTypeSupported("audio/webm")) {
            return "audio/webm";
        }

        return "";
    };

    const sendRecordedFile = (type, url) => {
        if (type === "video") {
            onSendVideoMessage?.(url);
            return;
        }

        onSendAudioMessage?.(url);
    };

    const startRecording = async type => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia(
                getConstraints(type)
            );

            streamRef.current = stream;
            chunksRef.current = [];

            const mimeType = getMimeType(type);
            const recorder = mimeType
                ? new MediaRecorder(stream, { mimeType })
                : new MediaRecorder(stream);

            mediaRecorderRef.current = recorder;

            recorder.ondataavailable = event => {
                if (event.data.size > 0) {
                    chunksRef.current.push(event.data);
                }
            };

            recorder.onstop = () => {
                const blob = new Blob(chunksRef.current, {
                    type: recorder.mimeType || mimeType || (type === "video" ? "video/webm" : "audio/webm"),
                });

                const url = URL.createObjectURL(blob);
                sendRecordedFile(type, url);

                stopStream();
                resetRecorderRefs();
            };

            recorder.start();
            setIsRecording(true);
        } catch (error) {
            console.error(`Не удалось начать запись ${type}`, error);
            resetRecordingState();
        }
    };

    const stopRecording = () => {
        const recorder = mediaRecorderRef.current;

        if (recorder && recorder.state !== "inactive") {
            recorder.stop();
        } else {
            stopStream();
            resetRecorderRefs();
        }

        setIsRecording(false);
    };

    const handleRecordEnd = () => {
        clearTimeout(holdTimerRef.current);
        holdTimerRef.current = null;

        if (!didHoldRef.current) return;

        skipClickRef.current = true;
        stopRecording();
        didHoldRef.current = false;
    };

    const handleRecordPointerDown = () => {
        if (hasText) return;

        didHoldRef.current = false;

        const finish = () => {
            window.removeEventListener("pointerup", finish);
            window.removeEventListener("pointercancel", finish);
            handleRecordEnd();
        };

        window.addEventListener("pointerup", finish, { once: true });
        window.addEventListener("pointercancel", finish, { once: true });

        holdTimerRef.current = setTimeout(() => {
            didHoldRef.current = true;
            startRecording(recordType);
        }, HOLD_DELAY);
    };

    const handleRecordClick = () => {
        if (hasText || isRecording) return;

        if (skipClickRef.current) {
            skipClickRef.current = false;
            return;
        }

        setRecordType(prev => (prev === "audio" ? "video" : "audio"));
    };

    return {
        recordType,
        isRecording,
        handleRecordPointerDown,
        handleRecordClick,
        resetRecordingState,
    };
};