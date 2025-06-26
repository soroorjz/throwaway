import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FaUpload } from "react-icons/fa";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import "react-multi-date-picker/styles/layouts/mobile.css";
import TimePicker from "react-time-picker";
import "react-time-picker/dist/TimePicker.css";
import "./SelectionOrganizationModal.scss";

const toPersianDigits = (num) => {
  const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return num
    .toString()
    .replace(/\d/g, (digit) => persianDigits[parseInt(digit)]);
};

const SelectionOrganizationModal = ({
  isModalOpen,
  isSuccessModalOpen,
  isDeleteModalOpen,
  isDeleteSuccessModalOpen,
  setIsModalOpen,
  setIsSuccessModalOpen,
  setIsDeleteModalOpen,
  setIsDeleteSuccessModalOpen,
  handleModalClose,
  handleFormChange,
  handleFormSubmit,
  handleDeleteConfirm,
  handleDeleteCancel,
  formData,
  isEditMode,
  filterConfig,
}) => {
  const [exams, setExams] = useState([]);

  // خواندن exams از localStorage
  useEffect(() => {
    if (isModalOpen) {
      const storedExams = JSON.parse(localStorage.getItem("exams")) || [];
      setExams(storedExams);
    }
  }, [isModalOpen]);

  const handleExamChange = (key, value) => {
    handleFormChange(key, value);
    // تنظیم job به "حسابدار دولتی" هنگام انتخاب آزمون در حالت غیر ویرایش
    if (key === "examName" && value && !isEditMode) {
      handleFormChange("job", "حسابدار دولتی");
    }
  };

  return (
    <>
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className="selection-organization-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="selection-organization-modal__content"
              initial={{ scale: 0.7, y: "-50%" }}
              animate={{ scale: 1, y: "0%" }}
              exit={{ scale: 0.7, y: "-50%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <h3>
                {isEditMode
                  ? "ویرایش سازماندهی گزینش"
                  : "افزودن سازماندهی گزینش"}
              </h3>
              <form
                onSubmit={handleFormSubmit}
                className="selection-organization-modal__form"
              >
                <div className="selection-organization-modal__form-group">
                  <label>عنوان آزمون</label>
                  {isEditMode ? (
                    <p className="modal-text">{formData.examName}</p>
                  ) : (
                    <select
                      value={formData.examName || ""}
                      onChange={(e) =>
                        handleExamChange("examName", e.target.value)
                      }
                      required
                    >
                      <option value="" disabled>
                        انتخاب کنید
                      </option>
                      {exams.map((exam, index) => (
                        <option key={index} value={exam.title}>
                          {exam.title}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
                <div className="selection-organization-modal__form-group">
                  <label>دستگاه</label>
                  <select
                    value={formData.organization || ""}
                    onChange={(e) =>
                      handleFormChange("organization", e.target.value)
                    }
                    required
                  >
                    <option value="" disabled>
                      انتخاب کنید
                    </option>
                    <option value="معاونت امور مجلس رئیس جمهور">
                      معاونت امور مجلس رئیس جمهور
                    </option>
                    <option value="معاونت رئیس جمهور در امور زنان و خانواده">
                      معاونت رئیس جمهور در امور زنان و خانواده
                    </option>
                    <option value="معاونت اقتصادی رئیس جمهور">
                      معاونت اقتصادی رئیس جمهور
                    </option>
                    <option value="معاونت حقوقی رئیس جمهور">
                      معاونت حقوقی رئیس جمهور
                    </option>
                    <option value="معاونت علمی و فناوری رئیس جمهور">
                      معاونت علمی و فناوری رئیس جمهور
                    </option>
                    <option value="معاونت توسعه روستایی و مناطق محروم کشور">
                      معاونت توسعه روستایی و مناطق محروم کشور
                    </option>
                    <option value="نهاد ریاست جمهوری">نهاد ریاست جمهوری</option>
                    <option value="بنیاد ملی نخبگان">بنیاد ملی نخبگان</option>
                    <option value="سازمان برنامه و بودجه کشور">
                      سازمان برنامه و بودجه کشور
                    </option>
                    <option value="سازمان اداری و استخدامی کشور">
                      سازمان اداری و استخدامی کشور
                    </option>
                    <option value="سازمان انرژی اتمی ایران">
                      سازمان انرژی اتمی ایران
                    </option>
                    <option value="سازمان ثبت اسناد و املاک کشور">
                      سازمان ثبت اسناد و املاک کشور
                    </option>
                    <option value="سازمان ملی استاندارد ایران">
                      سازمان ملی استاندارد ایران
                    </option>
                    <option value="سازمان حفاظت محیط زیست">
                      سازمان حفاظت محیط زیست
                    </option>
                    <option value="وزارت آموزش و پرورش">
                      وزارت آموزش و پرورش
                    </option>
                    <option value="وزارت اطلاعات">وزارت اطلاعات</option>
                    <option value="وزارت امور خارجه">وزارت امور خارجه</option>
                    <option value="وزارت ارتباطات و فناوری اطلاعات">
                      وزارت ارتباطات و فناوری اطلاعات
                    </option>
                    <option value="وزارت امور اقتصادی و دارایی">
                      وزارت امور اقتصادی و دارایی
                    </option>
                    <option value="وزارت بهداشت، درمان و آموزش پزشکی">
                      وزارت بهداشت، درمان و آموزش پزشکی
                    </option>
                    <option value="وزارت جهاد کشاورزی">
                      وزارت جهاد کشاورزی
                    </option>
                    <option value="وزارت صنعت، معدن و تجارت">
                      وزارت صنعت، معدن و تجارت
                    </option>
                    <option value="وزارت تعاون، کار و رفاه اجتماعی">
                      وزارت تعاون، کار و رفاه اجتماعی
                    </option>
                    <option value="وزارت دادگستری">وزارت دادگستری</option>
                    <option value="وزارت دفاع و پشتیبانی نیروهای مسلح">
                      وزارت دفاع و پشتیبانی نیروهای مسلح
                    </option>
                    <option value="وزارت راه و شهرسازی">
                      وزارت راه و شهرسازی
                    </option>
                    <option value="وزارت علوم، تحقیقات و فناوری">
                      وزارت علوم، تحقیقات و فناوری
                    </option>
                    <option value="وزارت کشور">وزارت کشور</option>
                    <option value="وزارت فرهنگ و ارشاد اسلامی">
                      وزارت فرهنگ و ارشاد اسلامی
                    </option>
                    <option value="وزارت نفت">وزارت نفت</option>
                    <option value="وزارت نیرو">وزارت نیرو</option>
                    <option value="وزارت ورزش و جوانان">
                      وزارت ورزش و جوانان
                    </option>
                    <option value="وزارت میراث فرهنگی، گردشگری و صنایع دستی">
                      وزارت میراث فرهنگی، گردشگری و صنایع دستی
                    </option>
                    <option value="کلیه دستگاه‌های اجرایی">
                      کلیه دستگاه‌های اجرایی
                    </option>
                    <option value="کمیته امداد امام خمینی">
                      کمیته امداد امام خمینی
                    </option>
                    <option value="سازمان تبلیغات اسلامی">
                      سازمان تبلیغات اسلامی
                    </option>
                    <option value="بنیاد شهید و امور ایثارگران">
                      بنیاد شهید و امور ایثارگران
                    </option>
                    <option value="بنیاد مسکن انقلاب اسلامی">
                      بنیاد مسکن انقلاب اسلامی
                    </option>
                    <option value="جمعیت هلال احمر">جمعیت هلال احمر</option>
                    <option value="سازمان تأمین اجتماعی">
                      سازمان تأمین اجتماعی
                    </option>
                    <option value="سازمان شهرداری ها و دهیاری های کشور">
                      سازمان شهرداری ها و دهیاری های کشور
                    </option>
                    <option value="جهاد دانشگاهی">جهاد دانشگاهی</option>
                    <option value="قوه قضاییه">قوه قضاییه</option>
                    <option value="سازمان صدا و سیمای جمهوری اسلامی ایران">
                      سازمان صدا و سیمای جمهوری اسلامی ایران
                    </option>
                    <option value="دیوان محاسبات کشور">
                      دیوان محاسبات کشور
                    </option>
                    <option value="ستاد مبارزه با قاچاق کالاوارز">
                      ستاد مبارزه با قاچاق کالاوارز
                    </option>
                    <option value="دبیرخانه شورای عالی مناطق آزاد تجاری صنعتی و ویژه اقتصادی">
                      دبیرخانه شورای عالی مناطق آزاد تجاری صنعتی و ویژه اقتصادی
                    </option>
                    <option value="شوراهای اسلامی شهر و روستا">
                      شوراهای اسلامی شهر و روستا
                    </option>
                    <option value="سازمان ثبت احوال کشور">
                      سازمان ثبت احوال کشور
                    </option>
                    <option value="سازمان بهزیستی کشور">
                      سازمان بهزیستی کشور
                    </option>
                    <option value="بانک مرکزی جمهوری اسلامی ایران">
                      بانک مرکزی جمهوری اسلامی ایران
                    </option>
                    <option value="اتاق تعاون ایران">اتاق تعاون ایران</option>
                    <option value="اتاق بازرگانی،صنایع،معادن و کشاورزی ایران">
                      اتاق بازرگانی،صنایع،معادن و کشاورزی ایران
                    </option>
                    <option value="سازمان زندانها و اقدامات تامینی و تربیتی کشور">
                      سازمان زندانها و اقدامات تامینی و تربیتی کشور
                    </option>
                    <option value="سازمان دانش‌آموزی">سازمان دانش‌آموزی</option>
                    <option value="معاونت پیشگیری از معلولیت‌ها">
                      معاونت پیشگیری از معلولیت‌ها
                    </option>
                    <option value="شرکت برق منطقه ای اصفهان">
                      شرکت برق منطقه ای اصفهان
                    </option>
                    <option value="سازمان آتش نشانی و خدمات ایمنی شهرداری اصفهان">
                      سازمان آتش نشانی و خدمات ایمنی شهرداری اصفهان
                    </option>
                  </select>
                </div>
                <div className="selection-organization-modal__form-group">
                  <label>شغل</label>
                  <input
                    type="text"
                    value={formData.job || ""}
                    onChange={(e) => handleFormChange("job", e.target.value)}
                    className="selection-organization-modal__input"
                    required
                  />
                </div>
                <div className="selection-organization-modal__form-group">
                  <label>گروه</label>
                  <input
                    type="text"
                    value={formData.group || ""}
                    onChange={(e) => handleFormChange("group", e.target.value)}
                    required
                  />
                </div>
                <div className="selection-organization-modal__form-group">
                  <label>مکان برگزاری</label>
                  <input
                    type="text"
                    value={formData.venue || ""}
                    onChange={(e) => handleFormChange("venue", e.target.value)}
                    required
                  />
                </div>
                <div className="selection-organization-modal__form-group">
                  <label>مدارک موردنیاز</label>
                  <input
                    type="text"
                    value={formData.documents || ""}
                    onChange={(e) =>
                      handleFormChange("documents", e.target.value)
                    }
                    required
                  />
                </div>
                <div className="selection-organization-modal__form-group">
                  <label>تاریخ برگزاری</label>
                  <DatePicker
                    value={formData.examDate}
                    onChange={(date) => handleFormChange("examDate", date)}
                    calendar={persian}
                    locale={persian_fa}
                    format="YYYY/MM/DD"
                    inputClass="form-control"
                    placeholder="انتخاب تاریخ"
                    required
                  />
                </div>
                <div className="selection-organization-modal__form-group">
                  <label>ساعت برگزاری</label>
                  <TimePicker
                    value={formData.examTime}
                    onChange={(time) => handleFormChange("examTime", time)}
                    format="HH:mm"
                    disableClock={true}
                    clearIcon={null}
                    locale="fa-IR"
                    className="time-picker"
                    required
                  />
                </div>
                <div className="selection-organization-modal__form-group">
                  <label>لیست نفرات (فایل اکسل)</label>
                  <div className="file-upload-wrapper">
                    <label className="file-upload-label">
                      <FaUpload className="file-upload-icon" />
                      <span>
                        {formData.candidateList
                          ? formData.candidateList.name ||
                            formData.candidateList
                          : "انتخاب فایل"}
                      </span>
                      <input
                        type="file"
                        onChange={(e) =>
                          handleFormChange("candidateList", e.target.files[0])
                        }
                        className="file-upload-input"
                        accept=".xlsx,.xls"
                      />
                    </label>
                  </div>
                </div>
                <div className="selection-organization-modal__form-actions">
                  <button
                    type="submit"
                    className="selection-organization-modal__btn selection-organization-modal__btn--submit"
                  >
                    {isEditMode ? "ذخیره تغییرات" : "افزودن"}
                  </button>
                  <button
                    type="button"
                    className="selection-organization-modal__btn selection-organization-modal__btn--cancel"
                    onClick={handleModalClose}
                  >
                    لغو
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isSuccessModalOpen && (
          <>
            <motion.div
              className="selection-organization-modal__success-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            />
            <motion.div
              className="selection-organization-modal__success"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
            >
              <p>
                سازماندهی گزینش با موفقیت {isEditMode ? "ویرایش" : "اضافه"} شد!
              </p>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isDeleteModalOpen && (
          <motion.div
            className="selection-organization-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="selection-organization-modal__delete-content"
              initial={{ scale: 0.7, y: "-50%" }}
              animate={{ scale: 1, y: "0%" }}
              exit={{ scale: 0.7, y: "-50%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <h3>تأیید حذف</h3>
              <p>آیا از حذف سازماندهی گزینش مطمئن هستید؟</p>
              <div className="selection-organization-modal__form-actions">
                <button
                  className="selection-organization-modal__btn selection-organization-modal__btn--submit"
                  onClick={handleDeleteConfirm}
                >
                  بله
                </button>
                <button
                  className="selection-organization-modal__btn selection-organization-modal__btn--cancel"
                  onClick={handleDeleteCancel}
                >
                  خیر
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isDeleteSuccessModalOpen && (
          <>
            <motion.div
              className="selection-organization-modal__success-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            />
            <motion.div
              className="selection-organization-modal__success"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
            >
              <p>سازماندهی با موفقیت حذف شد!</p>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default SelectionOrganizationModal;
