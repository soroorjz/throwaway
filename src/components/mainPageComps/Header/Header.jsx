import React, { useState, useRef, useEffect } from "react";
import { FaSearch, FaMicrophone, FaPlay } from "react-icons/fa";
import { Tooltip } from "react-tooltip";
import { Link, useNavigate } from "react-router-dom";
import "./Header.scss";
import { useAuth } from "../../../AuthContext";
import VoiceButton from "../../../scripts/functions";

const Header = () => {
  const { user } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Function to determine the avatar image based on user role
  const getAvatarImage = () => {
    switch (user?.role) {
      case "کاربر سازمان اداری و استخدامی":
        return "/assets/images/sazman.png";
      case "وزارت نیرو":
        return "/assets/images/niru.png";
      case "شركت تعاوني پژوهشگران رايانگان فرديس (مجری آزمون کتبی)":
      case "شركت تعاوني پژوهشگران رايانگان فرديس (مجری ارزیابی تکمیلی)":
        return "/assets/images/logo2.png";
      default:
        return "/assets/images/logo2.png"; // Fallback image
    }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    navigate("/");
    setIsDropdownOpen(false);
  };

  const handlePlayClick = () => {
    setIsVideoModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsVideoModalOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="dashboard-header">
      <div className="dashboard-header__left">
        <div className="dashboard-header__logo">
          <img
            src="/assets/images/logo2.png"
            alt="Logo"
            className="dashboard-header__avatar"
          />
        </div>
        <div className="dashboard-header__voiceSearch">
          <div className="dashboard-header__play">
            <FaPlay
              className="headerPlayIcon"
              onClick={handlePlayClick}
              data-tooltip-id="play-tooltip"
              data-tooltip-content="راهنمای سامانه"
            />
            <Tooltip
              id="play-tooltip"
              place="top"
              effect="solid"
              className="dashboard-header__tooltip"
            />
          </div>
          <div className="dashboard-header__voice">
            <FaMicrophone
              onClick={VoiceButton}
              data-tooltip-id="mic-tooltip"
              data-tooltip-content="دستیار صوتی"
            />
            <Tooltip
              id="mic-tooltip"
              place="top"
              effect="solid"
              className="dashboard-header__tooltip"
            />
          </div>
          <div className="dashboard-header__search">
            <FaSearch className="dashboard-header__search-icon" />
            <input
              type="text"
              placeholder="کلیدواژه موردنظر را جستجو کنید..."
              className="dashboard-header__search-input"
            />
          </div>
        </div>
      </div>

      <div className="dashboard-header__right">
        <div className="dashboard-header__user">
          <div className="dashboard-header__avatar-container" ref={dropdownRef}>
            <img
              src={getAvatarImage()}
              alt="User Avatar"
              className="dashboard-header__avatar"
              onClick={toggleDropdown}
            />
            {isDropdownOpen && (
              <div className="dashboard-header__dropdown">
                <button className="dashboard-header__dropdown-item">
                  اعلانات
                </button>
                <Link
                  to="/UserProfile"
                  className="dashboard-header__dropdown-item"
                >
                  حساب کاربری
                </Link>
                <button
                  className="dashboard-header__dropdown-item"
                  onClick={handleLogout}
                >
                  خروج
                </button>
              </div>
            )}
          </div>
          <div className="dashboard-header__user-name">
            <p className="dashboard-header__post">
              {user?.role || "سمت کاربر"}
            </p>
          </div>
        </div>
      </div>

      {isVideoModalOpen && (
        <div className="video-modal">
          <div className="video-modal__content">
            <button className="video-modal__close" onClick={handleCloseModal}>
              ×
            </button>
            <video controls className="video-modal__video">
              <source src="/assets/video/samaneh final.mp4" type="video/mp4" />
              مرورگر شما از پخش ویدیو پشتیبانی نمی‌کند.
            </video>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
