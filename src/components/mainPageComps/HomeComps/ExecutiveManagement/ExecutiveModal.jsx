import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import "./ExecutiveModal.scss";
import { useAuth } from "../../../../AuthContext"; // اضافه شده برای دریافت نقش کاربر

const ExecutiveModal = ({
  isAddModalOpen,
  isAddSuccessModalOpen,
  setIsAddModalOpen,
  setIsAddSuccessModalOpen,
  handleAddExecutive,
  newExecutive,
  setNewExecutive,
  handleAddFormChange,
  domains,
  activityTypes,
  organizers,
  statuses,
  isEditMode = false,
  isViewMode = false, // اضافه شده برای حالت مشاهده
}) => {
  const { user } = useAuth(); // دریافت نقش کاربر
  const isReadOnly =
    isViewMode || user?.role === "کاربر سازمان اداری و استخدامی"; // تعیین حالت فقط خواندنی

  return (
    <>
      <AnimatePresence>
        {isAddModalOpen && (
          <motion.div
            className="executive-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="executive-modal__content"
              initial={{ scale: 0.7, y: "-50%" }}
              animate={{ scale: 1, y: "0%" }}
              exit={{ scale: 0.7, y: "-50%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <h3>
                {isReadOnly
                  ? "مشاهده عامل اجرایی"
                  : isEditMode
                  ? "ویرایش عامل اجرایی"
                  : "افزودن عامل اجرایی"}
              </h3>
              <form
                onSubmit={handleAddExecutive}
                className="executive-modal__form"
              >
                <div className="executive-modal__form-group">
                  <label>نام</label>
                  <input
                    type="text"
                    value={newExecutive.firstName}
                    onChange={(e) =>
                      handleAddFormChange("firstName", e.target.value)
                    }
                    required={!isReadOnly}
                    disabled={isReadOnly}
                  />
                </div>
                <div className="executive-modal__form-group">
                  <label>نام خانوادگی</label>
                  <input
                    type="text"
                    value={newExecutive.lastName}
                    onChange={(e) =>
                      handleAddFormChange("lastName", e.target.value)
                    }
                    required={!isReadOnly}
                    disabled={isReadOnly}
                  />
                </div>
                <div className="executive-modal__form-group">
                  <label>حوزه</label>
                  <select
                    value={newExecutive.domain}
                    onChange={(e) =>
                      handleAddFormChange("domain", e.target.value)
                    }
                    required={!isReadOnly}
                    disabled={isReadOnly}
                  >
                    <option value="">انتخاب کنید</option>
                    {domains
                      .filter((d) => d.value !== "")
                      .map((domain) => (
                        <option key={domain.value} value={domain.value}>
                          {domain.label}
                        </option>
                      ))}
                  </select>
                </div>
                <div className="executive-modal__form-group">
                  <label>نوع فعالیت</label>
                  <select
                    value={newExecutive.activityType}
                    onChange={(e) =>
                      handleAddFormChange("activityType", e.target.value)
                    }
                    required={!isReadOnly}
                    disabled={isReadOnly}
                  >
                    <option value="">انتخاب کنید</option>
                    {activityTypes
                      .filter((a) => a.value !== "")
                      .map((activity) => (
                        <option key={activity.value} value={activity.value}>
                          {activity.label}
                        </option>
                      ))}
                  </select>
                </div>
                <div className="executive-modal__form-group">
                  <label>نام سازمان</label>
                  <select
                    value={newExecutive.organizerName}
                    onChange={(e) =>
                      handleAddFormChange("organizerName", e.target.value)
                    }
                    required={!isReadOnly}
                    disabled={isReadOnly}
                  >
                    <option value="">انتخاب کنید</option>
                    {organizers
                      .filter((o) => o.value !== "")
                      .map((org) => (
                        <option key={org.value} value={org.value}>
                          {org.label}
                        </option>
                      ))}
                  </select>
                </div>
                <div className="executive-modal__form-group">
                  <label>کدملی</label>
                  <input
                    type="text"
                    value={newExecutive.nationalCode}
                    onChange={(e) =>
                      handleAddFormChange("nationalCode", e.target.value)
                    }
                    required={!isReadOnly}
                    disabled={isReadOnly}
                    pattern="\d{10}"
                    title="کدملی باید 10 رقم باشد"
                  />
                </div>
                <div className="executive-modal__form-group">
                  <label>شماره همراه</label>
                  <input
                    type="tel"
                    value={newExecutive.phoneNumber}
                    onChange={(e) =>
                      handleAddFormChange("phoneNumber", e.target.value)
                    }
                    required={!isReadOnly}
                    disabled={isReadOnly}
                    pattern="09\d{9}"
                    title="شماره همراه باید با 09 شروع شده و 11 رقم باشد"
                  />
                </div>
                <div className="executive-modal__form-group">
                  <label>رتبه عملکرد</label>
                  <div className="radio-group">
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="performanceRating"
                        value="1"
                        checked={String(newExecutive.performanceRating) === "1"}
                        onChange={(e) =>
                          handleAddFormChange(
                            "performanceRating",
                            e.target.value
                          )
                        }
                        required={!isReadOnly}
                        disabled={isReadOnly}
                      />
                      ضعیف
                    </label>
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="performanceRating"
                        value="2"
                        checked={String(newExecutive.performanceRating) === "2"}
                        onChange={(e) =>
                          handleAddFormChange(
                            "performanceRating",
                            e.target.value
                          )
                        }
                        disabled={isReadOnly}
                      />
                      متوسط
                    </label>
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="performanceRating"
                        value="3"
                        checked={String(newExecutive.performanceRating) === "3"}
                        onChange={(e) =>
                          handleAddFormChange(
                            "performanceRating",
                            e.target.value
                          )
                        }
                        disabled={isReadOnly}
                      />
                      خوب
                    </label>
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="performanceRating"
                        value="4"
                        checked={String(newExecutive.performanceRating) === "4"}
                        onChange={(e) =>
                          handleAddFormChange(
                            "performanceRating",
                            e.target.value
                          )
                        }
                        disabled={isReadOnly}
                      />
                      عالی
                    </label>
                  </div>
                </div>

                <div className="executive-modal__form-actions">
                  {!isReadOnly && (
                    <button
                      type="submit"
                      className="executive-modal__btn executive-modal__btn--submit"
                    >
                      {isEditMode ? "ذخیره تغییرات" : "افزودن"}
                    </button>
                  )}
                  <button
                    type="button"
                    className="executive-modal__btn executive-modal__btn--cancel"
                    onClick={() => setIsAddModalOpen(false)}
                  >
                    {isReadOnly ? "بستن" : "انصراف"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isAddSuccessModalOpen && (
          <>
            <motion.div
              className="executive-modal__success-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            />
            <motion.div
              className="executive-modal__success"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
            >
              <p>عامل اجرایی با موفقیت {isEditMode ? "ویرایش" : "اضافه"} شد!</p>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default ExecutiveModal;
