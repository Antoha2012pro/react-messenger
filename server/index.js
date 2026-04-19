require("dotenv").config();

const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const db = require("./db");
const requireAuth = require("./middleware/auth");

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";

app.use(cors({ origin: CLIENT_URL }));
app.use(express.json());

function mapUser(row) {
  if (!row) return null;

  return {
    id: String(row.id),
    email: row.email,
    username: row.username,
    avatarUrl: row.avatar_url,
    createdAt: row.created_at,
  };
}

function mapMessage(row) {
  if (!row) return null;

  return {
    id: String(row.id),
    chatId: String(row.chat_id),
    senderId: String(row.sender_id),
    senderName: row.sender_username || null,
    text: row.text,
    type: row.type,
    audioUrl: row.audio_url,
    videoUrl: row.video_url,
    createdAt: row.created_at,
  };
}

function createToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      username: user.username,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
}

function ensureChatMember(chatId, userId) {
  const member = db
    .prepare(
      `
      SELECT 1
      FROM chat_members
      WHERE chat_id = ? AND user_id = ?
      `
    )
    .get(chatId, userId);

  return Boolean(member);
}

function getChatMembers(chatId) {
  const rows = db
    .prepare(
      `
      SELECT u.id, u.email, u.username, u.avatar_url, u.created_at
      FROM chat_members cm
      JOIN users u ON u.id = cm.user_id
      WHERE cm.chat_id = ?
      ORDER BY u.id ASC
      `
    )
    .all(chatId);

  return rows.map(mapUser);
}

function getLastMessage(chatId) {
  const row = db
    .prepare(
      `
      SELECT
        m.id,
        m.chat_id,
        m.sender_id,
        m.text,
        m.type,
        m.audio_url,
        m.video_url,
        m.created_at,
        u.username AS sender_username
      FROM messages m
      JOIN users u ON u.id = m.sender_id
      WHERE m.chat_id = ?
      ORDER BY datetime(m.created_at) DESC, m.id DESC
      LIMIT 1
      `
    )
    .get(chatId);

  return mapMessage(row);
}

function getChatForUser(chatId, userId) {
  const chat = db
    .prepare(
      `
      SELECT c.id, c.is_direct, c.created_at
      FROM chats c
      JOIN chat_members cm ON cm.chat_id = c.id
      WHERE c.id = ? AND cm.user_id = ?
      `
    )
    .get(chatId, userId);

  if (!chat) return null;

  return {
    id: String(chat.id),
    isDirect: Boolean(chat.is_direct),
    createdAt: chat.created_at,
    members: getChatMembers(chat.id),
    lastMessage: getLastMessage(chat.id),
  };
}

function getChatsForUser(userId) {
  const rows = db
    .prepare(
      `
      SELECT c.id, c.is_direct, c.created_at
      FROM chats c
      JOIN chat_members cm ON cm.chat_id = c.id
      WHERE cm.user_id = ?
      ORDER BY c.id DESC
      `
    )
    .all(userId);

  const chats = rows.map(chat => ({
    id: String(chat.id),
    isDirect: Boolean(chat.is_direct),
    createdAt: chat.created_at,
    members: getChatMembers(chat.id),
    lastMessage: getLastMessage(chat.id),
  }));

  chats.sort((a, b) => {
    const aDate = a.lastMessage?.createdAt || a.createdAt;
    const bDate = b.lastMessage?.createdAt || b.createdAt;
    return new Date(bDate) - new Date(aDate);
  });

  return chats;
}

app.get("/api/test", (req, res) => {
  res.json({ ok: true });
});

app.post("/api/auth/register", async (req, res) => {
  try {
    const email = req.body.email?.trim().toLowerCase();
    const username = req.body.username?.trim();
    const password = req.body.password?.trim();

    if (!email || !username || !password) {
      return res.status(400).json({ message: "Заполни все поля" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Пароль должен быть минимум 6 символов" });
    }

    const userByEmail = db
      .prepare(`SELECT * FROM users WHERE email = ?`)
      .get(email);

    if (userByEmail) {
      return res.status(400).json({ message: "Email уже занят" });
    }

    const userByUsername = db
      .prepare(`SELECT * FROM users WHERE username = ?`)
      .get(username);

    if (userByUsername) {
      return res.status(400).json({ message: "Username уже занят" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const result = db
      .prepare(
        `
        INSERT INTO users (email, username, password_hash)
        VALUES (?, ?, ?)
        `
      )
      .run(email, username, passwordHash);

    const user = db
      .prepare(
        `
        SELECT id, email, username, avatar_url, created_at
        FROM users
        WHERE id = ?
        `
      )
      .get(result.lastInsertRowid);

    const token = createToken(user);

    res.status(201).json({
      token,
      user: mapUser(user),
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const email = req.body.email?.trim().toLowerCase();
    const password = req.body.password?.trim();

    if (!email || !password) {
      return res.status(400).json({ message: "Заполни все поля" });
    }

    const user = db
      .prepare(`SELECT * FROM users WHERE email = ?`)
      .get(email);

    if (!user) {
      return res.status(400).json({ message: "Неверный email или пароль" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      return res.status(400).json({ message: "Неверный email или пароль" });
    }

    const token = createToken(user);

    res.json({
      token,
      user: mapUser(user),
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

app.get("/api/auth/me", requireAuth, (req, res) => {
  try {
    const user = db
      .prepare(
        `
        SELECT id, email, username, avatar_url, created_at
        FROM users
        WHERE id = ?
        `
      )
      .get(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }

    res.json({ user: mapUser(user) });
  } catch (error) {
    console.error("ME ERROR:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

app.get("/api/users", requireAuth, (req, res) => {
  try {
    const q = req.query.q?.trim() || "";

    let users;

    if (q) {
      const search = `%${q}%`;
      users = db
        .prepare(
          `
          SELECT id, email, username, avatar_url, created_at
          FROM users
          WHERE id != ?
            AND (username LIKE ? OR email LIKE ?)
          ORDER BY username COLLATE NOCASE ASC
          `
        )
        .all(req.user.id, search, search);
    } else {
      users = db
        .prepare(
          `
          SELECT id, email, username, avatar_url, created_at
          FROM users
          WHERE id != ?
          ORDER BY username COLLATE NOCASE ASC
          `
        )
        .all(req.user.id);
    }

    res.json({
      users: users.map(mapUser),
    });
  } catch (error) {
    console.error("GET USERS ERROR:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

app.get("/api/chats", requireAuth, (req, res) => {
  try {
    const chats = getChatsForUser(req.user.id);
    res.json({ chats });
  } catch (error) {
    console.error("GET CHATS ERROR:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

app.post("/api/chats/direct", requireAuth, (req, res) => {
  try {
    const targetUserId = Number(req.body.userId);
    const currentUserId = Number(req.user.id);

    if (!targetUserId) {
      return res.status(400).json({ message: "userId обязателен" });
    }

    if (targetUserId === currentUserId) {
      return res.status(400).json({ message: "Нельзя создать чат с самим собой" });
    }

    const targetUser = db
      .prepare(`SELECT id FROM users WHERE id = ?`)
      .get(targetUserId);

    if (!targetUser) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }

    const existingChat = db
      .prepare(
        `
        SELECT c.id
        FROM chats c
        JOIN chat_members cm1 ON cm1.chat_id = c.id AND cm1.user_id = ?
        JOIN chat_members cm2 ON cm2.chat_id = c.id AND cm2.user_id = ?
        WHERE c.is_direct = 1
        LIMIT 1
        `
      )
      .get(currentUserId, targetUserId);

    if (existingChat) {
      const chat = getChatForUser(existingChat.id, currentUserId);
      return res.json({ chat });
    }

    const createChat = db.transaction(() => {
      const chatResult = db
        .prepare(
          `
          INSERT INTO chats (is_direct)
          VALUES (1)
          `
        )
        .run();

      const chatId = Number(chatResult.lastInsertRowid);

      db.prepare(
        `
        INSERT INTO chat_members (chat_id, user_id)
        VALUES (?, ?)
        `
      ).run(chatId, currentUserId);

      db.prepare(
        `
        INSERT INTO chat_members (chat_id, user_id)
        VALUES (?, ?)
        `
      ).run(chatId, targetUserId);

      return chatId;
    });

    const chatId = createChat();
    const chat = getChatForUser(chatId, currentUserId);

    res.status(201).json({ chat });
  } catch (error) {
    console.error("CREATE DIRECT CHAT ERROR:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

app.get("/api/chats/:chatId/messages", requireAuth, (req, res) => {
  try {
    const chatId = Number(req.params.chatId);

    if (!chatId) {
      return res.status(400).json({ message: "Некорректный chatId" });
    }

    if (!ensureChatMember(chatId, req.user.id)) {
      return res.status(403).json({ message: "Нет доступа к этому чату" });
    }

    const rows = db
      .prepare(
        `
        SELECT
          m.id,
          m.chat_id,
          m.sender_id,
          m.text,
          m.type,
          m.audio_url,
          m.video_url,
          m.created_at,
          u.username AS sender_username
        FROM messages m
        JOIN users u ON u.id = m.sender_id
        WHERE m.chat_id = ?
        ORDER BY datetime(m.created_at) ASC, m.id ASC
        `
      )
      .all(chatId);

    res.json({
      messages: rows.map(mapMessage),
    });
  } catch (error) {
    console.error("GET MESSAGES ERROR:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

app.post("/api/messages", requireAuth, (req, res) => {
  try {
    const chatId = Number(req.body.chatId);
    const type = req.body.type || "text";
    const text = req.body.text?.trim() || null;
    const audioUrl = req.body.audioUrl || null;
    const videoUrl = req.body.videoUrl || null;

    if (!chatId) {
      return res.status(400).json({ message: "chatId обязателен" });
    }

    if (!ensureChatMember(chatId, req.user.id)) {
      return res.status(403).json({ message: "Нет доступа к этому чату" });
    }

    if (type === "text" && !text) {
      return res.status(400).json({ message: "Текст сообщения пустой" });
    }

    if (type === "audio" && !audioUrl) {
      return res.status(400).json({ message: "audioUrl обязателен" });
    }

    if (type === "video" && !videoUrl) {
      return res.status(400).json({ message: "videoUrl обязателен" });
    }

    const result = db
      .prepare(
        `
        INSERT INTO messages (chat_id, sender_id, text, type, audio_url, video_url)
        VALUES (?, ?, ?, ?, ?, ?)
        `
      )
      .run(chatId, req.user.id, text, type, audioUrl, videoUrl);

    const message = db
      .prepare(
        `
        SELECT
          m.id,
          m.chat_id,
          m.sender_id,
          m.text,
          m.type,
          m.audio_url,
          m.video_url,
          m.created_at,
          u.username AS sender_username
        FROM messages m
        JOIN users u ON u.id = m.sender_id
        WHERE m.id = ?
        `
      )
      .get(result.lastInsertRowid);

    res.status(201).json({
      message: mapMessage(message),
    });
  } catch (error) {
    console.error("CREATE MESSAGE ERROR:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});

app.get("/api/chats/:chatId/messages", requireAuth, (req, res) => {
  const chatId = Number(req.params.chatId);

  if (!chatId) {
    return res.status(400).json({ message: "Некорректный chatId" });
  }

  const member = db
    .prepare(
      `
      SELECT 1
      FROM chat_members
      WHERE chat_id = ? AND user_id = ?
      `
    )
    .get(chatId, req.user.id);

  if (!member) {
    return res.status(403).json({ message: "Нет доступа к этому чату" });
  }

  const rows = db
    .prepare(
      `
      SELECT
        m.id,
        m.chat_id AS chatId,
        m.sender_id AS senderId,
        m.text,
        m.created_at AS createdAt
      FROM messages m
      WHERE m.chat_id = ?
      ORDER BY m.id ASC
      `
    )
    .all(chatId);

  const messages = rows.map(item => ({
    id: String(item.id),
    chatId: String(item.chatId),
    senderId: String(item.senderId),
    text: item.text,
    createdAt: item.createdAt,
  }));

  res.json({ messages });
});

app.post("/api/messages", requireAuth, (req, res) => {
  const { chatId, text } = req.body;

  const numericChatId = Number(chatId);
  const trimmedText = String(text || "").trim();

  if (!numericChatId) {
    return res.status(400).json({ message: "Некорректный chatId" });
  }

  if (!trimmedText) {
    return res.status(400).json({ message: "Сообщение пустое" });
  }

  const member = db
    .prepare(
      `
      SELECT 1
      FROM chat_members
      WHERE chat_id = ? AND user_id = ?
      `
    )
    .get(numericChatId, req.user.id);

  if (!member) {
    return res.status(403).json({ message: "Нет доступа к этому чату" });
  }

  const info = db
    .prepare(
      `
      INSERT INTO messages (chat_id, sender_id, text)
      VALUES (?, ?, ?)
      `
    )
    .run(numericChatId, req.user.id, trimmedText);

  const row = db
    .prepare(
      `
      SELECT
        id,
        chat_id AS chatId,
        sender_id AS senderId,
        text,
        created_at AS createdAt
      FROM messages
      WHERE id = ?
      `
    )
    .get(info.lastInsertRowid);

  res.status(201).json({
    message: {
      id: String(row.id),
      chatId: String(row.chatId),
      senderId: String(row.senderId),
      text: row.text,
      createdAt: row.createdAt,
    },
  });
});