export const formatMessageTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();

    const isToday = date.toDateString() === now.toDateString();

    const yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);
    const isYesterday = date.toDateString() === yesterday.toDateString();

    if (isToday) {
        return new Intl.DateTimeFormat("ru-RU", {
            hour: "2-digit",
            minute: "2-digit",
        }).format(date);
    }

    if (isYesterday) {
        return "Вчера";
    }

    return new Intl.DateTimeFormat("ru-RU", {
        day: "2-digit",
        month: "short",
    }).format(date);
};