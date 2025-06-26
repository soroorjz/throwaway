import React, { useState } from "react";
import { FaTimes, FaUpload } from "react-icons/fa";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import "./AddPermitModal.scss";

const AddPermitModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    organization: "",
    permitImage: null,
    permitImageName: "فایلی انتخاب نشده",
    date: new Date(),
    description: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e, fileKey, fileNameKey) => {
    const file = e.target.files[0];
    setFormData((prev) => ({
      ...prev,
      [fileKey]: file,
      [fileNameKey]: file ? file.name : "فایلی انتخاب نشده",
    }));
  };

  const handleDateChange = (date) => {
    setFormData((prev) => ({ ...prev, date: date.toDate() }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>
          <FaTimes />
        </button>
        <h3>مجوز جذب</h3>
        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="organization">دستگاه</label>
            <select
              id="organization"
              name="organization"
              value={formData.organization}
              onChange={handleChange}
              required
            >
              <option value="">انتخاب کنید</option>
             
              <option value="وزارت نیرو">وزارت نیرو</option>
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
              <option value="وزارت آموزش و پرورش">وزارت آموزش و پرورش</option>
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
              <option value="وزارت جهاد کشاورزی">وزارت جهاد کشاورزی</option>
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
              <option value="وزارت راه و شهرسازی">وزارت راه و شهرسازی</option>
              <option value="وزارت علوم، تحقیقات و فناوری">
                وزارت علوم، تحقیقات و فناوری
              </option>
              <option value="وزارت کشور">وزارت کشور</option>
              <option value="وزارت فرهنگ و ارشاد اسلامی">
                وزارت فرهنگ و ارشاد اسلامی
              </option>
              <option value="وزارت نفت">وزارت نفت</option>
              
              <option value="وزارت ورزش و جوانان">وزارت ورزش و جوانان</option>
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
              <option value="سازمان تأمین اجتماعی">سازمان تأمین اجتماعی</option>
              <option value="سازمان شهرداری ها و دهیاری های کشور">
                سازمان شهرداری ها و دهیاری های کشور
              </option>
              <option value="جهاد دانشگاهی">جهاد دانشگاهی</option>
              <option value="قوه قضاییه">قوه قضاییه</option>
              <option value="سازمان صدا و سیمای جمهوری اسلامی ایران">
                سازمان صدا و سیمای جمهوری اسلامی ایران
              </option>
              <option value="دیوان محاسبات کشور">دیوان محاسبات کشور</option>
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
              <option value="سازمان بهزیستی کشور">سازمان بهزیستی کشور</option>
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
          <div className="form-group">
            <label>تصویر مجوز</label>
            <div className="file-upload-wrapper">
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  handleFileChange(e, "permitImage", "permitImageName")
                }
                required
              />
              <span className="file-upload-label">
                {formData.permitImageName}
              </span>
              <FaUpload className="file-upload-icon" />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="date">تاریخ اعتبار</label>
            <DatePicker
              value={formData.date}
              onChange={handleDateChange}
              calendar={persian}
              locale={persian_fa}
              className="date-picker"
              format="YYYY/MM/DD"
              required
            />
          </div>
          <div className="form-group full-width">
            <label htmlFor="description">توضیحات</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              placeholder="توضیحات مجوز را وارد کنید..."
            />
          </div>
          <div className="modal-buttons">
            <button type="submit" className="modal-submit">
              ثبت
            </button>
            <button type="button" className="modal-cancel" onClick={onClose}>
              انصراف
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPermitModal;
