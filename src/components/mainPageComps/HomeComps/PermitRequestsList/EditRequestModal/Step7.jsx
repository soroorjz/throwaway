import React, { useState, useEffect } from "react";
import { useAuth } from "../../../../../AuthContext";
import moment from "jalali-moment";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import "./Step6.scss";
import { FaDownload, FaUpload } from "react-icons/fa6";
import RejectionModal from "./RejectionModal";

const Step7 = ({
  formData = {},
  handleClose = () => {},
  handlePermitNumberChange = () => {},
  handlePrevious = () => {},
  handleSubmit = () => {},
  isEditMode = false,
  isReadOnly = false,
  initialModalData = {},
  resetModalData = () => {},
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
    console.log("Rejection reason in Step7:", reason);
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

  const defaultContent = (
    <div className="step6__content-block">
      {/* <p className="step6__paragraph">
        این درخواست توسط دستگاه {formData?.organization || "وزارت نیرو"} در
        تاریخ {displayDate} جهت بررسی اطلاعات مربوط به جذب و استخدام{" "}
        {formData?.hiringCapacity || 54} نیروی انسانی در{" "}
        {formData?.jobCount || 1} شغل در سامانه مدیریت آزمون‌های استخدامی
        دستگاه‌های اجرایی کشور ثبت گردیده. لذا مستدعی است درخواست ثبت‌شده را
        بررسی نموده و دستور فرمایید نسبت به صدور مجوز استخدام اقدامات لازم را
        مبذول فرمایند.
      </p> */}

      <p className="step6__paragraph">
        مدیر گرامی،
        <br />
        تأیید صلاحیت برای دریافت مجوز آزمون استخدامی به این منزله می‌باشد که
        تمامی مواد مندرج در درخواست مطالعه و درخواست فوق مورد تأیید سازمان اداری
        و استخدامی می‌باشد.
      </p>

      {/* <button className="step6__download-button" onClick={handleDownload}>
        <span className="step6__download-icon">
          <FaDownload />
        </span>
        <span className="step6__download-text">دریافت نامه درخواست</span>
      </button> */}
    </div>
  );

  const setadContent = (
    <div className="step6__content-block">
      <div className="step-content-Title">ثبت نهایی</div>
      <p className="step6__paragraph">
        این درخواست توسط دستگاه {formData?.organization || "نامشخص"} در تاریخ{" "}
        {displayDate} جهت بررسی اطلاعات مربوط به جذب و استخدام{" "}
        {formData?.hiringCapacity || "نامشخص"} نیروی انسانی در{" "}
        {formData?.jobCount || "نامشخص"} شغل در سامانه مدیریت آزمون‌های استخدامی
        دستگاه‌های اجرایی کشور ثبت گردیده. لذا مستدعی است درخواست ثبت‌شده را
        بررسی نموده و دستور فرمایید نسبت به صدور مجوز استخدام دستورات لازم را
        مبذول فرمایند.
      </p>

      <div className="step6__letter-img">
        <div className="step6__file-upload">
          {isReadOnly ? (
            <button className="step6__download-button" onClick={handleDownload}>
              <span className="step6__download-icon">
                <FaDownload />
              </span>
              <span className="step6__download-text">دریافت نامه درخواست</span>
            </button>
          ) : (
            <>
              <input
                type="file"
                id="letterUpload"
                onChange={handleFileChange}
                accept=".pdf,.jpg,.jpeg,.png"
                disabled={isReadOnly}
              />
              <label htmlFor="letterUpload" className="step6__upload-button">
                <span className="step6__upload-icon">
                  <FaUpload />
                </span>
                <span className="step6__upload-text">
                  {selectedFile ? selectedFile.name : "بارگذاری نامه درخواست"}
                </span>
              </label>
              {selectedFile && (
                <span className="step6__file-info">
                  فایل انتخاب شده: {toPersianDigits(selectedFile.name)}
                </span>
              )}
            </>
          )}
        </div>
      </div>

      <p className="step6__paragraph">
        در صورت کلیک برروی دکمه تأیید، امکان ویرایش برای دسترسی دستگاه اجرایی
        میسر نمی‌باشد و درخواست ثبت‌شده برای سازمان اداری و استخدامی کشور ارسال
        می‌گردد.
      </p>
    </div>
  );

  const approvalModalContent = (
    <div className="approval-modal__overlay">
      <div className="approval-modal">
        <h2 className="approval-modal__title">تأیید درخواست</h2>
        <p className="approval-modal__message">
          لطفاً توضیحات تأیید را وارد کنید.
        </p>

        <div className="approval-modal__form-group">
          <label className="approval-modal__label">توضیحات</label>
          <textarea
            value={permitNumber}
            onChange={(e) => setPermitNumber(e.target.value)}
            placeholder="توضیحات خود را وارد کنید"
            className="approval-modal__input"
            rows={5}
          />
        </div>

        <div className="approval-modal__actions">
          <button
            className="approval-modal__btn approval-modal__btn--cancel"
            onClick={() => setIsApprovalModalOpen(false)}
          >
            انصراف
          </button>{" "}
          <button
            className="approval-modal__btn approval-modal__btn--approve"
            onClick={handleApprovalSubmit}
          >
            ثبت
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="step6">
      <div className="step6__content">
        {user?.role === "کاربر سازمان اداری و استخدامی"
          ? defaultContent
          : user?.role === "وزارت نیرو"
          ? setadContent
          : defaultContent}
      </div>
      <div className="step6__actions">
        <button
          className="step6__btn step6__btn--prev"
          onClick={handlePrevious}
        >
          مرحله قبل
        </button>
        {isReadOnly && user?.role === "وزارت نیرو" && (
          <button
            className="step6__btn step6__btn--close"
            onClick={handleClose}
          >
            بستن
          </button>
        )}
        {!isReadOnly && (
          <>
            {user?.role === "کاربر سازمان اداری و استخدامی" ? (
              <>
                <button
                  className="step6__btn step6__btn--approve"
                  onClick={handleApprove}
                >
                  تأیید درخواست
                </button>
                <button
                  className="step6__btn step6__btn--reject"
                  onClick={() => setIsModalOpen(true)}
                >
                  رد درخواست
                </button>
              </>
            ) : (
              <button
                className="step6__btn step6__btn--approve"
                onClick={handleApprove}
              >
                تأیید
              </button>
            )}
          </>
        )}
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

export default Step7;
