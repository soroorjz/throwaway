import React from "react";
import { motion } from "framer-motion";
import { FaUpload } from "react-icons/fa";

const EditDesignerModal = ({
  isOpen,
  onClose,
  formData,
  setFormData,
  onSubmit,
  provinces,
  statuses,
}) => {
  const handleFormChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFormChange("contractImage", file.name);
      handleFormChange("contractImageFile", file);
    } else {
      handleFormChange("contractImage", "");
      handleFormChange("contractImageFile", null);
    }
  };

  return (
    <motion.div
      className="modal-overlay assign-permit__modal"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="modal-content assign-permit__modal-content"
        initial={{ scale: 0.7, y: "-50%" }}
        animate={{ scale: 1, y: "0%" }}
        exit={{ scale: 0.7, y: "-50%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <h3>ویرایش طراح</h3>
        <form
          onSubmit={onSubmit}
          className="QuestionDesignerManagement-modal-form"
        >
          <div className="QuestionDesignerform-group">
            <label>نام</label>
            <input
              type="text"
              value={formData.firstName || ""}
              onChange={(e) => handleFormChange("firstName", e.target.value)}
              required
            />
          </div>
          <div className="QuestionDesignerform-group">
            <label>نام خانوادگی</label>
            <input
              type="text"
              value={formData.lastName || ""}
              onChange={(e) => handleFormChange("lastName", e.target.value)}
              required
            />
          </div>
          <div className="QuestionDesignerform-group">
            <label>شماره همراه</label>
            <input
              type="text"
              value={formData.mobileNumber || ""}
              onChange={(e) => handleFormChange("mobileNumber", e.target.value)}
              required
            />
          </div>
          <div className="QuestionDesignerform-group">
            <label>کد ملی</label>
            <input
              type="text"
              value={formData.nationalCode || ""}
              onChange={(e) => handleFormChange("nationalCode", e.target.value)}
              required
            />
          </div>
          <div className="QuestionDesignerform-group">
            <label>شماره شناسنامه</label>
            <input
              type="text"
              value={formData.idNumber || ""}
              onChange={(e) => handleFormChange("idNumber", e.target.value)}
              required
            />
          </div>
          <div className="QuestionDesignerform-group">
            <label>تصویر قرارداد</label>
            <div className="file-upload-wrapper">
              <input
                type="file"
                accept=".jpg,.jpeg,.png"
                onChange={handleFileChange}
                className="file-upload-input"
                placeholder="تصویر قرارداد را وارد کنید"
              />
              <span className="file-upload-label">
                {formData.contractImage || "فایلی انتخاب نشده"}
              </span>
              <FaUpload className="file-upload-icon" />
            </div>
          </div>
          <div className="QuestionDesignerform-group">
            <label>مبلغ قرارداد (تومان)</label>
            <input
              type="number"
              value={formData.contractAmount || ""}
              onChange={(e) =>
                handleFormChange("contractAmount", e.target.value)
              }
              required
            />
          </div>
          <div className="QuestionDesignerform-group">
            <label>رتبه عملکرد</label>
            <div className="radio-group">
              <label className="radio-label">
                <input
                  type="radio"
                  name="performanceRating"
                  value="1"
                  checked={String(formData.performanceRating) === "1"}
                  onChange={(e) =>
                    handleFormChange("performanceRating", e.target.value)
                  }
                  required
                />
                ضعیف
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="performanceRating"
                  value="2"
                  checked={String(formData.performanceRating) === "2"}
                  onChange={(e) =>
                    handleFormChange("performanceRating", e.target.value)
                  }
                />
                متوسط
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="performanceRating"
                  value="3"
                  checked={String(formData.performanceRating) === "3"}
                  onChange={(e) =>
                    handleFormChange("performanceRating", e.target.value)
                  }
                />
                خوب
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="performanceRating"
                  value="4"
                  checked={String(formData.performanceRating) === "4"}
                  onChange={(e) =>
                    handleFormChange("performanceRating", e.target.value)
                  }
                />
                عالی
              </label>
            </div>
          </div>
          <div className="QuestionDesignerform-group">
            <label>نام کاربری</label>
            <input
              type="text"
              value={formData.username || ""}
              onChange={(e) => handleFormChange("username", e.target.value)}
              required
            />
          </div>
          <div className="QuestionDesignerform-group">
            <label>رمز عبور</label>
            <input
              type="password"
              value={formData.password || ""}
              onChange={(e) => handleFormChange("password", e.target.value)}
              required
            />
          </div>
          <div className="QuestionDesignerform-group">
            <label>استان</label>
            <select
              value={formData.province || ""}
              onChange={(e) => handleFormChange("province", e.target.value)}
              required
            >
              <option value="">انتخاب کنید</option>
              {provinces
                .filter((p) => p.value !== "")
                .map((province) => (
                  <option key={province.value} value={province.value}>
                    {province.label}
                  </option>
                ))}
            </select>
          </div>
          <div className="QuestionDesignerform-group QuestionDesignerformFullWidth">
            <label>آدرس</label>
            <input
              type="text"
              value={formData.address || ""}
              onChange={(e) => handleFormChange("address", e.target.value)}
              required
            />
          </div>
          <div className="QuestionDesignerform-group QuestionDesignerformFullWidth">
            <label>نظر مجری</label>
            <textarea
              value={formData.managerComment || ""}
              onChange={(e) =>
                handleFormChange("managerComment", e.target.value)
              }
            />
          </div>
          <div className="assign-permit__modal-buttons full-width">
            <button type="submit" className="modal-submit">
              ذخیره تغییرات
            </button>
            <button type="button" className="modal-cancel" onClick={onClose}>
              لغو
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default EditDesignerModal;
