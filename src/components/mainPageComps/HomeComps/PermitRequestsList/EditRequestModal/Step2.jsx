import React, { useEffect } from "react";
import { MdDelete } from "react-icons/md";
import { Tooltip } from "react-tooltip";
import Select from "react-select";
import "./Step2.scss";

const Step2 = ({
  formData,
  provinceOptions,
  cityOptions,
  handleQuotaTableChange,
  handlePrevious,
  handleNext,
  errorMessage,
  jobOptions,
  isReadOnly = false,
  addQuotaRow,
  handleDeleteRow,
}) => {
  useEffect(() => {
    console.log(
      "Step2 - Current quotaTable:",
      JSON.stringify(formData.quotaTable, null, 2)
    );
  }, [formData.quotaTable]);

  const handleAddQuotaRow = () => {
    if (isReadOnly) return;
    addQuotaRow();
  };

  // محاسبه مجموع سهمیه‌ها برای نمایش به کاربر
  const calculateTotalQuota = () => {
    return formData.quotaTable.reduce((total, row) => {
      const quotas = ["free", "quota3", "quota5", "quota25"];
      const rowTotal = quotas.reduce((rowSum, quotaType) => {
        const quota = row[quotaType] || { female: 0, male: 0, both: 0 };
        const female = parseInt(quota.female) || 0;
        const male = parseInt(quota.male) || 0;
        const both = parseInt(quota.both) || 0;
        return rowSum + female + male + both;
      }, 0);
      return total + rowTotal;
    }, 0);
  };

  const totalQuota = calculateTotalQuota();
  const hiringCapacity = parseInt(formData.hiringCapacity) || 0;

  const customStyles = {
    control: (base) => ({
      ...base,
      width: "100%",
      minWidth: "100px",
      border: "1px solid #d1d5db",
      borderRadius: "0.25rem",
      fontSize: "0.8rem",
      padding: "0",
      margin: "0",
      boxShadow: "none",
      "&:hover": {
        borderColor: "#d1d5db",
      },
      "&:focus": {
        borderColor: "#3b82f6",
        boxShadow: "0 0 0 2px rgba(59, 130, 246, 0.5)",
      },
      direction: "rtl",
    }),
    menu: (base) => ({
      ...base,
      width: "100%",
      zIndex: 10001,
      borderRadius: "0.25rem",
      fontSize: "0.8rem",
      color: "#4b5563",
      direction: "rtl",
    }),
    option: (base, { isFocused }) => ({
      ...base,
      backgroundColor: isFocused ? "rgba(4, 54, 74, 0.0588235294)" : "white",
      color: "#04364a",
      padding: "0.3rem 0.5rem",
      cursor: "pointer",
      fontSize: "0.8rem",
      textAlign: "right",
    }),
    placeholder: (base) => ({
      ...base,
      color: "#4b5563",
      fontSize: "0.8rem",
      textAlign: "right",
    }),
    singleValue: (base) => ({
      ...base,
      color: "#04364a",
      fontSize: "0.8rem",
      textAlign: "right",
    }),
    dropdownIndicator: (base) => ({
      ...base,
      padding: "0 4px",
    }),
    indicatorsContainer: (base) => ({
      ...base,
      padding: "0",
    }),
  };

  const getSelectValue = (value, options) => {
    return options.find((option) => option.value === value) || null;
  };

  return (
    <div className="step-content">
      <div className="quota-table">
        <table>
          <thead>
            <tr>
              <th rowSpan="2">شغل</th>
              <th rowSpan="2">استان</th>
              <th rowSpan="2">شهرستان</th>
              <th rowSpan="2">محل</th>
              <th colSpan="3">آزاد</th>
              <th colSpan="3">سهمیه ۳%</th>
              <th colSpan="3">سهمیه ۵%</th>
              <th colSpan="3">سهمیه ۲۵%</th>
              {!isReadOnly && <th rowSpan="2">حذف</th>}
            </tr>
            <tr>
              <th>زن</th>
              <th>مرد</th>
              <th>زن/مرد</th>
              <th>زن</th>
              <th>مرد</th>
              <th>زن/مرد</th>
              <th>زن</th>
              <th>مرد</th>
              <th>زن/مرد</th>
              <th>زن</th>
              <th>مرد</th>
              <th>زن/مرد</th>
            </tr>
          </thead>
          <tbody>
            {formData.quotaTable.map((row, rowIndex) => (
              <tr key={rowIndex}>
                <td className="jobTd">
                  {isReadOnly ? (
                    <span className="read-only">
                      {row.jobTitle || "نامشخص"}
                    </span>
                  ) : (
                    <Select
                      value={getSelectValue(row.jobTitle, jobOptions)}
                      noOptionsMessage={() => "یافت نشد"}
                      className="SearchingOptiopns"
                      onChange={(selectedOption) =>
                        handleQuotaTableChange(
                          rowIndex,
                          "jobTitle",
                          selectedOption ? selectedOption.value : ""
                        )
                      }
                      options={jobOptions}
                      isDisabled={isReadOnly}
                      placeholder="انتخاب کنید"
                      isSearchable
                      styles={customStyles}
                    />
                  )}
                </td>
                <td>
                  {isReadOnly ? (
                    <span className="read-only">
                      {row.province || "نامشخص"}
                    </span>
                  ) : (
                    <Select
                      value={getSelectValue(row.province, provinceOptions)}
                      onChange={(selectedOption) =>
                        handleQuotaTableChange(
                          rowIndex,
                          "province",
                          selectedOption ? selectedOption.value : ""
                        )
                      }
                      options={provinceOptions}
                      isDisabled={isReadOnly}
                      placeholder="انتخاب کنید"
                      isSearchable
                      noOptionsMessage={() => "یافت نشد"}
                      styles={customStyles}
                    />
                  )}
                </td>
                <td>
                  {isReadOnly ? (
                    <span className="read-only">{row.city || "نامشخص"}</span>
                  ) : (
                    <Select
                      value={
                        row.province && cityOptions[row.province]
                          ? getSelectValue(row.city, cityOptions[row.province])
                          : null
                      }
                      onChange={(selectedOption) =>
                        handleQuotaTableChange(
                          rowIndex,
                          "city",
                          selectedOption ? selectedOption.value : ""
                        )
                      }
                      options={row.province ? cityOptions[row.province] : []}
                      isDisabled={!row.province || isReadOnly}
                      placeholder="انتخاب کنید"
                      isSearchable
                      noOptionsMessage={() => "یافت نشد"}
                      styles={customStyles}
                    />
                  )}
                </td>
                <td>
                  {isReadOnly ? (
                    <span className="read-only">
                      {row.location || "نامشخص"}
                    </span>
                  ) : (
                    <input
                      type="text"
                      value={row.location || ""}
                      className="locationInput"
                      onChange={(e) =>
                        handleQuotaTableChange(
                          rowIndex,
                          "location",
                          e.target.value
                        )
                      }
                      placeholder="محل خدمت"
                      disabled={isReadOnly}
                    />
                  )}
                </td>
                <td>
                  {isReadOnly ? (
                    <span className="read-only">{row.free.female || "0"}</span>
                  ) : (
                    <input
                      type="number"
                      value={
                        row.free.female !== undefined ? row.free.female : 0
                      }
                      onChange={(e) =>
                        handleQuotaTableChange(
                          rowIndex,
                          "free",
                          e.target.value || 0,
                          "free",
                          "female"
                        )
                      }
                      min="0"
                      disabled={isReadOnly}
                      className="quota-input"
                    />
                  )}
                </td>
                <td>
                  {isReadOnly ? (
                    <span className="read-only">{row.free.male || "0"}</span>
                  ) : (
                    <input
                      type="number"
                      value={row.free.male !== undefined ? row.free.male : 0}
                      onChange={(e) =>
                        handleQuotaTableChange(
                          rowIndex,
                          "free",
                          e.target.value || 0,
                          "free",
                          "male"
                        )
                      }
                      min="0"
                      disabled={isReadOnly}
                      className="quota-input"
                    />
                  )}
                </td>
                <td>
                  {isReadOnly ? (
                    <span className="read-only">{row.free.both || "0"}</span>
                  ) : (
                    <input
                      type="number"
                      value={row.free.both !== undefined ? row.free.both : 0}
                      onChange={(e) =>
                        handleQuotaTableChange(
                          rowIndex,
                          "free",
                          e.target.value || 0,
                          "free",
                          "both"
                        )
                      }
                      min="0"
                      disabled={isReadOnly}
                      className="quota-input"
                    />
                  )}
                </td>
                <td>
                  {isReadOnly ? (
                    <span className="read-only">
                      {row.quota3.female || "0"}
                    </span>
                  ) : (
                    <input
                      type="number"
                      value={
                        row.quota3.female !== undefined ? row.quota3.female : 0
                      }
                      onChange={(e) =>
                        handleQuotaTableChange(
                          rowIndex,
                          "quota3",
                          e.target.value || 0,
                          "quota3",
                          "female"
                        )
                      }
                      min="0"
                      disabled={isReadOnly}
                      className="quota-input"
                    />
                  )}
                </td>
                <td>
                  {isReadOnly ? (
                    <span className="read-only">{row.quota3.male || "0"}</span>
                  ) : (
                    <input
                      type="number"
                      value={
                        row.quota3.male !== undefined ? row.quota3.male : 0
                      }
                      onChange={(e) =>
                        handleQuotaTableChange(
                          rowIndex,
                          "quota3",
                          e.target.value || 0,
                          "quota3",
                          "male"
                        )
                      }
                      min="0"
                      disabled={isReadOnly}
                      className="quota-input"
                    />
                  )}
                </td>
                <td>
                  {isReadOnly ? (
                    <span className="read-only">{row.quota3.both || "0"}</span>
                  ) : (
                    <input
                      type="number"
                      value={
                        row.quota3.both !== undefined ? row.quota3.both : 0
                      }
                      onChange={(e) =>
                        handleQuotaTableChange(
                          rowIndex,
                          "quota3",
                          e.target.value || 0,
                          "quota3",
                          "both"
                        )
                      }
                      min="0"
                      disabled={isReadOnly}
                      className="quota-input"
                    />
                  )}
                </td>
                <td>
                  {isReadOnly ? (
                    <span className="read-only">
                      {row.quota5.female || "0"}
                    </span>
                  ) : (
                    <input
                      type="number"
                      value={
                        row.quota5.female !== undefined ? row.quota5.female : 0
                      }
                      onChange={(e) =>
                        handleQuotaTableChange(
                          rowIndex,
                          "quota5",
                          e.target.value || 0,
                          "quota5",
                          "female"
                        )
                      }
                      min="0"
                      disabled={isReadOnly}
                      className="quota-input"
                    />
                  )}
                </td>
                <td>
                  {isReadOnly ? (
                    <span className="read-only">{row.quota5.male || "0"}</span>
                  ) : (
                    <input
                      type="number"
                      value={
                        row.quota5.male !== undefined ? row.quota5.male : 0
                      }
                      onChange={(e) =>
                        handleQuotaTableChange(
                          rowIndex,
                          "quota5",
                          e.target.value || 0,
                          "quota5",
                          "male"
                        )
                      }
                      min="0"
                      disabled={isReadOnly}
                      className="quota-input"
                    />
                  )}
                </td>
                <td>
                  {isReadOnly ? (
                    <span className="read-only">{row.quota5.both || "0"}</span>
                  ) : (
                    <input
                      type="number"
                      value={
                        row.quota5.both !== undefined ? row.quota5.both : 0
                      }
                      onChange={(e) =>
                        handleQuotaTableChange(
                          rowIndex,
                          "quota5",
                          e.target.value || 0,
                          "quota5",
                          "both"
                        )
                      }
                      min="0"
                      disabled={isReadOnly}
                      className="quota-input"
                    />
                  )}
                </td>
                <td>
                  {isReadOnly ? (
                    <span className="read-only">
                      {row.quota25.female || "0"}
                    </span>
                  ) : (
                    <input
                      type="number"
                      value={
                        row.quota25.female !== undefined
                          ? row.quota25.female
                          : 0
                      }
                      onChange={(e) =>
                        handleQuotaTableChange(
                          rowIndex,
                          "quota25",
                          e.target.value || 0,
                          "quota25",
                          "female"
                        )
                      }
                      min="0"
                      disabled={isReadOnly}
                      className="quota-input"
                    />
                  )}
                </td>
                <td>
                  {isReadOnly ? (
                    <span className="read-only">{row.quota25.male || "0"}</span>
                  ) : (
                    <input
                      type="number"
                      value={
                        row.quota25.male !== undefined ? row.quota25.male : 0
                      }
                      onChange={(e) =>
                        handleQuotaTableChange(
                          rowIndex,
                          "quota25",
                          e.target.value || 0,
                          "quota25",
                          "male"
                        )
                      }
                      min="0"
                      disabled={isReadOnly}
                      className="quota-input"
                    />
                  )}
                </td>
                <td>
                  {isReadOnly ? (
                    <span className="read-only">{row.quota25.both || "0"}</span>
                  ) : (
                    <input
                      type="number"
                      value={
                        row.quota25.both !== undefined ? row.quota25.both : 0
                      }
                      onChange={(e) =>
                        handleQuotaTableChange(
                          rowIndex,
                          "quota25",
                          e.target.value || 0,
                          "quota25",
                          "both"
                        )
                      }
                      min="0"
                      disabled={isReadOnly}
                      className="quota-input"
                    />
                  )}
                </td>
                {!isReadOnly && (
                  <td>
                    <>
                      <button
                        className="Step2delete-btn"
                        onClick={() => handleDeleteRow(rowIndex)}
                        disabled={isReadOnly}
                        data-tooltip-id={`delete-tooltip-${rowIndex}`}
                        data-tooltip-content="حذف ردیف"
                      >
                        <MdDelete />
                      </button>
                      <Tooltip
                        id={`delete-tooltip-${rowIndex}`}
                        className="step2ToolTip"
                      />
                    </>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {!isReadOnly && (
        <button className="add-job-btn" onClick={handleAddQuotaRow}>
          افزودن ردیف
        </button>
      )}
      {/* <div className="quota-summary">
        <p>ظرفیت کل: {hiringCapacity} نفر</p>
        <p>مجموع سهمیه‌های واردشده: {totalQuota} نفر</p>
        {totalQuota !== hiringCapacity && (
          <p className="quota-warning">
            {totalQuota < hiringCapacity
              ? `${hiringCapacity - totalQuota} نفر از ظرفیت باقی مانده است.`
              : `${
                  totalQuota - hiringCapacity
                } نفر بیشتر از ظرفیت وارد شده است.`}
          </p>
        )}
      </div> */}
      {errorMessage && <div className="permit-warning">{errorMessage}</div>}
      <div className="form-actions">
        <button className="prev-btn" onClick={handlePrevious}>
          مرحله قبل
        </button>
        <button className="next-btn" onClick={handleNext}>
          مرحله بعد
        </button>
      </div>
    </div>
  );
};

export default Step2;
