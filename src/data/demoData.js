export const users = [
  {
    id: "u1",
    name: "Анна",
    avatar:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSsc3WLwt1VO_zCe9FTBOByMFq7iya4QO38gA&s",
    isTyping: false,
    isOnline: false,
  },
  {
    id: "u3",
    name: "Макс",
    avatar:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSfcbg4vgnOEYx67CzLzBbmfSYJ82mdXVA08g&s",
    isTyping: false,
    isOnline: true,
  },
  {
    id: "u4",
    name: "Mr_Donnotella",
    avatar:
      "https://cdn.discordapp.com/attachments/1199628062124429332/1495399729767518208/a43039e40fb6d153bebb1e201ec373ab.png?ex=69e61b06&is=69e4c986&hm=8c030c042cbd75674b6d7643708c6377c91f316f568922ca461288788ca482bb&",
    isTyping: false,
    isOnline: false,
  },
];

export const chats = [
  { id: "c1", members: ["u1", "u2"] },
  { id: "c2", members: ["u2", "u3"] },
  { id: "c3", members: ["u2", "u4"] },
];

export const initialMessages = [
  {
    id: "m1",
    chatId: "c1",
    senderId: "u1",
    text: "Привет",
    createdAt: "2026-04-18T17:11:26.542Z",
  },
  {
    id: "m2",
    chatId: "c1",
    senderId: "u2",
    text: "Дароу!",
    createdAt: "2026-04-18T17:12:26.542Z",
  },
  {
    id: "m3",
    chatId: "c2",
    senderId: "u3",
    text: "Ты тут?",
    createdAt: "2024-04-16T17:14:26.542Z",
  },
  {
    id: "m4",
    chatId: "c3",
    senderId: "u4",
    text: "qwerty?????????????????????????????????????",
    createdAt: "2024-04-16T17:14:26.542Z",
  },
];