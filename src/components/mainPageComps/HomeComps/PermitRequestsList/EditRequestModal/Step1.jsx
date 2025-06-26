import React from "react";
import "./Step1.scss";

const Step1 = ({
  formData,
  handleChange,
  handleNext,
  isReadOnly,
  handlePrevious,
}) => {
  const organizationOptions = [
    { value: "وزارت نیرو", label: "وزارت نیرو" },
    {
      value: "شرکت مدیریت منابع آب ایران",
      label: "شرکت مدیریت منابع آب ایران",
    },
  ];

  const capacityMultiplierOptions = [
    { value: "3برابر", label: "3 برابر" },
    { value: "5برابر", label: "5 برابر" },
  ];

  const getOrganizationLabel = (value) => {
    if (!value || value === "نامشخص") return "نامشخص";
    const option = organizationOptions.find((opt) => opt.value === value);
    return option ? option.label : value;
  };

  const getCapacityMultiplierLabel = (value) => {
    if (!value || value === "نامشخص") return "نامشخص";
    const option = capacityMultiplierOptions.find((opt) => opt.value === value);
    return option ? option.label : value;
  };

  const getEmploymentTypeLabel = (value) => {
    const types = ["رسمی", "پیمانی", "قراردادی"];
    return types.includes(value) ? value : "نامشخص";
  };

  const getScoreRatioLabel = (value) => {
    const ratios = ["70/30", "40/60"];
    return ratios.includes(value) ? value : "نامشخص";
  };

  const handleCapacityChange = (e) => {
    const value = e.target.value;
    const newValue = value ? Number(value) : 0;
    handleChange("requestHireCapacity", newValue); // تغییر کلید به requestHireCapacity
  };

  return (
    <>
      <h1 className="step-content-Title">اطلاعات پایه</h1>
      <div className="step-content step-1">
        <div className="form-group">
          <label>دستگاه</label>
          <p className="read-only">وزارت نیرو</p>
        </div>
        <div className="form-group">
          <label>نوع قرارداد</label>
          {isReadOnly ? (
            <p className="read-only">
              {getEmploymentTypeLabel(formData.employmentType)}
            </p>
          ) : (
            <select
              value={formData.employmentType || ""}
              onChange={(e) => handleChange("employmentType", e.target.value)}
              required
              disabled={isReadOnly}
            >
              <option value="" disabled>
                انتخاب کنید
              </option>
              <option value="رسمی">رسمی</option>
              <option value="پیمانی">پیمانی</option>
              <option value="قراردادی">قراردادی</option>
            </select>
          )}
        </div>

        <div className="form-group">
          <label>ظرفیت استخدام</label>
          {isReadOnly ? (
            <p className="read-only">{formData.requestHireCapacity || "0"}</p> // تغییر به requestHireCapacity
          ) : (
            <input
              type="number"
              value={formData.requestHireCapacity || ""} // تغییر به requestHireCapacity
              onChange={handleCapacityChange}
              required
              min="0"
              disabled={isReadOnly}
            />
          )}
        </div>

        <div className="form-group">
          <label>چند برابر ظرفیت</label>
          {isReadOnly ? (
            <p className="read-only">
              {getCapacityMultiplierLabel(formData.capacityMultiplier)}
            </p>
          ) : (
            <select
              value={formData.capacityMultiplier || ""}
              onChange={(e) =>
                handleChange("capacityMultiplier", e.target.value)
              }
              disabled={isReadOnly}
            >
              <option value="" disabled>
                انتخاب کنید
              </option>
              {capacityMultiplierOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="form-group">
          <label>نسبت امتیاز</label>
          {isReadOnly ? (
            <p className="read-only">
              {getScoreRatioLabel(formData.scoreRatio)}
            </p>
          ) : (
            <select
              value={formData.scoreRatio || ""}
              onChange={(e) => handleChange("scoreRatio", e.target.value)}
              required
              disabled={isReadOnly}
            >
              <option value="" disabled>
                انتخاب کنید
              </option>
              <option value="70/30">70/30</option>
              <option value="40/60">40/60</option>
            </select>
          )}
        </div>
        <div className="form-group">
          <label>شرایط اختصاصی دستگاه</label>
          {isReadOnly ? (
            <p className="read-only">
              {formData.specialConditions || "نامشخص"}
            </p>
          ) : (
            <textarea
              value={formData.specialConditions || ""}
              onChange={(e) =>
                handleChange("specialConditions", e.target.value)
              }
              placeholder="شرایط اختصاصی دستگاه را وارد کنید"
              disabled={isReadOnly}
            />
          )}
        </div>

        <div className="form-actions">
          <button className="prev-btn" onClick={handlePrevious}>
            مرحله قبل
          </button>
          <button className="next-btn" onClick={handleNext}>
            مرحله بعد
          </button>
        </div>
      </div>
    </>
  );
};

export default Step1;
