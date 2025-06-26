import React, { useState, useEffect, useRef } from "react";
import { FaUpload, FaTimes } from "react-icons/fa";

const UserModal = ({ user, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    fatherName: "",
    nationalId: "",
    idNumber: "",
    mobileNumber: "",
    workPhone: "",
    job: "",
    workPlace: "",
    accessLevel: "سازمان اداری و استخدامی",
    image: null,
  });

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        fatherName: user.fatherName || "",
        nationalId: user.nationalId || "",
        idNumber: user.idNumber || "",
        mobileNumber: user.mobileNumber || "",
        workPhone: user.workPhone || "",
        job: user.job || "",
        workPlace: user.workPlace || "",
        accessLevel: user.accessLevel || "سازمان اداری و استخدامی",
        image: user.image || null,
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({ ...prev, image: null }));
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // ریست کردن ورودی فایل
    }
  };

  const handleSubmit = () => {
    const newUser = {
      ...formData,
      nationalId: formData.nationalId || Date.now().toString(), // برای جلوگیری از تکرار
    };
    onSave(newUser);
  };

  const accessLevels = [
    "سازمان اداری و استخدامی",
    "وزارت نیرو",
    "دستگاه تابعه",
    "مجری آزمون",
    "مجری ارزیابی",
    "طراح سوال",
    "ارزیاب",
    "ادمین",
  ];

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{user ? "ویرایش کاربر" : "افزودن کاربر"}</h2>
        <div className="modal-form">
          <div className="modal-form__group">
            <label>نام</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
            />
          </div>
          <div className="modal-form__group">
            <label>نام خانوادگی</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
            />
          </div>
          <div className="modal-form__group">
            <label>نام پدر</label>
            <input
              type="text"
              name="fatherName"
              value={formData.fatherName}
              onChange={handleChange}
            />
          </div>
          <div className="modal-form__group">
            <label>کد ملی</label>
            <input
              type="text"
              name="nationalId"
              value={formData.nationalId}
              onChange={handleChange}
            />
          </div>
          <div className="modal-form__group">
            <label>شماره شناسنامه</label>
            <input
              type="text"
              name="idNumber"
              value={formData.idNumber}
              onChange={handleChange}
            />
          </div>
          <div className="modal-form__group">
            <label>شماره همراه</label>
            <input
              type="text"
              name="mobileNumber"
              value={formData.mobileNumber}
              onChange={handleChange}
            />
          </div>
          <div className="modal-form__group">
            <label>شماره تلفن محل کار</label>
            <input
              type="text"
              name="workPhone"
              value={formData.workPhone}
              onChange={handleChange}
            />
          </div>
          <div className="modal-form__group">
            <label>شغل</label>
            <input
              type="text"
              name="job"
              value={formData.job}
              onChange={handleChange}
            />
          </div>
          <div className="modal-form__group">
            <label>محل خدمت</label>
            <input
              type="text"
              name="workPlace"
              value={formData.workPlace}
              onChange={handleChange}
            />
          </div>
          <div className="modal-form__group">
            <label>سطح دسترسی</label>
            <select
              name="accessLevel"
              value={formData.accessLevel}
              onChange={handleChange}
            >
              {accessLevels.map((level, index) => (
                <option key={index} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </div>
          <div className="modal-form__group">
            <label>آپلود عکس (اختیاری)</label>
            <div className="image-upload-container">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                ref={fileInputRef}
                style={{ display: "none" }}
                id="image-upload"
              />
              <label htmlFor="image-upload" className="image-upload-button">
                <FaUpload /> انتخاب تصویر
              </label>
              {formData.image && (
                <div className="image-preview">
                  <img src={formData.image} alt="پیش‌نمایش" />
                  <button
                    className="image-remove-button"
                    onClick={handleRemoveImage}
                  >
                    <FaTimes />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="modal-buttons">
          <button className="modal-save-btn" onClick={handleSubmit}>
            {user ? "ذخیره تغییرات" : "افزودن"}
          </button>
          <button className="modal-cancel-btn" onClick={onClose}>
            لغو
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserModal;
