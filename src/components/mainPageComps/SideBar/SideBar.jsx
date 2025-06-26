import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Tooltip } from "react-tooltip";
import "./SideBar.scss";
import { FaArrowRight } from "react-icons/fa";
import { IoIosArrowBack } from "react-icons/io";
import { menuItems } from "./menuConfig.js/menuConfig";
import { format } from "date-fns-jalali";
import { toPersianDigits } from "../HomeComps/Dashboard/utils.js";
import { faIR } from "date-fns-jalali/locale";
import { useAuth } from "../../../AuthContext.js";

// تعریف قوانین دسترسی برای هر نقش
const accessRules = {
  1: [
    "خانه",
    "دسترسی سریع",
    "اطلاعات پایه",
    "مجوز استخدام",
    "آزمون‌های استخدامی",
    "سازماندهی آزمون",
    "بررسی مدارک",
    "ارزیابی تکمیلی",
    "گزینش",
  ], // رئیس سازمان و مدیر سیستم: دسترسی کامل
  2: [
    "خانه",
    "دسترسی سریع",
    "اطلاعات پایه",
    "مجوز استخدام",
    "آزمون‌های استخدامی",
    "سازماندهی آزمون",
    "بررسی مدارک",
    "ارزیابی تکمیلی",
    "گزینش",
  ], // کاربر سازمان: دسترسی کامل
  3: [
    "خانه",
    "دسترسی سریع",
    "مجوز استخدام",
    "آزمون‌های استخدامی",
    "بررسی مدارک",
    "ارزیابی تکمیلی",
    "گزینش",
  ], // دستگاه ستادی
  4: [
    "خانه",
    "دسترسی سریع",
    "مجوز استخدام",
    "آزمون‌های استخدامی",
    
    "ارزیابی تکمیلی",
    "گزینش",
  ], // دستگاه تابعه
  5: ["خانه", "دسترسی سریع", "آزمون‌های استخدامی", "سازماندهی آزمون"], // مجری آزمون کتبی
  6: ["خانه", "دسترسی سریع", "ارزیابی تکمیلی"], // کانون ارزیابی
  7: ["خانه", "دسترسی سریع"], // ارزیاب: بدون دسترسی به منو
};

// تابع برای فیلتر کردن منوها بر اساس نقش کاربر
const getAccessibleMenuItems = (roleId, menuItems) => {
  const allowedTitles = accessRules[roleId] || [];
  return menuItems.filter((item) => allowedTitles.includes(item.title));
};

const SideBar = ({
  setSelectedTitle,
  setSelectedChild,
  activeItem,
  setActiveItem,
  activeChild,
  setActiveChild,
  resetToHome,
  resetToTitle,
}) => {
  // استفاده از useAuth برای گرفتن اطلاعات کاربر
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [openIndexes, setOpenIndexes] = useState([]);
  const [notificationModalOpen, setNotificationModalOpen] = useState(false);
  const [notificationEvents, setNotificationEvents] = useState([]);
  const [notificationTitle, setNotificationTitle] = useState("");

  const todayStr = format(new Date(), "yyyy/MM/dd", { locale: faIR });
  const events = JSON.parse(localStorage.getItem("events") || "[]");

  // فیلتر کردن منوها بر اساس نقش کاربر
  const accessibleMenuItems = getAccessibleMenuItems(user?.roleId, menuItems);

  const toggleDropdown = (index) => {
    setOpenIndexes((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const handleTitleClick = (item, index) => {
    if (item.title === "خانه") {
      resetToHome();
      window.location.hash = "";
    } else {
      setSelectedTitle(item);
      setSelectedChild(null);
      setActiveItem(index);
      setActiveChild(null);
      window.location.hash = item.title
        .trim()
        .replaceAll(" ", "_")
        .replace(/\u200C/g, "");
    }
  };

  const handleChildClick = (child) => {
    const childTitle = typeof child === "string" ? child : child.title;
    setSelectedChild(childTitle);
    setActiveChild(childTitle);
    window.location.hash = childTitle
      .trim()
      .replaceAll(" ", "_")
      .replace(/\u200C/g, "");
  };

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
    if (isSidebarOpen) {
      setOpenIndexes([]);
    }
  };

  const getNotificationCount = (title, isSubMenu = false) => {
    return events.filter(
      (event) =>
        event.date === todayStr &&
        (isSubMenu ? event.subMenu === title : event.menuItem === title)
    ).length;
  };

  const openNotificationModal = (title, isSubMenu = false) => {
    const filteredEvents = events.filter(
      (event) =>
        event.date === todayStr &&
        (isSubMenu ? event.subMenu === title : event.menuItem === title)
    );
    setNotificationEvents(filteredEvents);
    setNotificationTitle(title);
    setNotificationModalOpen(true);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      const sidebarElement = document.querySelector(".sidebar");
      if (sidebarElement && !sidebarElement.contains(event.target)) {
        setIsSidebarOpen(false);
        setOpenIndexes([]);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <>
      <motion.aside
        className="sidebar"
        initial={{ width: "fit-content" }}
        animate={{ width: isSidebarOpen ? "20%" : "5%" }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        onClick={(e) => e.stopPropagation()}
      >
        <ul className="sidebar__list">
          <li className="sidebar__item">
            <div className="sidebar__main-item-wrapper">
              <div className="sidebar__icon-wrapper" onClick={toggleSidebar}>
                <motion.div
                  className="sidebar__icon sidebar__toggle-btn"
                  animate={{ rotate: isSidebarOpen ? 0 : 180 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  data-tooltip-id="toggle-tooltip"
                  data-tooltip-content={
                    isSidebarOpen
                      ? "بستن دسته‌بندی‌ها"
                      : "باز کردن دسته‌بندی‌ها"
                  }
                  data-tooltip-place="left"
                  data-tooltip-offset={10}
                >
                  <FaArrowRight />
                </motion.div>
                {!isSidebarOpen && (
                  <Tooltip
                    id="toggle-tooltip"
                    className="sidebar__tooltip"
                    effect="solid"
                  />
                )}
              </div>
            </div>
          </li>

          {/* استفاده از accessibleMenuItems به جای menuItems برای رندر منوهای مجاز */}
          {accessibleMenuItems.map((item, index) => {
            const isOpen = openIndexes.includes(index);
            const isActive = activeItem === index;
            const children = Array.isArray(item.children) ? item.children : [];
            const notificationCount = getNotificationCount(item.title);

            return (
              <li key={index} className="sidebar__item">
                <div className="sidebar__main-item-wrapper">
                  <div
                    className={`sidebar__icon-wrapper ${
                      isActive ? "active" : ""
                    }`}
                    onClick={() => {
                      handleTitleClick(item, index);
                      if (isSidebarOpen) {
                        toggleDropdown(index);
                      }
                    }}
                  >
                    <div
                      className="sidebar__icon"
                      data-tooltip-id={`tooltip-${index}`}
                      data-tooltip-content={item.title}
                      data-tooltip-place="left"
                      data-tooltip-offset={10}
                    >
                      {item.icon}
                    </div>
                    {/* {!isSidebarOpen && notificationCount > 0 && (
                      <span
                        className="sidebar-notification"
                        onClick={(e) => {
                          e.stopPropagation();
                          openNotificationModal(item.title);
                        }}
                      >
                        {notificationCount}
                      </span>
                    )} */}
                    {!isSidebarOpen && (
                      <Tooltip
                        id={`tooltip-${index}`}
                        className="sidebar__tooltip"
                        effect="solid"
                      />
                    )}
                  </div>

                  {isSidebarOpen && (
                    <motion.div
                      className={`sidebar__main-item ${
                        isActive ? "active" : ""
                      }`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      onClick={() => {
                        toggleDropdown(index);
                        handleTitleClick(item, index);
                      }}
                    >
                      <span>{item.title}</span>
                      {/* {notificationCount > 0 && (
                        <span
                          className="sidebar-notification"
                          onClick={(e) => {
                            e.stopPropagation();
                            openNotificationModal(item.title);
                          }}
                        >
                          {notificationCount}
                        </span>
                      )} */}
                      {children.length > 0 && (
                        <motion.span
                          animate={{ rotate: isOpen ? 180 : 0 }}
                          transition={{ duration: 0.3 }}
                          className="sidebar__arrow"
                        >
                          ▼
                        </motion.span>
                      )}
                    </motion.div>
                  )}

                  {!isSidebarOpen && children.length > 0 && (
                    <div
                      className="sidebar__expand-btn"
                      onClick={() => {
                        setIsSidebarOpen(true);
                        toggleDropdown(index);
                        handleTitleClick(item, index);
                      }}
                    >
                      <IoIosArrowBack />
                    </div>
                  )}
                </div>

                <AnimatePresence initial={false}>
                  {isSidebarOpen && isOpen && children.length > 0 && (
                    <motion.ul
                      className="sidebar__submenu"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.45, ease: "easeInOut" }}
                    >
                      {children.map((child, i) => {
                        const childTitle =
                          typeof child === "string" ? child : child.title;
                        const isChildActive = activeChild === childTitle;
                        const childNotificationCount = getNotificationCount(
                          childTitle,
                          true
                        );

                        return (
                          <li
                            key={i}
                            className={`sidebar__submenu-item ${
                              isChildActive ? "active" : ""
                            }`}
                            onClick={() => handleChildClick(child)}
                          >
                            {childTitle}
                            {/* {childNotificationCount > 0 && (
                              <span
                                className="sidebar-notification"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openNotificationModal(childTitle, true);
                                }}
                              >
                                {childNotificationCount}
                              </span>
                            )} */}
                          </li>
                        );
                      })}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>
      </motion.aside>

      {notificationModalOpen && (
        <div className="sidebar-modal-overlay">
          <div className="sidebar-modal">
            <h3>رویدادهای {notificationTitle}</h3>
            <div className="sidebar-event-list">
              {notificationEvents.length > 0 ? (
                notificationEvents.map((event) => (
                  <div key={event.id} className="sidebar-event-item">
                    <span>{event.title}</span>
                    <span className="sidebar-event-date">
                      {toPersianDigits(event.date)}
                    </span>
                  </div>
                ))
              ) : (
                <p>رویدادی برای این بخش وجود ندارد</p>
              )}
            </div>
            <div className="sidebar-modal-buttons">
              <button onClick={() => setNotificationModalOpen(false)}>
                بستن
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SideBar;
