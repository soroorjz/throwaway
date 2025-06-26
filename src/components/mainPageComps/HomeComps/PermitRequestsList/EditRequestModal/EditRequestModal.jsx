import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import DateObject from "react-date-object";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import Step4 from "./Step4";
import Step5 from "./Step5";
import Step6 from "./Step6";
import Step7 from "./Step7";
import "./EditRequestModal.scss";
import {
  steps,
  stepIcons,
  jobOptions,
  provinceOptions,
  cityOptions,
  degreeOptions,
  fieldOptions,
  defaultFormData,
} from "./stepperData";
import { useAuth } from "../../../../../AuthContext";

const deepCopy = (obj) => JSON.parse(JSON.stringify(obj));

const generateRandomQuotaTable = (hiringCapacity = 0) => {
  return [
    {
      jobTitle: "",
      province: "",
      city: "",
      location: "",
      free: { female: 0, male: 0, both: 0 },
      quota3: { female: 0, male: 0, both: 0 },
      quota5: { female: 0, male: 0, both: 0 },
      quota25: { female: 0, male: 0, both: 0 },
    },
  ];
};

const generateRandomPermitNumber = () => {
  const randomNumber = Math.floor(Math.random() * 9000) + 1000;
  return `ج.ا.ا-${randomNumber}`;
};

const EditRequestModal = ({
  isOpen,
  onClose,
  request,
  onUpdate,
  isEditMode = true,
  isReadOnly = false,
  fromPage = "permitRequests",
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState(() => deepCopy(defaultFormData));
  const [errorMessage, setErrorMessage] = useState("");
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const { user } = useAuth();

  const resetFormData = () => {
    console.log("Resetting formData to defaultFormData");
    const today = new DateObject({
      calendar: persian,
      locale: persian_fa,
    }).format("YYYY/MM/DD");
    const newFormData = deepCopy({
      ...defaultFormData,
      requestRegisterDate: today,
      requestStatusRef: 1, // "در انتظار"
      rejectionReason: "",
    });
    setFormData(newFormData);
    try {
      localStorage.removeItem("formData");
    } catch (error) {
      console.error("Error removing from localStorage:", error);
    }
    console.log(
      "After reset - formData.requestRegisterDate:",
      newFormData.requestRegisterDate
    );
  };

  useEffect(() => {
    console.log("useEffect triggered:", { isOpen, isEditMode, request });
    if (isOpen) {
      if (isEditMode && request) {
        console.log("Editing mode, loading request data:", request);
        let newQuotaTable = request.quotaTable || [];

        const isQuotaTableValid =
          newQuotaTable &&
          newQuotaTable.length > 0 &&
          newQuotaTable.every(
            (row) =>
              row.free &&
              row.quota3 &&
              row.quota5 &&
              row.quota25 &&
              ["female", "male", "both"].every(
                (gender) =>
                  row.free[gender] !== undefined &&
                  row.quota3[gender] !== undefined &&
                  row.quota5[gender] !== undefined &&
                  row.quota25[gender] !== undefined
              )
          );

        if (!isQuotaTableValid) {
          console.log(
            "QuotaTable is invalid or missing, generating random quotas"
          );
          newQuotaTable = generateRandomQuotaTable(
            request.hiringCapacity || 120
          );
        }

        const isValidDate = (dateString) => {
          try {
            new DateObject({
              date: dateString,
              calendar: persian,
              locale: persian_fa,
            });
            return true;
          } catch {
            return false;
          }
        };

        // اعتبارسنجی و اصلاح educationTable
        const validatedEducationTable = Array.isArray(request.educationTable)
          ? request.educationTable.map((row) => ({
              job: row.job || "",
              degree: row.degree || "",
              field: Array.isArray(row.field) ? row.field : [],
            }))
          : [];

        const newFormData = deepCopy({
          ...defaultFormData,
          id: request.id || `request-${Date.now()}`,
          requestId: request.requestId || null,
          requestCode: request.requestCode || "",
          requestDate: request.requestDate || "",
          requestRegisterDate: isValidDate(request.registrationDate)
            ? request.registrationDate
            : new DateObject({
                calendar: persian,
                locale: persian_fa,
              }).format("YYYY/MM/DD"),
          requestHireTypeRef: request.requestHireTypeRef || "",
          requestExecutiveBodyRef: request.requestExecutiveBodyRef || "",
          requestSubExecutiveBodyRef: request.subExecutiveBodyRef || "",
          requestConfirmDate: request.confirmationDate || "",
          requestModel: request.requestModel || "",
          requestAuthDesc: request.requestAuthDesc || "",
          requestHireCapacity: request.hiringCapacity
            ? Number(request.hiringCapacity)
            : 0,
          requestExtraCapacity: request.capacityMultiplier || "",
          requestJobCount: request.requestJobCount || 0,
          requestStatusRef: request.requestStatusRef || 1,
          employmentType: request.employmentType || "",
          scoreRatio: request.scoreRatio || "",
          capacityMultiplier: request.capacityMultiplier || "",
          specialConditions: request.specialConditions || "",
          quotaTable: newQuotaTable,
          educationTable: validatedEducationTable,
          generalExamTable: Array.isArray(request.generalExamTable)
            ? request.generalExamTable
            : [],
          specializedExamTable: Array.isArray(request.specializedExamTable)
            ? request.specializedExamTable
            : [],
          supplementaryEvaluationTable: Array.isArray(
            request.supplementaryEvaluationTable
          )
            ? request.supplementaryEvaluationTable
            : [],
          writtenExamTable: Array.isArray(request.writtenExamTable)
            ? request.writtenExamTable
            : [],
          practicalExamTable: Array.isArray(request.practicalExamTable)
            ? request.practicalExamTable
            : [],
          interviewExamTable: Array.isArray(request.interviewExamTable)
            ? request.interviewExamTable
            : [],
          permitNumber: request.permitNumber || request.number || "",
          permitExpirationDate: request.permitExpirationDate || "",
          permitImage: request.permitImage || null,
          description: request.description || "",
          rejectionReason: request.rejectionReason || "",
        });

        setFormData(newFormData);
        console.log(
          "After setting edit data - newFormData:",
          JSON.stringify(newFormData, null, 2)
        );
      } else {
        console.log("Loading from localStorage or default");
        const savedData = localStorage.getItem("formData");
        if (savedData) {
          const parsedData = JSON.parse(savedData);
          console.log("Loaded formData from localStorage:", parsedData);
          // اعتبارسنجی educationTable موقع لود از localStorage
          const validatedEducationTable = Array.isArray(
            parsedData.educationTable
          )
            ? parsedData.educationTable.map((row) => ({
                job: row.job || "",
                degree: row.degree || "",
                field: Array.isArray(row.field) ? row.field : [],
              }))
            : [];
          setFormData((prev) => ({
            ...prev,
            ...parsedData,
            educationTable: validatedEducationTable,
            requestHireCapacity: Number(parsedData.requestHireCapacity) || 0,
          }));
        } else {
          setFormData({
            ...defaultFormData,
            requestHireCapacity: 0,
          });
        }
      }
    }
  }, [isOpen, isEditMode, request]);

  useEffect(() => {
    if (!isOpen && !isEditMode) {
      console.log("Closing modal, resetting formData");
      resetFormData();
    }
  }, [isOpen, isEditMode]);

  // ذخیره تغییرات توی localStorage با دیباگ
  useEffect(() => {
    console.log("Form data changed:", JSON.stringify(formData, null, 2));
    console.log(
      "QuotaTable changed:",
      JSON.stringify(formData.quotaTable, null, 2)
    );
    try {
      localStorage.setItem("formData", JSON.stringify(formData));
      console.log("Successfully saved to localStorage");
    } catch (error) {
      console.error("Error saving to localStorage:", error);
    }
  }, [formData]);

  const calculateTotalQuota = (quotaTable) => {
    if (!Array.isArray(quotaTable) || quotaTable.length === 0) return 0;

    return quotaTable.reduce((total, row) => {
      const quotas = ["free", "quota3", "quota5", "quota25"];
      const rowTotal = quotas.reduce((rowSum, quotaType) => {
        const quota = row[quotaType] || { female: 0, male: 0, both: 0 };
        const female = Number(quota.female) || 0;
        const male = Number(quota.male) || 0;
        const both = Number(quota.both) || 0;
        return rowSum + female + male + both;
      }, 0);
      return total + rowTotal;
    }, 0);
  };

  const addQuotaRow = () => {
    setFormData((prev) => ({
      ...prev,
      quotaTable: [
        ...prev.quotaTable,
        {
          jobTitle: "",
          province: "",
          city: "",
          location: "",
          free: { female: 0, male: 0, both: 0 },
          quota3: { female: 0, male: 0, both: 0 },
          quota5: { female: 0, male: 0, both: 0 },
          quota25: { female: 0, male: 0, both: 0 },
        },
      ],
    }));
  };

  const handleDeleteRow = (rowIndex) => {
    if (isReadOnly) return;
    setFormData((prev) => ({
      ...prev,
      quotaTable: prev.quotaTable.filter((_, index) => index !== rowIndex),
    }));
  };

  const handleDeleteEducationRow = (rowIndex) => {
    if (isReadOnly) return;
    setFormData((prev) => ({
      ...prev,
      educationTable: prev.educationTable.filter(
        (_, index) => index !== rowIndex
      ),
    }));
  };

  const addEducationRow = () => {
    setFormData((prev) => ({
      ...prev,
      educationTable: [
        ...prev.educationTable,
        { job: "", degree: "", field: [] }, // اطمینان از آرایه بودن field
      ],
    }));
  };

  const handleDeleteExamRow = (tableKey, rowIndex) => {
    if (isReadOnly) return;
    setFormData((prev) => ({
      ...prev,
      [tableKey]: prev[tableKey].filter((_, index) => index !== rowIndex),
    }));
  };

  const addExamRow = (tableKey) => {
    setFormData((prev) => ({
      ...prev,
      [tableKey]: [
        ...prev[tableKey],
        { job: "", title: "", share: "", resources: "" },
      ],
    }));
  };

  const handleSupplementaryTableChange = (rowIndex, field, value) => {
    if (isReadOnly) return;
    setFormData((prev) => ({
      ...prev,
      supplementaryEvaluationTable: [
        ...prev.supplementaryEvaluationTable.slice(0, rowIndex),
        {
          ...prev.supplementaryEvaluationTable[rowIndex],
          [field]: value,
        },
        ...prev.supplementaryEvaluationTable.slice(rowIndex + 1),
      ],
    }));
  };

  const setSupplementaryEvaluationTable = (newTable) => {
    if (isReadOnly) return;
    setFormData((prev) => ({
      ...prev,
      supplementaryEvaluationTable: newTable,
    }));
  };

  const handlePermitNumberChange = (key, value) => {
    if (isReadOnly) return;
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (status, reason) => {
    console.log("handleSubmit called with:", {
      status,
      reason,
      formData: JSON.stringify(formData, null, 2),
    });

    if (currentStep === 7 && user?.role === "وزارت نیرو") {
      if (!formData.permitNumber) {
        setErrorMessage("لطفاً شماره مجوز را انتخاب کنید.");
        return;
      }

      const allPermits = JSON.parse(localStorage.getItem("permits")) || [];
      const updatedPermits = allPermits.map((permit) => {
        if (permit.number === formData.permitNumber && permit.isPending) {
          return {
            ...permit,
            isPending: false,
            status: "در انتظار",
            hiringCapacity: Number(formData.requestHireCapacity) || 0,
            employmentType: formData.employmentType || "نامشخص",
            scoreRatio: formData.scoreRatio || "",
            capacityMultiplier: formData.capacityMultiplier || "",
            specialConditions: formData.specialConditions || "",
            quotaTable: formData.quotaTable || [],
            educationTable: formData.educationTable || [], // اضافه کردن
            generalExamTable: formData.generalExamTable || [], // اضافه کردن
            specializedExamTable: formData.specializedExamTable || [], // اضافه کردن
            supplementaryEvaluationTable:
              formData.supplementaryEvaluationTable || [], // اضافه کردن
            permitExpirationDate:
              formData.permitExpirationDate || permit.confirmationDate,
            number: formData.permitNumber,
          };
        }
        return permit;
      });

      localStorage.setItem("permits", JSON.stringify(updatedPermits));
      console.log(
        "After Ministry approval:",
        JSON.stringify(updatedPermits, null, 2)
      );

      if (onUpdate) {
        const updatedPermit = updatedPermits.find(
          (p) => p.number === formData.permitNumber
        );
        onUpdate(updatedPermit);
        setIsSuccessModalOpen(true);
      }
    } else if (user?.role === "کاربر سازمان اداری و استخدامی") {
      const finalPermitNumber =
        formData.permitNumber || generateRandomPermitNumber();
      const updatedRequest = {
        ...formData,
        status: status,
        rejectionReason: status === "رد شده" ? reason : "",
        confirmationDate:
          status === "تأیید شده"
            ? new DateObject({
                calendar: persian,
                locale: persian_fa,
              }).format("YYYY/MM/DD")
            : formData.confirmationDate || "",
        number: finalPermitNumber,
        permitNumber: finalPermitNumber,
        id: formData.id || request?.id || `request-${Date.now()}`,
        hiringCapacity: Number(formData.requestHireCapacity) || 0,
        educationTable: formData.educationTable || [], // اطمینان از وجود
        generalExamTable: formData.generalExamTable || [], // اطمینان از وجود
        specializedExamTable: formData.specializedExamTable || [], // اطمینان از وجود
        supplementaryEvaluationTable:
          formData.supplementaryEvaluationTable || [], // اطمینان از وجود
      };

      const allPermits = JSON.parse(localStorage.getItem("permits")) || [];
      const updatedPermits = allPermits.map((permit) =>
        permit.number === updatedRequest.number
          ? { ...permit, ...updatedRequest }
          : permit
      );
      if (!allPermits.some((p) => p.number === updatedRequest.number)) {
        updatedPermits.push(updatedRequest);
      }
      localStorage.setItem("permits", JSON.stringify(updatedPermits));
      console.log(
        "After Admin approval:",
        JSON.stringify(updatedPermits, null, 2)
      );

      if (onUpdate) {
        onUpdate(updatedRequest);
        setIsSuccessModalOpen(true);
      }
    }

    setErrorMessage("");
  };

  const handleClose = () => {
    console.log("Closing modal");
    setIsSuccessModalOpen(false);
    onClose();
  };

  const closeSuccessModal = () => {
    setIsSuccessModalOpen(false);
    onClose();
  };

  const handleNext = () => {
    if (isReadOnly) {
      if (currentStep < steps.length) {
        setCurrentStep(currentStep + 1);
      }
      return;
    }

    if (currentStep === 3) {
      const totalQuota = calculateTotalQuota(formData.quotaTable);
      const hiringCapacity = parseInt(formData.requestHireCapacity) || 0;
      const hasEmptyJobTitle = formData.quotaTable.some(
        (row) => !row.jobTitle || row.jobTitle.trim() === ""
      );

      const hasInvalidQuota = formData.quotaTable.some((row) =>
        ["free", "quota3", "quota5", "quota25"].some((quotaType) =>
          ["female", "male", "both"].some(
            (gender) =>
              row[quotaType][gender] === "" ||
              isNaN(parseInt(row[quotaType][gender]))
          )
        )
      );

      if (hasEmptyJobTitle) {
        setErrorMessage("لطفاً عنوان تمام شغل‌ها را وارد کنید.");
        return;
      }

      if (hasInvalidQuota) {
        setErrorMessage(
          "لطفاً همه مقادیر سهمیه‌ها را به‌صورت عدد معتبر وارد کنید."
        );
        return;
      }

      if (totalQuota !== hiringCapacity) {
        const difference = Math.abs(hiringCapacity - totalQuota);
        if (totalQuota < hiringCapacity) {
          setErrorMessage(`${difference} نفر از ظرفیت استخدام باقی مانده است.`);
        } else {
          setErrorMessage(
            `${difference} نفر بیشتر از ظرفیت استخدام وارد شده است.`
          );
        }
        return;
      }
    }

    if (currentStep === 4) {
      const quotaJobs = formData.quotaTable.map((row) => row.jobTitle);
      const educationTable = formData.educationTable;

      const hasEmptyFields = educationTable.some(
        (row) =>
          !row.job ||
          row.job.trim() === "" ||
          !row.degree ||
          row.field.length === 0
      );
      if (hasEmptyFields) {
        setErrorMessage(
          "لطفاً تمام فیلدها (شغل، مقطع، و حداقل یک رشته) را برای همه ردیف‌ها پر کنید."
        );
        return;
      }

      const educationJobs = educationTable.map((row) => row.job);
      const missingJobs = quotaJobs.filter(
        (job) => !educationJobs.includes(job)
      );
      if (missingJobs.length > 0) {
        setErrorMessage(
          `لطفاً برای شغل‌های زیر حداقل یک مقطع و رشته مشخص کنید: ${missingJobs.join(
            "، "
          )}`
        );
        return;
      }

      const jobDegreeMap = {};
      educationTable.forEach((row, index) => {
        if (!jobDegreeMap[row.job]) {
          jobDegreeMap[row.job] = [];
        }
        jobDegreeMap[row.job].push({ degree: row.degree, index });
      });

      const duplicateDegreeErrors = [];
      Object.entries(jobDegreeMap).forEach(([job, degrees]) => {
        const seenDegrees = new Set();
        degrees.forEach(({ degree, index }) => {
          if (seenDegrees.has(degree)) {
            duplicateDegreeErrors.push(
              `مقطع "${degree}" برای شغل "${job}" در ردیف ${
                index + 1
              } تکراری است.`
            );
          } else {
            seenDegrees.add(degree);
          }
        });
      });

      if (duplicateDegreeErrors.length > 0) {
        setErrorMessage(duplicateDegreeErrors.join(" "));
        return;
      }
    }

    if (currentStep === 5) {
      const hasEmptyExamFields = [
        formData.generalExamTable,
        formData.specializedExamTable,
      ].some((table) =>
        table.some(
          (row) =>
            !row.job ||
            row.job.trim() === "" ||
            !row.title ||
            !row.share ||
            !row.resources
        )
      );
      if (hasEmptyExamFields) {
        setErrorMessage(
          "لطفاً تمام فیلدهای جداول آزمون عمومی و تخصصی را پر کنید."
        );
        return;
      }
    }

    if (currentStep === 6) {
      // const hasEmptySupplementaryFields =
      //   formData.supplementaryEvaluationTable.some(
      //     (row) => !row.title || !row.share || !row.resources
      //   );
      // if (hasEmptySupplementaryFields) {
      //   setErrorMessage("لطفاً تمام فیلدهای جدول ارزیابی تکمیلی را پر کنید.");
      //   return;
      // }
    }

    setErrorMessage("");
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    setErrorMessage("");
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleChange = (key, value) => {
    if (isReadOnly) return;
    console.log(
      `handleChange called: key=${key}, value=${value}, type=${typeof value}`
    );
    setFormData((prev) => {
      const newFormData = { ...prev };
      if (key === "requestHireCapacity") {
        newFormData[key] = value ? Number(value) : 0; // تبدیل به عدد
      } else {
        newFormData[key] = value;
      }
      console.log("Updated formData:", JSON.stringify(newFormData, null, 2));
      return newFormData;
    });
  };

  const handleQuotaTableChange = (
    rowIndex,
    field,
    value,
    quotaType,
    genderType
  ) => {
    if (isReadOnly) return;
    console.log(
      `Changing quotaTable[${rowIndex}].${
        field || `${quotaType}.${genderType}`
      } to:`,
      value
    );
    setFormData((prev) => {
      const updatedQuotaTable = [...prev.quotaTable];
      if (quotaType && genderType) {
        updatedQuotaTable[rowIndex][quotaType][genderType] = value;
      } else {
        updatedQuotaTable[rowIndex][field] = value;
      }
      return { ...prev, quotaTable: updatedQuotaTable };
    });
  };

  const handleEducationTableChange = (rowIndex, field, value) => {
    if (isReadOnly) return;
    console.log(`Changing educationTable[${rowIndex}].${field} to:`, value);
    setFormData((prev) => {
      const updatedEducationTable = [...prev.educationTable];
      updatedEducationTable[rowIndex][field] = value;
      return { ...prev, educationTable: updatedEducationTable };
    });
  };

  const handleExamTableChange = (tableKey, rowIndex, field, value) => {
    if (isReadOnly) return;
    console.log(`Changing ${tableKey}[${rowIndex}].${field} to:`, value);
    setFormData((prev) => {
      const updatedTable = [...prev[tableKey]];
      updatedTable[rowIndex][field] = value;
      return { ...prev, [tableKey]: updatedTable };
    });
  };

  if (!isOpen) return null;
  if (isEditMode && !request) return null;

  return (
    <motion.div
      className="edit-request-modal"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="edit-request-modal-content"
        initial={{ scale: 0.7, y: "-50%" }}
        animate={{ scale: 1, y: "0%" }}
        exit={{ scale: 0.7, y: "-50%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <button className="close-btn" onClick={handleClose}>
          ×
        </button>
        <div className="edit-request-modal-header">
          <h3>
            {fromPage === "issuedPermits"
              ? "بررسی مجوزهای صادر شده"
              : isReadOnly
              ? "مشاهده درخواست مجوز"
              : isEditMode
              ? "ویرایش درخواست مجوز"
              : "افزودن درخواست مجوز"}
          </h3>
        </div>
        <div className="stepperContent">
          <div className="stepper-header">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`stepper-step ${
                  currentStep === index + 1 ? "active" : ""
                } ${currentStep > index + 1 ? "completed" : ""}`}
              >
                <div className="stepper-circle">{stepIcons[index]}</div>
                <div className="stepper-info">
                  <p className="stepper-name">{step.name}</p>
                  <p className="stepper-description">{step.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="edit-request-modal-body">
            {errorMessage && (
              <div className="error-message">{errorMessage}</div>
            )}

            {currentStep === 1 && (
              <Step6
                formData={formData}
                handlePermitNumberChange={handlePermitNumberChange}
                handlePrevious={handlePrevious}
                handleSubmit={handleSubmit}
                isEditMode={isEditMode}
                isReadOnly={isReadOnly}
                handleNext={handleNext}
                handleClose={handleClose}
                selectedPermitNumber={request?.number || ""}
              />
            )}
            {currentStep === 2 && (
              <Step1
                handlePrevious={handlePrevious}
                formData={formData}
                handleChange={handleChange}
                handleNext={handleNext}
                isReadOnly={isReadOnly}
              />
            )}
            {currentStep === 3 && (
              <Step2
                key={`step2-${isOpen}`}
                formData={formData}
                jobOptions={jobOptions}
                provinceOptions={provinceOptions}
                cityOptions={cityOptions}
                handleQuotaTableChange={handleQuotaTableChange}
                handlePrevious={handlePrevious}
                handleNext={handleNext}
                errorMessage={errorMessage}
                isReadOnly={isReadOnly}
                addQuotaRow={addQuotaRow}
                handleDeleteRow={handleDeleteRow}
              />
            )}
            {currentStep === 4 && (
              <Step3
                formData={formData}
                degreeOptions={degreeOptions}
                fieldOptions={fieldOptions}
                handleEducationTableChange={handleEducationTableChange}
                handlePrevious={handlePrevious}
                handleNext={handleNext}
                isReadOnly={isReadOnly}
                addEducationRow={addEducationRow}
                handleDeleteEducationRow={handleDeleteEducationRow}
              />
            )}
            {currentStep === 5 && (
              <Step4
                formData={formData}
                handleExamTableChange={handleExamTableChange}
                handlePrevious={handlePrevious}
                handleNext={handleNext}
                isReadOnly={isReadOnly}
                addExamRow={addExamRow}
                handleDeleteExamRow={handleDeleteExamRow}
              />
            )}
            {currentStep === 6 && (
              <Step5
                formData={formData}
                handleSupplementaryTableChange={handleSupplementaryTableChange}
                setSupplementaryEvaluationTable={
                  setSupplementaryEvaluationTable
                }
                handlePrevious={handlePrevious}
                handleClose={handleClose}
                handleNext={handleNext}
                isReadOnly={isReadOnly}
              />
            )}
            {currentStep === 7 && (
              <Step7
                formData={formData}
                handlePermitNumberChange={handlePermitNumberChange}
                handlePrevious={handlePrevious}
                handleSubmit={handleSubmit}
                isEditMode={isEditMode}
                isReadOnly={isReadOnly}
                handleNext={handleNext}
                handleClose={handleClose}
              />
            )}
          </div>
        </div>
      </motion.div>

      {isSuccessModalOpen && (
        <motion.div
          className="success-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="success-modal-content"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <h3>تأیید موفقیت‌آمیز</h3>
            <p>تأیید درخواست مجوز با موفقیت انجام شد.</p>
            <button
              className="success-modal-close-btn"
              onClick={closeSuccessModal}
            >
              بستن
            </button>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default EditRequestModal;
