// import express from "express";
// import mysql from "mysql2";
// import session from "express-session";
// import MySQLStore from "express-mysql-session";
// import cors from "cors";
// import path from "path";
// import fs from "fs";
// import multer from "multer";
// import { createHash } from "crypto";
// import { fileURLToPath } from "url";
// import { WebSocketServer } from "ws";

// // تعریف __dirname و __filename برای ES Modules
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const app = express();

// // تنظیم CORS
// app.use(
//   cors({
//     origin: "http://localhost:5173",
//     credentials: true,
//     methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//   })
// );

// app.use(express.static(path.join(__dirname, "../public")));

// app.options("*", cors());

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // تنظیم express-mysql-session
// const MySQLStoreConstructor = MySQLStore(session);
// const sessionStore = new MySQLStoreConstructor({
//   host: "127.0.0.1",
//   user: "root",
//   password: "",
//   database: "sql_azmoon",
// });

// app.use(
//   session({
//     key: "session_cookie_name",
//     secret: "session_cookie_secret",
//     store: sessionStore,
//     resave: false,
//     saveUninitialized: false,
//     cookie: { maxAge: 1000 * 60 * 60 * 24 },
//   })
// );

// // اتصال به دیتابیس
// const db = mysql.createConnection({
//   host: "127.0.0.1",
//   user: "root",
//   password: "",
//   database: "sql_azmoon",
// });

// db.connect((err) => {
//   if (err) {
//     console.error("Error connecting to database:", err);
//     return;
//   }
//   console.log("Connected to database");
// });

// const roleAvatars = {
//   1: "avatar1.png",
//   2: "avatar2.png",
//   3: "avatar3.png",
//   4: "avatar4.png",
//   5: "avatar5.png",
//   6: "avatar6.png",
// };

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const uploadDir = path.join(__dirname, "../public/uploads");
//     if (!fs.existsSync(uploadDir)) {
//       fs.mkdirSync(uploadDir);
//     }
//     cb(null, uploadDir);
//   },
//   filename: (req, file, cb) => {
//     const uniqueName = `${Date.now()}_${file.originalname}`;
//     cb(null, uniqueName);
//   },
// });

// const upload = multer({ storage });

// // تنظیم WebSocket
// const wss = new WebSocketServer({ port: 8080 });
// const clients = new Map();

// wss.on("connection", (ws, req) => {
//   const userId = req.url.split("userId=")[1];
//   if (userId) {
//     clients.set(userId, ws);
//     ws.userId = userId;

//     // به‌روزرسانی وضعیت آنلاین
//     db.query(
//       "UPDATE users SET UserIsOnline = 'Y', UserLastActivity = NOW() WHERE UserID = ?",
//       [userId]
//     );

//     // ارسال وضعیت آنلاین به همه کلاینت‌ها
//     broadcastOnlineStatus();
//   }

//   ws.on("close", () => {
//     if (ws.userId) {
//       clients.delete(ws.userId);
//       db.query("UPDATE users SET UserIsOnline = 'N' WHERE UserID = ?", [
//         ws.userId,
//       ]);
//       broadcastOnlineStatus();
//     }
//   });
// });

// const broadcastOnlineStatus = async () => {
//   const [users] = await db
//     .promise()
//     .query("SELECT UserID, UserIsOnline, UserLastActivity FROM users");
//   const onlineStatus = users.map((user) => ({
//     id: user.UserID,
//     is_online:
//       user.UserIsOnline === "Y" &&
//       Date.now() - new Date(user.UserLastActivity).getTime() < 300000,
//   }));

//   clients.forEach((client) => {
//     if (client.readyState === client.OPEN) {
//       client.send(
//         JSON.stringify({ type: "online_status", data: onlineStatus })
//       );
//     }
//   });
// };

// const broadcastUnreadCounts = async (userId) => {
//   const userUnreadCounts = [];
//   const roleUnreadCounts = [];

//   const [users] = await db
//     .promise()
//     .query("SELECT UserID, UserRole FROM users WHERE UserID != ?", [userId]);
//   for (const user of users) {
//     const [count] = await db
//       .promise()
//       .query(
//         "SELECT COUNT(*) as count FROM messages WHERE MessageSenderID = ? AND MessageReceiverID = ? AND MessageIsRead = 0",
//         [user.UserID, userId]
//       );
//     userUnreadCounts.push({
//       user_id: user.UserID,
//       unread_count: count[0].count,
//     });
//   }

//   const [roles] = await db.promise().query("SELECT RoleID FROM roles");
//   for (const role of roles) {
//     const role_id = role.RoleID;
//     const [role_users] = await db
//       .promise()
//       .query(
//         `SELECT UserID FROM users WHERE UserRole = ${role_id} AND UserID != ${userId}`
//       );
//     let unread_count = 0;
//     for (const user of role_users) {
//       const [count] = await db
//         .promise()
//         .query(
//           "SELECT COUNT(*) as count FROM messages WHERE MessageSenderID = ? AND MessageReceiverID = ? AND MessageIsRead = 0",
//           [user.UserID, userId]
//         );
//       unread_count += count[0].count;
//     }
//     roleUnreadCounts.push({ role_id: role_id, unread_count });
//   }

//   const client = clients.get(userId.toString());
//   if (client && client.readyState === client.OPEN) {
//     client.send(
//       JSON.stringify({
//         type: "unread_counts",
//         data: {
//           user_unread_counts: userUnreadCounts,
//           role_unread_counts: roleUnreadCounts,
//         },
//       })
//     );
//   }
// };

// const broadcastMessage = async (message, senderId, receiverId) => {
//   const [file] = await db
//     .promise()
//     .query("SELECT FileName, FilePath FROM files WHERE FileMessageID = ?", [
//       message.MessageID,
//     ]);
//   const messageData = {
//     ...message,
//     FileName: file[0]?.FileName,
//     FilePath: file[0]?.FilePath,
//   };

//   [senderId, receiverId].forEach((userId) => {
//     const client = clients.get(userId.toString());
//     if (client && client.readyState === client.OPEN) {
//       client.send(JSON.stringify({ type: "new_message", data: messageData }));
//     }
//   });

//   // به‌روزرسانی تعداد پیام‌های خوانده‌نشده
//   broadcastUnreadCounts(senderId);
//   broadcastUnreadCounts(receiverId);
// };

// // مدیریت درخواست‌های HTTP
// app.post("/api", upload.single("file"), async (req, res) => {
//   const {
//     action,
//     username,
//     password,
//     receiver_id,
//     message,
//     message_id,
//     new_message,
//     user_id,
//   } = req.body;

//   if (!req.session.user_id && action !== "login") {
//     return res.status(401).json({ success: false, message: "Unauthorized" });
//   }

//   const user_id_session = req.session.user_id;

//   if (action === "login") {
//     const query = "SELECT * FROM users WHERE UserName = ?";
//     db.query(query, [username], async (err, results) => {
//       if (err)
//         return res
//           .status(500)
//           .json({ success: false, message: "Database error" });
//       if (results.length === 0) {
//         return res
//           .status(401)
//           .json({ success: false, message: "Invalid credentials" });
//       }

//       const user = results[0];
//       if (user.UserPass !== createHash("md5").update(password).digest("hex")) {
//         return res
//           .status(401)
//           .json({ success: false, message: "Invalid credentials" });
//       }

//       req.session.user_id = user.UserID;
//       req.session.user_role = user.UserRole;
//       req.session.save((err) => {
//         if (err) {
//           console.error("Error saving session:", err);
//           return res
//             .status(500)
//             .json({ success: false, message: "Session save error" });
//         }
//         db.query("UPDATE users SET UserIsOnline = 'Y' WHERE UserID = ?", [
//           user.UserID,
//         ]);
//         res.json({ success: true });
//       });
//     });
//   } else if (action === "logout") {
//     db.query("UPDATE users SET UserIsOnline = 'N' WHERE UserID = ?", [
//       user_id_session,
//     ]);
//     req.session.destroy();
//     res.json({ success: true });
//   } else if (action === "get_initial_data") {
//     db.query("UPDATE users SET UserLastActivity = NOW() WHERE UserID = ?", [
//       user_id_session,
//     ]);

//     const role = req.session.user_role;
//     let allowed_roles = [];
//     switch (role) {
//       case 1:
//       case 2:
//         allowed_roles = [1, 2, 3, 4, 5, 6];
//         break;
//       case 3:
//       case 4:
//         allowed_roles = [1, 2, 6];
//         break;
//       case 5:
//         allowed_roles = [1, 2];
//         break;
//       case 6:
//         allowed_roles = [1, 2, 3, 4];
//         break;
//     }

//     const roles_query =
//       "SELECT * FROM roles WHERE RoleID IN (" + allowed_roles.join(",") + ")";
//     db.query(roles_query, (err, roles) => {
//       if (err) {
//         console.error("Error fetching roles:", err);
//         return res
//           .status(500)
//           .json({ success: false, message: "Database error" });
//       }

//       const selected_role = req.query.role;
//       let users_query;
//       if (selected_role && allowed_roles.includes(parseInt(selected_role))) {
//         users_query = `SELECT * FROM users WHERE UserID != ${user_id_session} AND UserRole = ${selected_role}`;
//       } else {
//         users_query = `SELECT * FROM users WHERE UserID != ${user_id_session} AND UserRole IN (${allowed_roles.join(
//           ","
//         )})`;
//       }

//       db.query(users_query, async (err, users) => {
//         if (err) {
//           console.error("Error fetching users:", err);
//           return res
//             .status(500)
//             .json({ success: false, message: "Database error" });
//         }

//         const unread_counts = {};
//         const role_unread_counts = {};

//         for (const user of users) {
//           const receiver_id = user.UserID;
//           const [unread] = await db
//             .promise()
//             .query(
//               "SELECT COUNT(*) as count FROM messages WHERE MessageSenderID = ? AND MessageReceiverID = ? AND MessageIsRead = 0",
//               [receiver_id, user_id_session]
//             );
//           unread_counts[receiver_id] = unread[0].count;

//           const [post] = await db
//             .promise()
//             .query("SELECT PostNameFA FROM posts WHERE PostID = ?", [
//               user.UserPostRef,
//             ]);
//           user.PostTitle = post[0]?.PostNameFA || "";
//           user.UserPic = roleAvatars[user.UserRole];
//         }

//         for (const role of roles) {
//           const role_id = role.RoleID;
//           const [role_users] = await db
//             .promise()
//             .query(
//               `SELECT UserID FROM users WHERE UserRole = ${role_id} AND UserID != ${user_id_session}`
//             );
//           let unread_count = 0;
//           for (const user of role_users) {
//             const receiver_id = user.UserID;
//             const [count] = await db
//               .promise()
//               .query(
//                 "SELECT COUNT(*) as count FROM messages WHERE MessageSenderID = ? AND MessageReceiverID = ? AND MessageIsRead = 0",
//                 [receiver_id, user_id_session]
//               );
//             unread_count += count[0].count;
//           }
//           role_unread_counts[role_id] = unread_count;
//         }

//         res.json({
//           success: true,
//           roles,
//           users,
//           unread_counts,
//           role_unread_counts,
//           current_user_role: role,
//           current_user_id: user_id_session,
//         });
//       });
//     });
//   } else if (action === "get_user_details") {
//     const query = `
//       SELECT u.*, p.PostNameFA as PostTitle
//       FROM users u
//       LEFT JOIN posts p ON u.UserPostRef = p.PostID
//       WHERE u.UserID = ?`;
//     db.query(query, [user_id], (err, results) => {
//       if (err)
//         return res
//           .status(500)
//           .json({ success: false, message: "Database error" });
//       res.json({ success: true, user: results[0] });
//     });
//   } else if (action === "load_messages") {
//     const sender_role = req.session.user_role;
//     const [receiver] = await db
//       .promise()
//       .query("SELECT UserRole FROM users WHERE UserID = ?", [receiver_id]);
//     const receiver_role = receiver[0].UserRole;

//     let allowed = false;
//     switch (sender_role) {
//       case 1:
//       case 2:
//         allowed = true;
//         break;
//       case 3:
//       case 4:
//         allowed = [1, 2, 6].includes(receiver_role);
//         break;
//       case 5:
//         allowed = [1, 2].includes(receiver_role);
//         break;
//       case 6:
//         allowed = [1, 2, 3, 4].includes(receiver_role);
//         break;
//     }

//     if (!allowed) {
//       return res.status(403).json({ success: false, message: "Access denied" });
//     }

//     db.query(
//       "UPDATE messages SET MessageIsRead = 1 WHERE MessageSenderID = ? AND MessageReceiverID = ? AND MessageIsRead = 0",
//       [receiver_id, user_id_session],
//       async (err) => {
//         if (err) {
//           console.error("Error updating messages:", err);
//           return res
//             .status(500)
//             .json({ success: false, message: "Database error" });
//         }

//         // به‌روزرسانی تعداد پیام‌های خوانده‌نشده
//         await broadcastUnreadCounts(user_id_session);
//         await broadcastUnreadCounts(receiver_id);
//       }
//     );

//     const limit = parseInt(req.body.limit) || 10;
//     const offset = parseInt(req.body.offset) || 0;

//     const countQuery = `
//       SELECT COUNT(*) as total
//       FROM messages
//       WHERE (MessageSenderID = ? AND MessageReceiverID = ?) OR (MessageSenderID = ? AND MessageReceiverID = ?)
//     `;
//     const [countResult] = await db
//       .promise()
//       .query(countQuery, [
//         user_id_session,
//         receiver_id,
//         receiver_id,
//         user_id_session,
//       ]);
//     const totalMessages = countResult[0].total;

//     const query = `
//       SELECT m.*, f.FileName, f.FilePath
//       FROM messages m
//       LEFT JOIN files f ON m.MessageID = f.FileMessageID
//       WHERE (m.MessageSenderID = ? AND m.MessageReceiverID = ?) OR (m.MessageSenderID = ? AND m.MessageReceiverID = ?)
//       ORDER BY m.MessageTimestamp DESC
//       LIMIT ? OFFSET ?
//     `;
//     db.query(
//       query,
//       [
//         user_id_session,
//         receiver_id,
//         receiver_id,
//         user_id_session,
//         limit,
//         offset,
//       ],
//       (err, messages) => {
//         if (err)
//           return res
//             .status(500)
//             .json({ success: false, message: "Database error" });
//         res.json({
//           success: true,
//           messages: messages.reverse(),
//           total: totalMessages,
//         });
//       }
//     );
//   } else if (action === "send_message") {
//     const file = req.file;
//     const sender_role = req.session.user_role;
//     const [receiver] = await db
//       .promise()
//       .query("SELECT UserRole FROM users WHERE UserID = ?", [receiver_id]);
//     const receiver_role = receiver[0].UserRole;

//     let allowed = false;
//     switch (sender_role) {
//       case 1:
//       case 2:
//         allowed = true;
//         break;
//       case 3:
//       case 4:
//         allowed = [1, 2, 6].includes(receiver_role);
//         break;
//       case 5:
//         allowed = [1, 2].includes(receiver_role);
//         break;
//       case 6:
//         allowed = [1, 2, 3, 4].includes(receiver_role);
//         break;
//     }

//     if (!allowed) {
//       return res.status(403).json({ success: false, message: "Access denied" });
//     }

//     const query = `
//       INSERT INTO messages (MessageSenderID, MessageReceiverID, MessageText, MessageIsRead)
//       VALUES (?, ?, ?, 0)`;
//     db.query(
//       query,
//       [user_id_session, receiver_id, message || ""],
//       async (err, result) => {
//         if (err)
//           return res
//             .status(500)
//             .json({ success: false, message: "Database error" });
//         const message_id = result.insertId;

//         let filePath = null;
//         if (file) {
//           filePath = `/uploads/${file.filename}`;
//           const fileQuery = `
//             INSERT INTO files (FileMessageID, FileName, FileType, FileSize, FilePath)
//             VALUES (?, ?, ?, ?, ?)`;
//           db.query(
//             fileQuery,
//             [message_id, file.originalname, file.mimetype, file.size, filePath],
//             (err) => {
//               if (err)
//                 return res
//                   .status(500)
//                   .json({ success: false, message: "Database error" });
//             }
//           );
//         }

//         // دریافت پیام برای ارسال به WebSocket
//         const [newMessage] = await db
//           .promise()
//           .query("SELECT * FROM messages WHERE MessageID = ?", [message_id]);
//         broadcastMessage(
//           {
//             ...newMessage[0],
//             FilePath: filePath,
//             FileName: file?.originalname,
//           },
//           user_id_session,
//           receiver_id
//         );

//         res.json({ success: true });
//       }
//     );
//   } else if (action === "edit_message") {
//     const [message_data] = await db
//       .promise()
//       .query(
//         "SELECT MessageSenderID, MessageText, FileName, FilePath FROM messages LEFT JOIN files ON messages.MessageID = files.FileMessageID WHERE MessageID = ?",
//         [message_id]
//       );

//     if (message_data[0].MessageSenderID !== user_id_session) {
//       return res.status(403).json({ success: false, message: "Access denied" });
//     }

//     if (message_data[0].MessageText === new_message && !req.file) {
//       return res.json({
//         success: true,
//         message: "No change",
//         updated_message: message_data[0],
//       });
//     }

//     let updated_message_data = {
//       message_text: new_message,
//       file_name: message_data[0].FileName,
//       file_path: message_data[0].FilePath,
//     };

//     if (req.file) {
//       const filePath = `/uploads/${req.file.filename}`;
//       const [file_data] = await db
//         .promise()
//         .query("SELECT FilePath FROM files WHERE FileMessageID = ?", [
//           message_id,
//         ]);

//       if (file_data[0]?.FilePath) {
//         fs.unlinkSync(path.join(__dirname, "../public", file_data[0].FilePath));
//       }

//       const fileQuery = `
//         UPDATE files 
//         SET FileName = ?, FileType = ?, FileSize = ?, FilePath = ?
//         WHERE FileMessageID = ?`;
//       db.query(
//         fileQuery,
//         [
//           req.file.originalname,
//           req.file.mimetype,
//           req.file.size,
//           filePath,
//           message_id,
//         ],
//         (err) => {
//           if (err)
//             return res
//               .status(500)
//               .json({ success: false, message: "Database error" });
//         }
//       );

//       updated_message_data.file_name = req.file.originalname;
//       updated_message_data.file_path = filePath;
//     }

//     db.query(
//       "UPDATE messages SET MessageText = ?, MessageIsEdited = TRUE WHERE MessageID = ?",
//       [new_message, message_id],
//       async (err) => {
//         if (err)
//           return res
//             .status(500)
//             .json({ success: false, message: "Database error" });

//         const [updatedMessage] = await db
//           .promise()
//           .query("SELECT * FROM messages WHERE MessageID = ?", [message_id]);
//         broadcastMessage(updatedMessage[0], user_id_session, receiver_id);

//         res.json({
//           success: true,
//           updated_message: updated_message_data,
//         });
//       }
//     );
//   } else if (action === "delete_message") {
//     const [message_data] = await db
//       .promise()
//       .query(
//         "SELECT MessageSenderID, MessageReceiverID FROM messages WHERE MessageID = ?",
//         [message_id]
//       );
//     if (message_data[0].MessageSenderID !== user_id_session) {
//       return res.status(403).json({ success: false, message: "Access denied" });
//     }

//     const [file_data] = await db
//       .promise()
//       .query("SELECT FilePath FROM files WHERE FileMessageID = ?", [
//         message_id,
//       ]);
//     if (file_data[0]?.FilePath) {
//       fs.unlinkSync(path.join(__dirname, "../public", file_data[0].FilePath));
//     }

//     db.query("DELETE FROM files WHERE FileMessageID = ?", [message_id]);
//     db.query(
//       "DELETE FROM messages WHERE MessageID = ?",
//       [message_id],
//       async (err) => {
//         if (err)
//           return res
//             .status(500)
//             .json({ success: false, message: "Database error" });

//         clients.forEach((client) => {
//           if (client.readyState === client.OPEN) {
//             client.send(
//               JSON.stringify({
//                 type: "delete_message",
//                 data: { message_id },
//               })
//             );
//           }
//         });

//         broadcastUnreadCounts(user_id_session);
//         broadcastUnreadCounts(message_data[0].MessageReceiverID);

//         res.json({ success: true });
//       }
//     );
//   }
// });

// app.listen(3000, () => {
//   console.log("Server running on port 3000");
// });
