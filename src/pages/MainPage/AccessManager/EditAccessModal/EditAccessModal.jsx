import React, { useState, useEffect } from "react";
import "./EditAccessModal.scss";

const subMenus = [
  "ثبت شرایط و تعریف شغل محل‌ها",
  "مدیریت مجوزها",
  "مدیریت آزمون",
  "تخصیص مجوز به آزمون",
  "نتایج آزمون",
  "لیست نفرات",
  "مدیریت حوزه‌های آزمون",
  "طراح سوال",
  "عوامل اجرایی مجری",
  "تولید دفترچه آزمون",
  "قرنطینه سوال",
  "حوزه آزمون",
  "لیست نفرات ارزیابی تکمیلی",
  "سازماندهی ارزیابی",
  "مواد ارزیابی تکمیلی",
  "مستندات ارزیابی تکمیلی",
  "نتایج ارزیابی تکمیلی",
  "لیست نفرات گزینش",
  "سازماندهی گزینش",
  "نتایج گزینش",
  "بررسی نشده",
  "تأیید شده",
  "رد شده",
  "دارای نواقص",
  "دریافتی جدید",
  "نیاز به حضور",
  "تأیید نهایی",
  "بایگانی",
  "تعیین مجری",
  "معرفی آزمون",
];

const EditAccessModal = ({ isOpen, onClose, access, mode }) => {
  const [formData, setFormData] = useState({
    name: "",
    permissions: subMenus.reduce(
      (acc, subMenu) => ({
        ...acc,
        [subMenu]: { view: false, edit: false, add: false },
      }),
      {}
    ),
  });

  useEffect(() => {
    if (mode === "edit" && access) {
      // فرض می‌کنیم داده‌های دسترسی از جایی (مثل accessRules) لود می‌شوند
      setFormData({
        name: access.name,
        permissions: subMenus.reduce(
          (acc, subMenu) => ({
            ...acc,
            [subMenu]: {
              view: false, // باید از accessRules پر شود
              edit: false,
              add: false,
            },
          }),
          {}
        ),
      });
    }
  }, [access, mode]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePermissionChange = (subMenu, permission) => {
    setFormData((prev) => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [subMenu]: {
          ...prev.permissions[subMenu],
          [permission]: !prev.permissions[subMenu][permission],
        },
      },
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // اینجا باید منطق ذخیره‌سازی اجرا شود (مثلاً به‌روزرسانی accessRules)
    console.log("فرم ارسال شد:", formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="edit-access-modal-overlay">
      <div className="edit-access-modal-content">
        <h2>
          {mode === "add"
            ? "افزودن دسترسی جدید"
            : `ویرایش دسترسی: ${access?.name}`}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">عنوان دسترسی</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="permissions-table">
            <table>
              <thead>
                <tr>
                  <th>زیرمنو</th>
                  <th>مشاهده</th>
                  <th>ویرایش</th>
                  <th>افزودن</th>
                </tr>
              </thead>
              <tbody>
                {subMenus.map((subMenu) => (
                  <tr key={subMenu}>
                    <td>{subMenu}</td>
                    <td>
                      <input
                        type="checkbox"
                        checked={formData.permissions[subMenu].view}
                        onChange={() => handlePermissionChange(subMenu, "view")}
                      />
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        checked={formData.permissions[subMenu].edit}
                        onChange={() => handlePermissionChange(subMenu, "edit")}
                      />
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        checked={formData.permissions[subMenu].add}
                        onChange={() => handlePermissionChange(subMenu, "add")}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="form-actions">
            <button type="submit" className="submit-button">
              {mode === "add" ? "افزودن" : "ذخیره"}
            </button>
            <button
              type="button"
              className="edit-access-modal-close"
              onClick={onClose}
            >
              بستن
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditAccessModal;
