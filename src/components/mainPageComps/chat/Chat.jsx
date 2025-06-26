import React, { useState, useEffect, useRef } from "react";
import users from "../../../pages/MainPage/LogIn/fakeUsers";
import rolesData from "../../../pages/MainPage/LogIn/roles.json";
import { toPersianDate, convertToPersianDigits } from "./utils";
import {
  FaPaperclip,
  FaTimes,
  FaArrowDown,
  FaEdit,
  FaTrash,
} from "react-icons/fa";
import "./chat.css";
import { useAuth } from "../../../AuthContext";

function Chat() {
  const { user } = useAuth();
  const [roles, setRoles] = useState([]);
  const [chatUsers, setChatUsers] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState({});
  const [newMessage, setNewMessage] = useState("");
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const [isUserScrolledUp, setIsUserScrolledUp] = useState(false);
  const [showNewMessageAlert, setShowNewMessageAlert] = useState(false);
  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
    message: null,
  });
  const [editingMessage, setEditingMessage] = useState(null);
  const messagesEndRef = useRef(null);
  const messagesRef = useRef(null);
  const contextMenuRef = useRef(null);

  // مدیریت پیام‌های خطا/موفقیت با تایمر
  const setTemporaryError = (message) => {
    setError(message);
    setTimeout(() => setError(null), 3000);
  };

  // اسکرول به پایین پیام‌ها
  const scrollToBottom = () => {
    setTimeout(() => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        setShowNewMessageAlert(false);
        setIsUserScrolledUp(false);
      }
    }, 100);
  };

  // مدیریت اسکرول برای تشخیص بالا بودن کاربر
  const handleScroll = () => {
    const messagesContainer = messagesRef.current;
    if (messagesContainer) {
      const isAtBottom =
        messagesContainer.scrollTop + messagesContainer.clientHeight >=
        messagesContainer.scrollHeight - 50;
      setIsUserScrolledUp(!isAtBottom);
    }
  };

  // تعریف تابع checkAccess
  const checkAccess = (senderRole, receiverRole) => {
    switch (senderRole) {
      case "1": // ادمین
      case "2": // سازمان
        return true;
      case "3": // دستگاه ستادی
      case "4": // دستگاه تابعه
        return ["1", "2", "6"].includes(receiverRole);
      case "5": // مجری آزمون کتبی
        return ["1", "2"].includes(receiverRole);
      case "6": // مجری ارزیابی تکمیلی
        return ["1", "2", "3", "4"].includes(receiverRole);
      default:
        return false;
    }
  };

  // بارگذاری نقش‌ها و کاربران
  useEffect(() => {
    // بارگذاری نقش‌ها و فیلتر بر اساس دسترسی‌ها
    const formattedRoles = rolesData
      .find((item) => item.type === "table" && item.name === "roles")
      .data.filter((role) => role.RoleID !== "7")
      .filter((role) =>
        users.some(
          (u) =>
            u.UserRole === role.RoleID &&
            u.UserID !== user?.UserID &&
            checkAccess(user?.UserRole, u.UserRole)
        )
      )
      .map((role) => ({
        RoleID: role.RoleID,
        RoleName: role.RoleName,
      }));
    setRoles(formattedRoles);

    // بارگذاری کاربران با اعمال منطق دسترسی
    const formattedUsers = users
      .map((u) => ({
        ...u,
        UserFirstName: u.firstName,
        UserLastName: u.lastName,
        UserImage: u.UserImage || "default.png",
      }))
      .filter(
        (u) =>
          u.UserID !== user?.UserID &&
          u.UserRole !== "7" &&
          checkAccess(user?.UserRole, u.UserRole)
      );
    setChatUsers(formattedUsers);
  }, [user]);

  // انتخاب نقش
  const handleRoleClick = (role) => {
    setSelectedRole(role.RoleID);
    setSelectedUser(null);
    setChatUsers(
      users
        .map((u) => ({
          ...u,
          UserFirstName: u.firstName,
          UserLastName: u.lastName,
          UserImage: u.UserImage || "default.png",
        }))
        .filter(
          (u) =>
            u.UserRole === role.RoleID &&
            u.UserID !== user?.UserID &&
            checkAccess(user?.UserRole, u.UserRole)
        )
    );
  };

  // انتخاب کاربر و بارگذاری پیام‌ها
  const handleUserClick = (chatUser) => {
    setSelectedUser(chatUser);
    setMessages((prev) => ({ ...prev, [chatUser.UserID]: [] }));
    setShowNewMessageAlert(false);
    setContextMenu({ visible: false, x: 0, y: 0, message: null });

    // بارگذاری پیام‌ها از localStorage
    const storedMessages = JSON.parse(localStorage.getItem("messages")) || {};
    const userMessages = storedMessages[chatUser.UserID] || [];
    setMessages((prev) => ({
      ...prev,
      [chatUser.UserID]: userMessages,
    }));
    setTimeout(() => scrollToBottom(), 200);
  };

  // مدیریت منوی راست‌کلیک
  const handleContextMenu = (e, message) => {
    e.preventDefault();
    setContextMenu({
      visible: true,
      x: e.pageX,
      y: e.pageY,
      message,
    });
  };

  // کپی پیام
  const handleCopyMessage = (text) => {
    navigator.clipboard.writeText(text);
    setContextMenu({ visible: false, x: 0, y: 0, message: null });
  };

  // ویرایش پیام
  const handleEditMessage = (message) => {
    setEditingMessage(message);
    setNewMessage(message.MessageText);
    setContextMenu({ visible: false, x: 0, y: 0, message: null });
  };

  // حذف پیام
  const handleDeleteMessage = (messageId) => {
    const storedMessages = JSON.parse(localStorage.getItem("messages")) || {};
    const userMessages = storedMessages[selectedUser.UserID] || [];
    const updatedMessages = userMessages.filter(
      (msg) => msg.MessageID !== messageId
    );

    storedMessages[selectedUser.UserID] = updatedMessages;
    localStorage.setItem("messages", JSON.stringify(storedMessages));

    setMessages((prev) => ({
      ...prev,
      [selectedUser.UserID]: updatedMessages,
    }));
    setTemporaryError("پیام با موفقیت حذف شد");
    setContextMenu({ visible: false, x: 0, y: 0, message: null });
  };

  // ارسال یا ویرایش پیام
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() && !file) return;
    if (!selectedUser) {
      setTemporaryError("لطفاً یک کاربر انتخاب کنید.");
      return;
    }
    if (!checkAccess(user?.UserRole, selectedUser.UserRole)) {
      setTemporaryError("شما اجازه ارسال پیام به این کاربر را ندارید.");
      return;
    }

    let updatedMessages;
    const storedMessages = JSON.parse(localStorage.getItem("messages")) || {};
    const userMessages = storedMessages[selectedUser.UserID] || [];

    if (editingMessage) {
      updatedMessages = userMessages.map((msg) =>
        msg.MessageID === editingMessage.MessageID
          ? { ...msg, MessageText: newMessage, MessageIsEdited: true }
          : msg
      );
      setTemporaryError("پیام ویرایش شد");
    } else {
      const newMessageObj = {
        MessageID: Date.now().toString(),
        MessageSenderID: user.UserID,
        MessageText: newMessage,
        MessageTimestamp: new Date().toISOString(),
        FilePath: file ? `/files/${file.name}` : null,
        FileName: file ? file.name : null,
        MessageIsEdited: false,
      };
      updatedMessages = [...userMessages, newMessageObj];
      setTemporaryError("پیام ارسال شد");
    }

    storedMessages[selectedUser.UserID] = updatedMessages;
    localStorage.setItem("messages", JSON.stringify(storedMessages));

    setMessages((prev) => ({
      ...prev,
      [selectedUser.UserID]: updatedMessages,
    }));
    setNewMessage("");
    setFile(null);
    setEditingMessage(null);
    if (!isUserScrolledUp) {
      scrollToBottom();
    }
  };

  // مدیریت آپلود فایل
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  // رندر محتوای پیام
  const renderMessageContent = (message) => {
    const isImage =
      message.FilePath && /\.(jpeg|jpg|gif|png)$/i.test(message.FilePath);

    return (
      <div className="message-content">
        {message.MessageText && (
          <div className="message-text">
            {convertToPersianDigits(message.MessageText)}
          </div>
        )}
        {message.FilePath && (
          <div className="file-message">
            {isImage ? (
              <a
                href={message.FilePath}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src={message.FilePath}
                  alt={message.FileName || "attachment"}
                  className="max-w-[200px]"
                />
              </a>
            ) : (
              <a
                href={message.FilePath}
                target="_blank"
                rel="noopener noreferrer"
                download
              >
                {message.FileName ? message.FileName : "فایل بدون نام"}
              </a>
            )}
          </div>
        )}
        <div className="message-meta">
          <span className="message-time-inline">
            {toPersianDate(message.MessageTimestamp)}
          </span>
          {message.MessageIsEdited && (
            <span className="edited-label"> (ویرایش شده)</span>
          )}
        </div>
      </div>
    );
  };

  // اگر کاربر نقش 7 (ارزیاب) دارد، چیزی رندر نشود
  if (user?.UserRole === "7") {
    return null;
  }

  return (
    <div className="chat-box-container">
      {error && (
        <div
          className={`notification ${
            error.includes("موفقیت") ||
            error.includes("ویرایش") ||
            error.includes("ارسال")
              ? "success"
              : "error"
          }`}
        >
          {error}
        </div>
      )}
      <div className="chat-container">
        <div id="role-list" className="role-list">
          {roles.length === 0 ? (
            <p>هیچ نقشی برای نمایش وجود ندارد</p>
          ) : (
            <ul className="list-unstyled role-listUl mt-2 mb-0">
              {roles.map((role) => (
                <li
                  key={role.RoleID}
                  className={`role-item ${
                    selectedRole === role.RoleID ? "selected" : ""
                  }`}
                  onClick={() => handleRoleClick(role)}
                >
                  {role.RoleName}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="chat-app">
          <div id="plist" className="people-list">
            <ul className="list-unstyled chat-list mt-2 mb-0">
              {chatUsers.map((chatUser) => (
                <li
                  key={chatUser.UserID}
                  className={`user clearFlex ${
                    selectedUser?.UserID === chatUser.UserID ? "selected" : ""
                  } ${chatUser.UserIsOnline === "Y" ? "" : "offline-user"}`}
                  onClick={() => handleUserClick(chatUser)}
                >
                  <div className="avatar-wrapper">
                    <img
                      src={`/assets/avatar/${
                        chatUser.UserImage || "default.png"
                      }`}
                      alt="avatar"
                    />
                    <span
                      className={`status ${
                        chatUser.UserIsOnline === "Y" ? "online" : "offline"
                      }`}
                    ></span>
                  </div>
                  <div className="about">
                    <div className="name">
                      {chatUser.UserRole === "1"
                        ? `پشتیبان ${
                            chatUser.UserAdminNumber || chatUser.UserID
                          }`
                        : chatUser.UserFirstName || chatUser.UserLastName
                        ? `${chatUser.UserFirstName} ${chatUser.UserLastName}`.trim()
                        : chatUser.username || "کاربر ناشناس"}
                    </div>
                    <div className="post">{chatUser.role}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          {selectedUser ? (
            <div className="chat">
              <div
                className={`chat-header ${
                  selectedUser.UserIsOnline === "Y" ? "" : "offline-user"
                }`}
              >
                <div className="avatar-wrapper">
                  <img
                    src={`/assets/avatar/${
                      selectedUser.UserImage || "default.png"
                    }`}
                    alt="avatar"
                  />
                  <span
                    className={`status ${
                      selectedUser.UserIsOnline === "Y" ? "online" : "offline"
                    }`}
                  ></span>
                </div>
                <div className="chat-about">
                  <div className="chat-with">
                    {selectedUser.UserRole === "1"
                      ? `پشتیبان ${
                          selectedUser.UserAdminNumber || selectedUser.UserID
                        }`
                      : selectedUser.UserFirstName || selectedUser.UserLastName
                      ? `${selectedUser.UserFirstName} ${selectedUser.UserLastName}`.trim()
                      : selectedUser.username || "کاربر ناشناس"}
                  </div>
                  <div className="post">{selectedUser.role}</div>
                </div>
              </div>
              <div
                className="chat-history messages"
                ref={messagesRef}
                onScroll={handleScroll}
              >
                <ul className="m-b-0">
                  {(messages[selectedUser.UserID] || []).map((message) => (
                    <li
                      key={message.MessageID}
                      className="clearfix"
                      data-message-id={message.MessageID}
                      data-user-id={message.MessageSenderID}
                      onContextMenu={(e) => handleContextMenu(e, message)}
                    >
                      <div
                        className={`message ${
                          message.MessageSenderID === user?.UserID
                            ? "my-message"
                            : "other-message"
                        }`}
                      >
                        {renderMessageContent(message)}
                      </div>
                    </li>
                  ))}
                </ul>
                <div ref={messagesEndRef} />
              </div>
              {showNewMessageAlert && (
                <div className="new-message-alert" onClick={scrollToBottom}>
                  پیام جدید
                  <FaArrowDown />
                </div>
              )}
              <form
                className="chat-message message-input"
                onSubmit={handleSendMessage}
              >
                <div className="message-input-container">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder={
                      editingMessage
                        ? "ویرایش پیام..."
                        : "پیام خود را بنویسید..."
                    }
                  />
                  <label htmlFor="file-upload" className="file-label">
                    <FaPaperclip />
                  </label>
                  <input
                    id="file-upload"
                    type="file"
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                  />
                  {file && (
                    <div className="file-info">
                      <span className="file-name">{file.name}</span>
                      <button
                        type="button"
                        className="remove-file-btn"
                        onClick={() => setFile(null)}
                      >
                        <FaTimes />
                      </button>
                    </div>
                  )}
                </div>
                <button type="submit">
                  {editingMessage ? "ویرایش" : "ارسال"}
                </button>
              </form>
            </div>
          ) : (
            <div className="chat">کاربری انتخاب نشده است</div>
          )}
        </div>
      </div>
      {contextMenu.visible && contextMenu.message && (
        <div
          className="context-menu"
          style={{ top: contextMenu.y, left: contextMenu.x }}
          ref={contextMenuRef}
        >
          <ul>
            <li
              onClick={() => handleCopyMessage(contextMenu.message.MessageText)}
            >
              کپی پیام
            </li>
            {user?.UserRole === "1" && (
              <>
                <li onClick={() => handleEditMessage(contextMenu.message)}>
                  ویرایش پیام
                </li>
                <li
                  onClick={() =>
                    handleDeleteMessage(contextMenu.message.MessageID)
                  }
                >
                  حذف پیام
                </li>
              </>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Chat;
