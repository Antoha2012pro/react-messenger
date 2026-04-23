export const FALLBACK_AVATAR =
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSsc3WLwt1VO_zCe9FTBOByMFq7iya4QO38gA&s";

export const normalizeMessage = message => ({
  ...message,
  id: String(message.id),
  chatId: String(message.chatId),
  senderId: String(message.senderId),
});

export const mapUserToContact = user => ({
  id: String(user.id),
  name: user.username,
  avatar: user.avatarUrl || FALLBACK_AVATAR,
  isTyping: false,
  isOnline: false,
  email: user.email,
});

export const buildDirectChats = (contacts, currentUserId) =>
  contacts.map(item => ({
    id: `direct-${item.id}`,
    members: [currentUserId, item.id],
  }));

export const getOtherUserId = (members, currentUserId) =>
  members.find(id => id !== currentUserId);

export const mergeMessagesById = messages => {
  const uniqueMessages = new Map();

  messages.forEach(message => {
    const normalized = normalizeMessage(message);
    uniqueMessages.set(normalized.id, normalized);
  });

  return Array.from(uniqueMessages.values()).sort(
    (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
  );
};