import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import "react-multi-date-picker/styles/layouts/mobile.css";
import "./ExamCenterModal.scss";

// تعریف لیست شهرها برای هر استان
const provinceCities = {
  1: [
    { value: "1", label: "تبریز" },
    { value: "2", label: "مراغه" },
    { value: "3", label: "مرند" },
    { value: "4", label: "میانه" },
  ],
  2: [
    { value: "5", label: "ارومیه" },
    { value: "6", label: "خوی" },
    { value: "7", label: "مهاباد" },
    { value: "8", label: "میاندوآب" },
  ],
  3: [
    { value: "9", label: "اردبیل" },
    { value: "10", label: "پارس‌آباد" },
    { value: "11", label: "مشگین‌شهر" },
    { value: "12", label: "خلخال" },
  ],
  4: [
    { value: "13", label: "اصفهان" },
    { value: "14", label: "کاشان" },
    { value: "15", label: "خمینی‌شهر" },
    { value: "16", label: "نجف‌آباد" },
  ],
  5: [
    { value: "17", label: "کرج" },
    { value: "18", label: "فردیس" },
    { value: "19", label: "کمال‌شهر" },
    { value: "20", label: "نظرآباد" },
  ],
  6: [
    { value: "21", label: "ایلام" },
    { value: "22", label: "دهلران" },
    { value: "23", label: "ایوان" },
    { value: "24", label: "آبدانان" },
  ],
  7: [
    { value: "25", label: "بوشهر" },
    { value: "26", label: "کنگان" },
    { value: "27", label: "گناوه" },
    { value: "28", label: "دیلم" },
  ],
  8: [
    { value: "29", label: "تهران" },
    { value: "30", label: "شهرری" },
    { value: "31", label: "ورامین" },
    { value: "32", label: "پاکدشت" },
  ],
  9: [
    { value: "33", label: "شهرکرد" },
    { value: "34", label: "فارسان" },
    { value: "35", label: "بروجن" },
    { value: "36", label: "لردگان" },
  ],
  10: [
    { value: "37", label: "بیرجند" },
    { value: "38", label: "قائن" },
    { value: "39", label: "طبس" },
    { value: "40", label: "نهبندان" },
  ],
  11: [
    { value: "41", label: "مشهد" },
    { value: "42", label: "نیشابور" },
    { value: "43", label: "سبزوار" },
    { value: "44", label: "تربت حیدریه" },
  ],
  12: [
    { value: "45", label: "بجنورد" },
    { value: "46", label: "شیروان" },
    { value: "47", label: "اسفراین" },
    { value: "48", label: "مانه و سملقان" },
  ],
  13: [
    { value: "49", label: "اهواز" },
    { value: "50", label: "دزفول" },
    { value: "51", label: "آبادان" },
    { value: "52", label: "خرمشهر" },
  ],
  14: [
    { value: "53", label: "زنجان" },
    { value: "54", label: "ابهر" },
    { value: "55", label: "خدابنده" },
    { value: "56", label: "طارم" },
  ],
  15: [
    { value: "57", label: "سمنان" },
    { value: "58", label: "دامغان" },
    { value: "59", label: "شاهرود" },
    { value: "60", label: "گرمسار" },
  ],
  16: [
    { value: "61", label: "زاهدان" },
    { value: "62", label: "زابل" },
    { value: "63", label: "چابهار" },
    { value: "64", label: "ایرانشهر" },
  ],
  17: [
    { value: "65", label: "شیراز" },
    { value: "66", label: "مرودشت" },
    { value: "67", label: "جهرم" },
    { value: "68", label: "فسا" },
  ],
  18: [
    { value: "69", label: "قزوین" },
    { value: "70", label: "تاکستان" },
    { value: "71", label: "الوند" },
    { value: "72", label: "بوئین زهرا" },
  ],
  19: [
    { value: "73", label: "قم" },
    { value: "74", label: "جعفریه" },
    { value: "75", label: "دستجرد" },
    { value: "76", label: "کهک" },
  ],
  20: [
    { value: "77", label: "سنندج" },
    { value: "78", label: "سقز" },
    { value: "79", label: "مریوان" },
    { value: "80", label: "بانه" },
  ],
  21: [
    { value: "81", label: "کرمان" },
    { value: "82", label: "سیرجان" },
    { value: "83", label: "رفسنجان" },
    { value: "84", label: "بم" },
  ],
  22: [
    { value: "85", label: "کرمانشاه" },
    { value: "86", label: "اسلام‌آباد غرب" },
    { value: "87", label: "جوانرود" },
    { value: "88", label: "کنگاور" },
  ],
  23: [
    { value: "89", label: "یاسوج" },
    { value: "90", label: "گچساران" },
    { value: "91", label: "دهدشت" },
    { value: "92", label: "لیکک" },
  ],
  24: [
    { value: "93", label: "گرگان" },
    { value: "94", label: "گنبد کاووس" },
    { value: "95", label: "علی‌آباد کتول" },
    { value: "96", label: "آق‌قلا" },
  ],
  25: [
    { value: "97", label: "رشت" },
    { value: "98", label: "لاهیجان" },
    { value: "99", label: "انزلی" },
    { value: "100", label: "لنگرود" },
  ],
  26: [
    { value: "101", label: "خرم‌آباد" },
    { value: "102", label: "بروجرد" },
    { value: "103", label: "دورود" },
    { value: "104", label: "الیگودرز" },
  ],
  27: [
    { value: "105", label: "ساری" },
    { value: "106", label: "بابل" },
    { value: "107", label: "آمل" },
    { value: "108", label: "قائم‌شهر" },
  ],
  28: [
    { value: "109", label: "اراک" },
    { value: "110", label: "ساوه" },
    { value: "111", label: "خمین" },
    { value: "112", label: "محلات" },
  ],
  29: [
    { value: "113", label: "بندرعباس" },
    { value: "114", label: "میناب" },
    { value: "115", label: "قشم" },
    { value: "116", label: "کیش" },
  ],
  30: [
    { value: "117", label: "همدان" },
    { value: "118", label: "ملایر" },
    { value: "119", label: "نهاوند" },
    { value: "120", label: "تویسرکان" },
  ],
  31: [
    { value: "121", label: "یزد" },
    { value: "122", label: "میبد" },
    { value: "123", label: "اردکان" },
    { value: "124", label: "بافق" },
  ],
};

const ExamCenterModal = ({
  isModalOpen,
  isAddSuccessModalOpen,
  isDeleteModalOpen,
  isDeleteSuccessModalOpen,
  setIsModalOpen,
  setIsAddSuccessModalOpen,
  setIsDeleteModalOpen,
  setIsDeleteSuccessModalOpen,
  handleModalClose,
  handleFormChange,
  handleFormSubmit,
  handleDeleteConfirm,
  handleDeleteCancel,
  newCenter,
  isEditMode,
  provinces,
  genders,
  statuses,
  categories,
}) => {
  // مدیریت وضعیت فعال بودن فیلد شهر
  const [isCityEnabled, setIsCityEnabled] = useState(!!newCenter.province);

  // مدیریت تغییر استان
  const handleProvinceChange = (value) => {
    handleFormChange("province", value);
    setIsCityEnabled(!!value);
    if (!value) {
      handleFormChange("city", "");
    } else {
      handleFormChange("city", provinceCities[value]?.[0]?.value || "");
    }
  };

  return (
    <>
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className="exam-center-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="exam-center-modal__content"
              initial={{ scale: 0.7, y: "-50%" }}
              animate={{ scale: 1, y: "0%" }}
              exit={{ scale: 0.7, y: "-50%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <h3>{isEditMode ? "ویرایش حوزه آزمون" : "افزودن حوزه آزمون"}</h3>
              <form
                onSubmit={handleFormSubmit}
                className="exam-center-modal__form"
              >
                <div className="exam-center-modal__form-group">
                  <label>عنوان</label>
                  {isEditMode ? (
                    <p className="modal-text">{newCenter.title}</p>
                  ) : (
                    <input
                      type="text"
                      value={newCenter.title}
                      onChange={(e) =>
                        handleFormChange("title", e.target.value)
                      }
                      required
                    />
                  )}
                </div>
                <div className="exam-center-modal__form-group">
                  <label>استان</label>
                  <select
                    value={newCenter.province}
                    onChange={(e) => handleProvinceChange(e.target.value)}
                    required
                  >
                    <option value="">انتخاب کنید</option>
                    <option value="1">آذربایجان شرقی</option>
                    <option value="2">آذربایجان غربی</option>
                    <option value="3">اردبیل</option>
                    <option value="4">اصفهان</option>
                    <option value="5">البرز</option>
                    <option value="6">ایلام</option>
                    <option value="7">بوشهر</option>
                    <option value="8">تهران</option>
                    <option value="9">چهارمحال و بختیاری</option>
                    <option value="10">خراسان جنوبی</option>
                    <option value="11">خراسان رضوی</option>
                    <option value="12">خراسان شمالی</option>
                    <option value="13">خوزستان</option>
                    <option value="14">زنجان</option>
                    <option value="15">سمنان</option>
                    <option value="16">سیستان و بلوچستان</option>
                    <option value="17">فارس</option>
                    <option value="18">قزوین</option>
                    <option value="19">قم</option>
                    <option value="20">کردستان</option>
                    <option value="21">کرمان</option>
                    <option value="22">کرمانشاه</option>
                    <option value="23">کهگیلویه و بویراحمد</option>
                    <option value="24">گلستان</option>
                    <option value="25">گیلان</option>
                    <option value="26">لرستان</option>
                    <option value="27">مازندران</option>
                    <option value="28">مرکزی</option>
                    <option value="29">هرمزگان</option>
                    <option value="30">همدان</option>
                    <option value="31">یزد</option>
                  </select>
                </div>
                <div className="exam-center-modal__form-group">
                  <label>شهر</label>
                  <select
                    value={newCenter.city}
                    onChange={(e) => handleFormChange("city", e.target.value)}
                    required
                    disabled={!isCityEnabled}
                  >
                    <option value="">انتخاب کنید</option>
                    {newCenter.province &&
                      provinceCities[newCenter.province]?.map((city) => (
                        <option key={city.value} value={city.value}>
                          {city.label}
                        </option>
                      ))}
                  </select>
                </div>
                <div className="exam-center-modal__form-group">
                  <label>ظرفیت (نفر)</label>
                  <input
                    type="number"
                    value={newCenter.capacity}
                    onChange={(e) =>
                      handleFormChange("capacity", e.target.value)
                    }
                    required
                    min="1"
                  />
                </div>
                <div className="exam-center-modal__form-group">
                  <label>جنسیت</label>
                  <select
                    value={newCenter.gender}
                    onChange={(e) => handleFormChange("gender", e.target.value)}
                    required
                  >
                    <option value="">انتخاب کنید</option>
                    {genders
                      .filter((g) => g.value !== "")
                      .map((gender) => (
                        <option key={gender.value} value={gender.value}>
                          {gender.label}
                        </option>
                      ))}
                  </select>
                </div>
                <div className="exam-center-modal__form-group">
                  <label>نام خانوادگی مدیر حوزه</label>
                  <input
                    type="text"
                    value={newCenter.lastName}
                    onChange={(e) =>
                      handleFormChange("lastName", e.target.value)
                    }
                    required
                  />
                </div>
                <div className="exam-center-modal__form-group">
                  <label>تاریخ قرارداد</label>
                  <DatePicker
                    value={newCenter.contractDate}
                    onChange={(date) => handleFormChange("contractDate", date)}
                    calendar={persian}
                    locale={persian_fa}
                    format="YYYY/MM/DD"
                    inputClass="form-control"
                    placeholder="انتخاب تاریخ"
                    required
                  />
                </div>
                <div className="exam-center-modal__form-group">
                  <label>مبلغ قرارداد (ریال)</label>
                  <input
                    type="number"
                    value={newCenter.contractAmount}
                    onChange={(e) =>
                      handleFormChange("contractAmount", e.target.value)
                    }
                    required
                    min="0"
                  />
                </div>
                <div className="exam-center-modal__form-group">
                  <label>آدرس</label>
                  <input
                    type="text"
                    value={newCenter.address}
                    onChange={(e) =>
                      handleFormChange("address", e.target.value)
                    }
                    required
                  />
                </div>
                <div className="exam-center-modal__form-group">
                  <label>تلفن</label>
                  <input
                    type="tel"
                    value={newCenter.phone}
                    onChange={(e) => handleFormChange("phone", e.target.value)}
                    required
                    pattern="\d{10,11}"
                    title="شماره تلفن باید 10 یا 11 رقم باشد"
                  />
                </div>
                <div className="exam-center-modal__form-actions">
                  <button
                    type="submit"
                    className="exam-center-modal__btn exam-center-modal__btn--submit"
                  >
                    {isEditMode ? "ذخیره تغییرات" : "افزودن"}
                  </button>
                  <button
                    type="button"
                    className="exam-center-modal__btn exam-center-modal__btn--cancel"
                    onClick={handleModalClose}
                  >
                    انصراف
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
              className="exam-center-modal__success-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            />
            <motion.div
              className="exam-center-modal__success"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
            >
              <p>حوزه آزمون با موفقیت {isEditMode ? "ویرایش" : "اضافه"} شد!</p>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isDeleteModalOpen && (
          <motion.div
            className="exam-center-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="exam-center-modal__delete-content"
              initial={{ scale: 0.7, y: "-50%" }}
              animate={{ scale: 1, y: "0%" }}
              exit={{ scale: 0.7, y: "-50%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <h3>تأیید حذف</h3>
              <p>آیا از حذف حوزه آزمون مطمئن هستید؟</p>
              <div className="exam-center-modal__form-actions">
                <button
                  className="exam-center-modal__btn exam-center-modal__btn--submit"
                  onClick={handleDeleteConfirm}
                >
                  بله
                </button>
                <button
                  className="exam-center-modal__btn exam-center-modal__btn--cancel"
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
              className="exam-center-modal__success-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            />
            <motion.div
              className="exam-center-modal__success"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
            >
              <p>حوزه آزمون با موفقیت حذف شد!</p>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default ExamCenterModal;
