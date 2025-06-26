import React from "react";
import "./SubOrgFormModal.scss";

const SubOrgFormModal = ({
  isOpen,
  onClose,
  formData,
  formMode,
  onSubmit,
  onChange,
  rootDevices,
}) => {
  if (!isOpen) return null;

  return (
    <div className="sub-org-form-modal-overlay">
      <div className="sub-org-form-modal">
        <div className="sub-org-form-modal-content">
          <h3>
            {formMode === "add" ? "افزودن دستگاه تابعه" : "ویرایش دستگاه تابعه"}
          </h3>
          <form onSubmit={onSubmit}>
            <div className="sub-org-form-modal-group">
              <label>نام دستگاه</label>
              <input
                type="text"
                name="name"
                value={formData.name || ""}
                onChange={onChange}
                required
              />
            </div>
            <div className="sub-org-form-modal-group">
              <label>دستگاه والد</label>
              <select
                name="parent"
                value={formData.parent || ""}
                onChange={onChange}
                required
              >
                <option value="">انتخاب دستگاه والد</option>
                {rootDevices.map((device) => (
                  <option key={device.id} value={device.id}>
                    {device.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="sub-org-form-modal-actions">
              <button type="submit">ثبت</button>
              <button type="button" onClick={onClose}>
                لغو
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SubOrgFormModal;
