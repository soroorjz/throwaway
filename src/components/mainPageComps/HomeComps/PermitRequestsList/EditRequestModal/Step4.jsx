import React, { useEffect } from "react";
import { MdDelete } from "react-icons/md";
import { Tooltip } from "react-tooltip";

const Step4 = ({
  formData,
  handleExamTableChange,
  handlePrevious,
  handleNext,
  isReadOnly = false,
  addExamRow,
  handleDeleteExamRow,
}) => {
  const jobOptions = formData.quotaTable.map((row) => ({
    value: row.jobTitle,
    label: row.jobTitle,
  }));

  useEffect(() => {
    if (formData.generalExamTable.length === 0 && !isReadOnly) {
      addExamRow("generalExamTable");
    }
    if (formData.specializedExamTable.length === 0 && !isReadOnly) {
      addExamRow("specializedExamTable");
    }
  }, [
    formData.generalExamTable,
    formData.specializedExamTable,
    addExamRow,
    isReadOnly,
  ]);

  return (
    <div className="step-content">
      <div className="exam-section">
        <h4>مواد عمومی</h4>
        <div className="exam-table">
          <table>
            <thead>
              <tr>
                <th>شغل</th>
                <th>عنوان</th>
                <th>سهم</th>
                <th>منابع</th>
                {!isReadOnly && <th>حذف</th>} {/* شرط برای ستون حذف */}
              </tr>
            </thead>
            <tbody>
              {formData.generalExamTable.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  <td>
                    {isReadOnly ? (
                      <span className="read-only">{row.job || "نامشخص"}</span>
                    ) : (
                      <select
                        value={row.job || ""}
                        onChange={(e) =>
                          handleExamTableChange(
                            "generalExamTable",
                            rowIndex,
                            "job",
                            e.target.value
                          )
                        }
                        disabled={isReadOnly}
                      >
                        <option value="">انتخاب کنید</option>
                        {jobOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    )}
                  </td>
                  <td>
                    {isReadOnly ? (
                      <span className="read-only">{row.title || "نامشخص"}</span>
                    ) : (
                      <input
                        type="text"
                        value={row.title || ""}
                        onChange={(e) =>
                          handleExamTableChange(
                            "generalExamTable",
                            rowIndex,
                            "title",
                            e.target.value
                          )
                        }
                        disabled={isReadOnly}
                      />
                    )}
                  </td>
                  <td className="share-input">
                    {isReadOnly ? (
                      <span className="read-only">{row.share || "0"}%</span>
                    ) : (
                      <>
                        <input
                          type="number"
                          value={row.share || ""}
                          onChange={(e) =>
                            handleExamTableChange(
                              "generalExamTable",
                              rowIndex,
                              "share",
                              e.target.value
                            )
                          }
                          min="0"
                          max="100"
                          disabled={isReadOnly}
                        />
                        <span>%</span>
                      </>
                    )}
                  </td>
                  <td>
                    {isReadOnly ? (
                      <span className="read-only">
                        {row.resources || "نامشخص"}
                      </span>
                    ) : (
                      <textarea
                        value={row.resources || ""}
                        onChange={(e) =>
                          handleExamTableChange(
                            "generalExamTable",
                            rowIndex,
                            "resources",
                            e.target.value
                          )
                        }
                        placeholder="منابع را وارد کنید"
                        disabled={isReadOnly}
                      />
                    )}
                  </td>
                  {!isReadOnly && ( // شرط برای ستون حذف
                    <td>
                      <>
                        <button
                          className="delete-row-btn"
                          onClick={() =>
                            handleDeleteExamRow("generalExamTable", rowIndex)
                          }
                          data-tooltip-id={`general-delete-tooltip-${rowIndex}`}
                          data-tooltip-content="حذف ردیف"
                        >
                          <MdDelete />
                        </button>
                        <Tooltip id={`general-delete-tooltip-${rowIndex}`} />
                      </>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!isReadOnly && (
          <button
            className="add-exam-btn"
            onClick={() => addExamRow("generalExamTable")}
            disabled={isReadOnly}
          >
            افزودن ردیف
          </button>
        )}
      </div>

      <div className="exam-section">
        <h4>مواد تخصصی</h4>
        <div className="exam-table">
          <table>
            <thead>
              <tr>
                <th>شغل</th>
                <th>عنوان</th>
                <th>سهم</th>
                <th>منابع</th>
                {!isReadOnly && <th>حذف</th>} {/* شرط برای ستون حذف */}
              </tr>
            </thead>
            <tbody>
              {formData.specializedExamTable.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  <td>
                    {isReadOnly ? (
                      <span className="read-only">{row.job || "نامشخص"}</span>
                    ) : (
                      <select
                        value={row.job || ""}
                        onChange={(e) =>
                          handleExamTableChange(
                            "specializedExamTable",
                            rowIndex,
                            "job",
                            e.target.value
                          )
                        }
                        disabled={isReadOnly}
                      >
                        <option value="">انتخاب کنید</option>
                        {jobOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    )}
                  </td>
                  <td>
                    {isReadOnly ? (
                      <span className="read-only">{row.title || "نامشخص"}</span>
                    ) : (
                      <input
                        type="text"
                        value={row.title || ""}
                        onChange={(e) =>
                          handleExamTableChange(
                            "specializedExamTable",
                            rowIndex,
                            "title",
                            e.target.value
                          )
                        }
                        disabled={isReadOnly}
                      />
                    )}
                  </td>
                  <td className="share-input">
                    {isReadOnly ? (
                      <span className="read-only">{row.share || "0"}%</span>
                    ) : (
                      <>
                        <input
                          type="number"
                          value={row.share || ""}
                          onChange={(e) =>
                            handleExamTableChange(
                              "specializedExamTable",
                              rowIndex,
                              "share",
                              e.target.value
                            )
                          }
                          min="0"
                          max="100"
                          disabled={isReadOnly}
                        />
                        <span>%</span>
                      </>
                    )}
                  </td>
                  <td>
                    {isReadOnly ? (
                      <span className="read-only">
                        {row.resources || "نامشخص"}
                      </span>
                    ) : (
                      <textarea
                        value={row.resources || ""}
                        onChange={(e) =>
                          handleExamTableChange(
                            "specializedExamTable",
                            rowIndex,
                            "resources",
                            e.target.value
                          )
                        }
                        placeholder="منابع را وارد کنید"
                        disabled={isReadOnly}
                      />
                    )}
                  </td>
                  {!isReadOnly && ( // شرط برای ستون حذف
                    <td>
                      <>
                        <button
                          className="delete-row-btn"
                          onClick={() =>
                            handleDeleteExamRow(
                              "specializedExamTable",
                              rowIndex
                            )
                          }
                          data-tooltip-id={`specialized-delete-tooltip-${rowIndex}`}
                          data-tooltip-content="حذف ردیف"
                        >
                          <MdDelete />
                        </button>
                        <Tooltip
                          id={`specialized-delete-tooltip-${rowIndex}`}
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
          <button
            className="add-exam-btn"
            onClick={() => addExamRow("specializedExamTable")}
            disabled={isReadOnly}
          >
            افزودن ردیف
          </button>
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
  );
};

export default Step4;
