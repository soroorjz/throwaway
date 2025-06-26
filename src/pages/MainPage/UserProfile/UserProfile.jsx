import React, { useState } from "react";
import "./UserProfile.scss";
import { IoMdHome } from "react-icons/io";
import { FaUpload } from "react-icons/fa6";
import { MdOutlineEdit } from "react-icons/md";
import { FaTimes } from "react-icons/fa";
import Header from "../../../components/mainPageComps/Header/Header";
import { Link } from "react-router-dom";

const UserProfile = () => {
  const [userData, setUserData] = useState({
    firstName: "علی",
    lastName: "محمدی",
    fatherName: "حسین",
    nationalId: "۱۲۳۴۵۶۷۸۹۰",
    idNumber: "۴۵۶۷۸۹",
    mobile: "۰۹۱۲۳۴۵۶۷۸۹",
    workPhone: "۰۲۱۱۲۳۴۵۶۷۸",
    job: "مدیر امور جذب و استخدام",
    workplace: "ساختمان مرکزی",
    username: "ali.mohammadi",
    password: "********",
    accessLevel: "سازمان اداری و استخدامی",
    profileImage: "/assets/images/sazman.png",
  });

  const [editField, setEditField] = useState(null);

  // const accessLevels = [
  //   "سازمان اداری و استخدامی",
  //   "وزارت نیرو",
  //   "دستگاه تابعه",
  //   "مجری آزمون",
  //   "مجری ارزیابی",
  //   "طراح سوال",
  //   "ارزیاب",
  //   "ادمین",
  // ];

  const handleEdit = (field) => {
    setEditField(field);
  };

  const handleChange = (e, field) => {
    setUserData({ ...userData, [field]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setUserData({ ...userData, profileImage: imageUrl });
    }
  };

  const handleImageRemove = () => {
    setUserData({ ...userData, profileImage: null });
  };

  const handleSave = () => {
    setEditField(null);
  };

  const renderField = (field, label) => {
    if (field === "profileImage") {
      if (editField === field) {
        return (
          <div className="user-profile__field-input user-profile__image-input">
            <label className="user-profile__image-label">
              <FaUpload className="user-profile__upload-icon" />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="user-profile__image-upload"
              />
            </label>
            {userData.profileImage && (
              <div className="user-profile__image-preview">
                <img src={userData.profileImage} alt="پیش‌نمایش" />
                <FaTimes
                  className="user-profile__image-remove"
                  onClick={handleImageRemove}
                />
              </div>
            )}
            <button onClick={handleSave} className="user-profile__save-btn">
              ذخیره
            </button>
          </div>
        );
      }
      return (
        <div className="user-profile__field-display user-profile__image-display">
          {userData.profileImage ? (
            <img
              src={userData.profileImage}
              alt="تصویر کاربر"
              className="user-profile__image"
            />
          ) : (
            <div className="user-profile__image-placeholder">بدون تصویر</div>
          )}
          <MdOutlineEdit
            className="user-profile__edit-icon"
            onClick={() => handleEdit(field)}
          />
        </div>
      );
    }
    if (field === "accessLevel") {
      return (
        <div className="user-profile__field-display">
          <span>{userData[field]}</span>
        </div>
      );
    }
    if (editField === field) {
      // if (field === "accessLevel") {
      //   return (
      //     <div className="user-profile__field-input">
      //       <select
      //         value={userData[field]}
      //         onChange={(e) => handleChange(e, field)}
      //         className="user-profile__select"
      //       >
      //         {accessLevels.map((level) => (
      //           <option key={level} value={level}>
      //             {level}
      //           </option>
      //         ))}
      //       </select>
      //       <button onClick={handleSave} className="user-profile__save-btn">
      //         ذخیره
      //       </button>
      //     </div>
      //   );
      // }
      return (
        <div className="user-profile__field-input">
          <input
            type={field === "password" ? "password" : "text"}
            value={userData[field]}
            onChange={(e) => handleChange(e, field)}
            className="user-profile__input"
          />
          <button onClick={handleSave} className="user-profile__save-btn">
            ذخیره
          </button>
        </div>
      );
    }
    return (
      <div className="user-profile__field-display">
        <span>{userData[field]}</span>
        <MdOutlineEdit
          className="user-profile__edit-icon"
          onClick={() => handleEdit(field)}
        />
      </div>
    );
  };

  return (
    <>
      <Header />
      <div className="user-profile__page">
        <div className="user-profile__container">
          <h2 className="user-profile__title">حساب کاربری</h2>
          <div className="user-profile__fields">
            <div className="user-profile__field">
              <label className="user-profile__label">تصویر کاربر</label>
              {renderField("profileImage", "تصویر کاربر")}
            </div>
            <div className="user-profile__field">
              <label className="user-profile__label">نام</label>
              {renderField("firstName", "نام")}
            </div>
            <div className="user-profile__field">
              <label className="user-profile__label">نام خانوادگی</label>
              {renderField("lastName", "نام خانوادگی")}
            </div>
            <div className="user-profile__field">
              <label className="user-profile__label">نام پدر</label>
              {renderField("fatherName", "نام پدر")}
            </div>
            <div className="user-profile__field">
              <label className="user-profile__label">کد ملی</label>
              {renderField("nationalId", "کد ملی")}
            </div>
            <div className="user-profile__field">
              <label className="user-profile__label">شماره شناسنامه</label>
              {renderField("idNumber", "شماره شناسنامه")}
            </div>
            <div className="user-profile__field">
              <label className="user-profile__label">شماره همراه</label>
              {renderField("mobile", "شماره همراه")}
            </div>
            <div className="user-profile__field">
              <label className="user-profile__label">شماره تلفن محل کار</label>
              {renderField("workPhone", "شماره تلفن محل کار")}
            </div>
            <div className="user-profile__field">
              <label className="user-profile__label">شغل</label>
              {renderField("job", "شغل")}
            </div>
            <div className="user-profile__field">
              <label className="user-profile__label">محل خدمت</label>
              {renderField("workplace", "محل خدمت")}
            </div>
            <div className="user-profile__field">
              <label className="user-profile__label">نام کاربری</label>
              {renderField("username", "نام کاربری")}
            </div>
            <div className="user-profile__field">
              <label className="user-profile__label">رمز عبور</label>
              {renderField("password", "رمز عبور")}
            </div>
            <div className="user-profile__field">
              <label className="user-profile__label">سطح دسترسی</label>
              {renderField("accessLevel", "سطح دسترسی")}
            </div>
          </div>
        </div>
      </div>
      <Link to="/MainPage" className="homeBtn">
        <button className="homeBtn">
          <IoMdHome />
        </button>
      </Link>
    </>
  );
};

export default UserProfile;
