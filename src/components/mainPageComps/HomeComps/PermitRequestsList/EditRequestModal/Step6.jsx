import React, { useState, useEffect } from "react";
import { useAuth } from "../../../../../AuthContext";
import moment from "jalali-moment";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import "./Step6.scss";
import { FaDownload, FaUpload } from "react-icons/fa6";
import RejectionModal from "./RejectionModal";

const Step6 = ({
  formData = {},
  handleClose = () => {},
  handlePermitNumberChange = () => {},
  handlePrevious = () => {},
  handleSubmit = () => {},
  isEditMode = false,
  isReadOnly = false,
  initialModalData = {},
  resetModalData = () => {},
  handleNext,
  selectedPermitNumber = "",
}) => {
  const { user } = useAuth();
  const [selectedFile, setSelectedFile] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [permitNumber, setPermitNumber] = useState(
    isEditMode
      ? formData?.permitNumber || ""
      : initialModalData?.permitNumber || ""
  );
  const [selectedPermitImage, setSelectedPermitImage] = useState(
    isEditMode
      ? formData?.permitImage || null
      : initialModalData?.permitImage || null
  );
  const [permitExpirationDate, setPermitExpirationDate] = useState(
    isEditMode
      ? formData?.permitExpirationDate || null
      : initialModalData?.permitExpirationDate || null
  );
  const [permits, setPermits] = useState([]);

  // دریافت permits از localStorage با حذف تکراری‌ها
  useEffect(() => {
    try {
      const savedPermits = localStorage.getItem("permits");
      console.log("Raw data from localStorage:", savedPermits); // دیباگ
      if (savedPermits) {
        const parsedPermits = JSON.parse(savedPermits);
        // فقط مجوزهای موقت (isPending: true) و نوع permit، با حذف تکراری‌ها بر اساس id
        const uniquePermits = Array.from(
          new Map(
            parsedPermits
              .filter(
                (item) => item.type === "permit" && item.isPending === true
              )
              .map((item) => [item.id, item])
          ).values()
        );
        console.log("Filtered and unique permits:", uniquePermits); // دیباگ
        setPermits(uniquePermits);
      } else {
        setPermits([]);
        console.log("No permits found in localStorage");
      }
    } catch (error) {
      console.error("Error parsing permits from localStorage:", error);
      setPermits([]);
    }
  }, []);

  useEffect(() => {
    console.log("formData:", formData);
    console.log("initialModalData:", initialModalData);
  }, [formData, initialModalData]);

  const toPersianDigits = (num) => {
    const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
    return String(num).replace(/\d/g, (d) => persianDigits[parseInt(d)]);
  };

  const formatToPersianDate = (dateString) => {
    if (!dateString) return "نامشخص";
    return toPersianDigits(dateString);
  };

  const displayDate = isEditMode
    ? formatToPersianDate(formData?.registrationDate)
    : toPersianDigits(moment().locale("fa").format("YYYY/MM/DD"));

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const handlePermitImageChange = (event) => {
    const file = event.target.files[0];
    setSelectedPermitImage(file);
    handlePermitNumberChange("permitImage", file);
  };

  const handleDownload = () => {
    if (formData?.requestLetter) {
      const link = document.createElement("a");
      link.href = formData.requestLetter;
      link.download =
        formData.requestLetter.split("/").pop() || "request_letter.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      alert("فایلی برای دانلود وجود ندارد!");
    }
  };

  const handlePermitImageDownload = () => {
    if (formData?.permitImage) {
      const link = document.createElement("a");
      link.href = formData.permitImage;
      link.download =
        formData.permitImage.split("/").pop() || "permit_image.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      alert("فایلی برای دانلود وجود ندارد!");
    }
  };

  const handleRejectionSubmit = (reason) => {
    console.log("Rejection reason in Step6:", reason);
    handleSubmit("رد شده", reason);
    setRejectionReason("");
    setIsModalOpen(false);
  };

  const handleApprove = () => {
    setIsApprovalModalOpen(true);
  };

  const handleApprovalSubmit = () => {
    handlePermitNumberChange("permitNumber", permitNumber);
    handlePermitNumberChange("permitImage", selectedPermitImage);
    handlePermitNumberChange(
      "permitExpirationDate",
      permitExpirationDate
        ? new Date(permitExpirationDate)
            .toLocaleDateString("fa-IR", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            })
            .replace(/(\d+)\/(\d+)\/(\d+)/, "$3/$2/$1")
        : ""
    );
    handleSubmit("تأیید شده", "");
    setIsApprovalModalOpen(false);
    if (isEditMode) {
      setPermitNumber("");
      setSelectedPermitImage(null);
      setPermitExpirationDate(null);
    }
  };

  // مدیریت تغییر سلکت شماره مجوز
  const handlePermitNumberSelect = (e) => {
    const selectedNumber = e.target.value;
    setPermitNumber(selectedNumber);
    handlePermitNumberChange("permitNumber", selectedNumber);
  };

  const defaultContent = (
    <div className="step6__content-block">
      <p className="step6__paragraph">
        این درخواست توسط دستگاه {formData?.organization || "وزارت نیرو"} در
        تاریخ {displayDate} جهت بررسی اطلاعات مربوط به جذب و استخدام{" "}
        {formData?.hiringCapacity || 54} نیروی انسانی در{" "}
        {formData?.jobCount || 1} شغل در سامانه مدیریت آزمون‌های استخدامی
        دستگاه‌های اجرایی کشور ثبت گردیده. لذا مستدعی است درخواست ثبت‌شده را
        بررسی نموده و دستور فرمایید نسبت به صدور مجوز استخدام اقدامات لازم را
        مبذول فرمایند.
      </p>

      <p className="step6__paragraph">
        مدیر گرامی،
        <br />
        تأیید صلاحیت برای دریافت مجوز آزمون استخدامی به این منزله می‌باشد که
        تمامی مواد مندرج در درخواست مطالعه و درخواست فوق مورد تأیید سازمان اداری
        و استخدامی می‌باشد و الصاق شماره مجوز منجر به تصدیق اطلاعات آن می‌باشد،
        لطفاً دقت فرمایید.
      </p>

      {isReadOnly && (
        <div className="step6__form-group">
          <label className="step6__label">شماره مجوز</label>
          <span className="read-only">
            {formData?.permitNumber || "نامشخص"}
          </span>
        </div>
      )}
    </div>
  );

  const setadContent = (
    <div className="step6__content-block">
      <p className="step6__paragraph">
        با انتخاب یک مجوز جذب و استخدام، دستگاه اجرایی می‌تواند نسبت به تصویب
        شغل محل‌ها و ثبت شرایط احراز آن‌ها اقدام نماید.
      </p>

      <div className="step6__letter-img">
        <div className="step6__form-group">
          <label className="step6__label">شماره مجوز صادره</label>
          {user?.role === "وزارت نیرو" && !isEditMode ? (
            <select
              value={permitNumber}
              onChange={handlePermitNumberSelect}
              className="step6__select"
            >
              <option value="">انتخاب شماره مجوز</option>
              {permits.map((permit) => (
                <option key={permit.id} value={permit.number}>
                  {toPersianDigits(permit.number)}
                </option>
              ))}
            </select>
          ) : (
            <span className="read-only">
              {toPersianDigits(selectedPermitNumber) || "نامشخص"}
            </span>
          )}
        </div>
      </div>
    </div>
  );

  const adminContent = (
    <div className="step6__content-block">
      <p className="step6__paragraph">
        این درخواست توسط دستگاه {formData?.organization || "وزارت نیرو"} در
        تاریخ {displayDate} جهت بررسی اطلاعات مربوط به جذب و استخدام{" "}
        {formData?.hiringCapacity || 54} نیروی انسانی در{" "}
        {formData?.jobCount || 1} شغل در سامانه مدیریت آزمون‌های استخدامی
        دستگاه‌های اجرایی کشور ثبت گردیده. لذا مستدعی است درخواست ثبت‌شده را
        بررسی نموده و دستور فرمایید نسبت به صدور مجوز استخدام اقدامات لازم را
        مبذول فرمایند.
      </p>

      <p className="step6__paragraph">
        مدیر گرامی،
        <br />
        تأیید صلاحیت برای دریافت مجوز آزمون استخدامی به این منزله می‌باشد که
        تمامی مواد مندرج در درخواست مطالعه و درخواست فوق مورد تأیید سازمان اداری
        و استخدامی می‌باشد و الصاق شماره مجوز منجر به تصدیق اطلاعات آن می‌باشد،
        لطفاً دقت فرمایید.
      </p>

      <div className="step6__form-group">
        <label className="step6__label">شماره درخواست:</label>
        <span className="read-only"></span>
      </div>
      <div className="step6__letter-img">
        <div className="step6__file-upload">
          <button
            className="step6__upload-button"
            onClick={handlePermitImageDownload}
          >
            <span className="step6__upload-icon">
              <FaDownload />
            </span>
            <span className="step6__upload-text">دریافت تصویر مجوز</span>
          </button>
        </div>
      </div>
    </div>
  );

  const approvalModalContent = (
    <div className="approval-modal__overlay">
      <div className="approval-modal">
        <h2 className="approval-modal__title">تأیید درخواست</h2>
        <p className="approval-modal__message">
          لطفاً اطلاعات مجوز را وارد کنید.
        </p>

        <div className="approval-modal__form-group">
          <label className="approval-modal__label">شماره مجوز</label>
          <input
            type="text"
            value={permitNumber}
            onChange={(e) => setPermitNumber(e.target.value)}
            placeholder="شماره مجوز را وارد کنید"
            className="approval-modal__input"
          />
          <small className="approval-modal__permit-warning">
            * در صورت عدم ورود مقدار تصادفی در نظر گرفته می‌شود.
          </small>
        </div>

        <div className="approval-modal__form-group">
          <label className="approval-modal__label">بارگذاری تصویر مجوز</label>
          <input
            type="file"
            id="permitImageUpload"
            onChange={handlePermitImageChange}
            accept=".pdf,.jpg,.jpeg,.png"
            style={{ display: "none" }}
          />
          <label
            htmlFor="permitImageUpload"
            className="approval-modal__upload-button"
          >
            <span className="approval-modal__upload-icon">
              <FaUpload />
            </span>
            <span className="approval-modal__upload-text">
              {selectedPermitImage
                ? selectedPermitImage.name
                : "بارگذاری تصویر مجوز"}
            </span>
          </label>
          {selectedPermitImage && (
            <span className="approval-modal__file-info">
              فایل انتخاب شده: {toPersianDigits(selectedPermitImage.name)}
            </span>
          )}
        </div>

        <div className="approval-modal__form-group">
          <label className="approval-modal__label">تاریخ اعتبار مجوز</label>
          <DatePicker
            value={permitExpirationDate}
            onChange={setPermitExpirationDate}
            calendar={persian}
            locale={persian_fa}
            format="YYYY/MM/DD"
            placeholder="انتخاب تاریخ"
            className="approval-modal__datepicker"
          />
        </div>

        <div className="approval-modal__actions">
          <button
            className="approval-modal__btn approval-modal__btn--approve"
            onClick={handleApprovalSubmit}
          >
            تأیید
          </button>
          <button
            className="approval-modal__btn approval-modal__btn--cancel"
            onClick={() => setIsApprovalModalOpen(false)}
          >
            لغو
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="step6">
      <div className="step6__content">
        {user?.role === "کاربر سازمان اداری و استخدامی"
          ? adminContent
          : user?.role === "وزارت نیرو"
          ? setadContent
          : defaultContent}
      </div>
      <div className="step6__actions">
        <button className="step6__btn step6__btn--next" onClick={handleNext}>
          مرحله بعد
        </button>
      </div>
      <RejectionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleRejectionSubmit}
        rejectionReason={rejectionReason}
        setRejectionReason={setRejectionReason}
      />
      {isApprovalModalOpen && approvalModalContent}
    </div>
  );
};

export default Step6;
