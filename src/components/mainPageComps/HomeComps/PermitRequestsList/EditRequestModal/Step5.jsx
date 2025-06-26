import React, { useEffect } from "react";

const Step5 = ({
  formData,
  handleClose,
  handleSupplementaryTableChange,
  setSupplementaryEvaluationTable,
  handlePrevious,
  handleNext,
  isReadOnly = false,
}) => {
  const jobs = formData.quotaTable.map((row) => row.jobTitle);

  useEffect(() => {
    if (!isReadOnly) {
      const requiredRows = jobs.flatMap((job) => [
        { job, domain: "عمومی" },
        { job, domain: "اختصاصی" },
        { job, domain: "تخصصی" },
      ]);

      const currentRows = formData.supplementaryEvaluationTable;
      const missingRows = requiredRows.filter(
        (reqRow) =>
          !currentRows.some(
            (row) => row.job === reqRow.job && row.domain === reqRow.domain
          )
      );

      if (missingRows.length > 0) {
        setSupplementaryEvaluationTable([
          ...currentRows,
          ...missingRows.map((row) => ({
            job: row.job,
            domain: row.domain,
            axis: "",
            competency: "",
            evaluationContent: "",
            tool: "",
            supplementaryShare: "",
            totalShare: "",
          })),
        ]);
      }

      const validRows = currentRows.filter((row) =>
        requiredRows.some(
          (reqRow) => row.job === reqRow.job && row.domain === reqRow.domain
        )
      );
      if (validRows.length !== currentRows.length) {
        setSupplementaryEvaluationTable(validRows);
      }
    }
  }, [
    formData.supplementaryEvaluationTable,
    jobs,
    isReadOnly,
    setSupplementaryEvaluationTable,
  ]);

  const getRowsForJob = (job) => {
    return formData.supplementaryEvaluationTable
      .filter((row) => row.job === job)
      .sort((a, b) => {
        const order = ["عمومی", "اختصاصی", "تخصصی"];
        return order.indexOf(a.domain) - order.indexOf(b.domain);
      });
  };

  return (
    <div className="step-content">
      {jobs.map((job, jobIndex) => (
        <div key={jobIndex} className="exam-section">
          <h4>ارزیابی تکمیلی برای شغل: {job}</h4>
          <div className="exam-table">
            <table>
              <thead>
                <tr>
                  <th>شغل</th>
                  <th>حیطه</th>
                  <th>محور</th>
                  <th>شایستگی</th>
                  <th>محتوای ارزیابی</th>
                  <th>ابزار</th>
                  <th>سهم ارزیابی تکمیلی</th>
                  <th>سهم از کل </th>
                </tr>
              </thead>
              <tbody>
                {getRowsForJob(job).map((row, rowIndex) => (
                  <tr key={`${job}-${rowIndex}`}>
                    <td>
                      <span className="read-only">{job}</span>
                    </td>
                    <td>
                      <span className="read-only">{row.domain}</span>
                    </td>
                    <td>
                      {isReadOnly ? (
                        <span className="read-only">
                          {row.axis || "نامشخص"}
                        </span>
                      ) : (
                        <input
                          type="text"
                          value={row.axis || ""}
                          onChange={(e) =>
                            handleSupplementaryTableChange(
                              formData.supplementaryEvaluationTable.findIndex(
                                (r) => r === row
                              ),
                              "axis",
                              e.target.value
                            )
                          }
                          disabled={isReadOnly}
                        />
                      )}
                    </td>
                    <td>
                      {isReadOnly ? (
                        <span className="read-only">
                          {row.competency || "نامشخص"}
                        </span>
                      ) : (
                        <input
                          type="text"
                          value={row.competency || ""}
                          onChange={(e) =>
                            handleSupplementaryTableChange(
                              formData.supplementaryEvaluationTable.findIndex(
                                (r) => r === row
                              ),
                              "competency",
                              e.target.value
                            )
                          }
                          disabled={isReadOnly}
                        />
                      )}
                    </td>
                    <td>
                      {isReadOnly ? (
                        <span className="read-only">
                          {row.evaluationContent || "نامشخص"}
                        </span>
                      ) : (
                        <input
                          type="text"
                          value={row.evaluationContent || ""}
                          onChange={(e) =>
                            handleSupplementaryTableChange(
                              formData.supplementaryEvaluationTable.findIndex(
                                (r) => r === row
                              ),
                              "evaluationContent",
                              e.target.value
                            )
                          }
                          disabled={isReadOnly}
                        />
                      )}
                    </td>
                    <td>
                      {isReadOnly ? (
                        <span className="read-only">
                          {row.tool || "نامشخص"}
                        </span>
                      ) : (
                        <input
                          type="text"
                          value={row.tool || ""}
                          onChange={(e) =>
                            handleSupplementaryTableChange(
                              formData.supplementaryEvaluationTable.findIndex(
                                (r) => r === row
                              ),
                              "tool",
                              e.target.value
                            )
                          }
                          disabled={isReadOnly}
                        />
                      )}
                    </td>
                    <td>
                      {isReadOnly ? (
                        <span className="read-only">
                          {row.supplementaryShare || "0"} %
                        </span>
                      ) : (
                        <input
                          type="number"
                          value={row.supplementaryShare || ""}
                          onChange={(e) =>
                            handleSupplementaryTableChange(
                              formData.supplementaryEvaluationTable.findIndex(
                                (r) => r === row
                              ),
                              "supplementaryShare",
                              e.target.value
                            )
                          }
                          min="0"
                          disabled={isReadOnly}
                        />
                      )}%
                    </td>
                    <td className="share-input">
                      {isReadOnly ? (
                        <span className="read-only">
                          {row.totalShare || "0"}%
                        </span>
                      ) : (
                        <>
                          <input
                            type="number"
                            value={row.totalShare || ""}
                            onChange={(e) =>
                              handleSupplementaryTableChange(
                                formData.supplementaryEvaluationTable.findIndex(
                                  (r) => r === row
                                ),
                                "totalShare",
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}

      <div className="form-actions">
        <button className="prev-btn" onClick={handlePrevious}>
          مرحله قبل
        </button>
        <button className="next-btn" onClick={handleNext} >
            مرحله بعد
          </button>
      </div>
    </div>
  );
};

export default Step5;
