import React, { useEffect } from "react";
import { MdDelete } from "react-icons/md";
import { IoCloseSharp } from "react-icons/io5";
import { Tooltip } from "react-tooltip";
import "./Step3.scss";

const Step3 = ({
  formData,
  degreeOptions,
  fieldOptions,
  handleEducationTableChange,
  handlePrevious,
  handleNext,
  isReadOnly = false,
  addEducationRow,
  handleDeleteEducationRow,
}) => {
  const jobOptions = formData.quotaTable
    .filter((row) => row.jobTitle && row.jobTitle.trim()) // فقط شغل‌های معتبر
    .map((row) => ({
      value: row.jobTitle,
      label: row.jobTitle,
    }));

  useEffect(() => {
    if (formData.educationTable.length === 0 && !isReadOnly) {
      addEducationRow();
    }
  }, [formData.educationTable, addEducationRow, isReadOnly]);

  const handleRemoveField = (fieldToRemove, rowIndex) => {
    if (isReadOnly) return;
    const currentFields = Array.isArray(
      formData.educationTable[rowIndex]?.field
    )
      ? formData.educationTable[rowIndex].field
      : [];
    const updatedFields = currentFields.filter(
      (field) => field !== fieldToRemove
    );
    handleEducationTableChange(rowIndex, "field", updatedFields);
  };

  const handleCheckboxChange = (rowIndex, optionValue, isChecked) => {
    if (isReadOnly) return;
    const currentFields = Array.isArray(
      formData.educationTable[rowIndex]?.field
    )
      ? formData.educationTable[rowIndex].field
      : [];
    let updatedFields;
    if (isChecked) {
      updatedFields = [...currentFields, optionValue];
    } else {
      updatedFields = currentFields.filter((field) => field !== optionValue);
    }
    handleEducationTableChange(rowIndex, "field", updatedFields);
  };

  return (
    <div className="step-content">
      {formData.educationTable.length === 0 ? (
        <p>
          هیچ ردیفی وجود ندارد. {isReadOnly ? "" : "لطفاً یک ردیف اضافه کنید."}
        </p>
      ) : (
        formData.educationTable.map((row, rowIndex) => (
          <div key={rowIndex} className="education-table-container">
            {!isReadOnly && (
              <div className="delete-row-container">
                <button
                  className="delete-row-btn"
                  onClick={() => handleDeleteEducationRow(rowIndex)}
                  data-tooltip-id={`delete-tooltip-${rowIndex}`}
                  data-tooltip-content="حذف ردیف"
                >
                  <MdDelete />
                </button>
                <Tooltip id={`delete-tooltip-${rowIndex}`} />
              </div>
            )}
            <div className="education-table">
              <table>
                <thead>
                  <tr>
                    <th>شغل</th>
                    <th>مقطع</th>
                    <th>رشته</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      {isReadOnly ? (
                        <span className="read-only">{row.job || "نامشخص"}</span>
                      ) : (
                        <select
                          value={row.job || ""}
                          onChange={(e) =>
                            handleEducationTableChange(
                              rowIndex,
                              "job",
                              e.target.value
                            )
                          }
                          disabled={isReadOnly}
                        >
                          <option value="">انتخاب کنید</option>
                          {jobOptions.length > 0 ? (
                            jobOptions.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))
                          ) : (
                            <option value="" disabled>
                              هیچ شغلی تعریف نشده
                            </option>
                          )}
                        </select>
                      )}
                    </td>
                    <td>
                      {isReadOnly ? (
                        <span className="read-only">
                          {row.degree || "نامشخص"}
                        </span>
                      ) : (
                        <select
                          value={row.degree || ""}
                          onChange={(e) =>
                            handleEducationTableChange(
                              rowIndex,
                              "degree",
                              e.target.value
                            )
                          }
                          disabled={isReadOnly}
                        >
                          <option value="">انتخاب کنید</option>
                          {degreeOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      )}
                    </td>
                    <td>
                      {isReadOnly ? (
                        <span className="read-only">
                          {Array.isArray(row.field) && row.field.length > 0
                            ? row.field.join(", ")
                            : "نامشخص"}
                        </span>
                      ) : (
                        <div className="checkbox-container">
                          {fieldOptions.map((option) => (
                            <label
                              key={option.value}
                              className="checkbox-label"
                            >
                              <input
                                type="checkbox"
                                value={option.value}
                                checked={
                                  Array.isArray(row.field) &&
                                  row.field.includes(option.value)
                                }
                                onChange={(e) =>
                                  handleCheckboxChange(
                                    rowIndex,
                                    option.value,
                                    e.target.checked
                                  )
                                }
                                disabled={isReadOnly}
                              />
                              {option.label}
                            </label>
                          ))}
                        </div>
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            {!isReadOnly && (
              <div className="fields-display">
                <div className="fields-list">
                  {Array.isArray(row.field) && row.field.length > 0 ? (
                    row.field.map((field, fieldIndex) => (
                      <span
                        key={`${rowIndex}-${fieldIndex}-${field}`}
                        className="field-item"
                      >
                        {field}
                        {!isReadOnly && (
                          <button
                            className="remove-field"
                            onClick={() => handleRemoveField(field, rowIndex)}
                          >
                            <IoCloseSharp />
                          </button>
                        )}
                      </span>
                    ))
                  ) : (
                    <span className="no-fields">هیچ رشته‌ای انتخاب نشده</span>
                  )}
                </div>
              </div>
            )}
          </div>
        ))
      )}
      {!isReadOnly && (
        <button
          className="add-education-btn"
          onClick={addEducationRow}
          disabled={isReadOnly}
        >
          افزودن ردیف
        </button>
      )}
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

export default Step3;
