import { dataTables } from '../../../../apiService.js';

// let tDataTables = JSON.parse(window.localStorage.dataTables);
const delay = (ms) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
};

function mapExamDataToDataTables(examData) {

  let results = [];
  examData.forEach((exam) => {
    let organizers = dataTables["examorganizers"].filter(c => c.examRef === exam.examId);
    let variable = {
      examTitle: exam.examName,
      organizations: []
    };

    organizers.forEach((org) => {
      let organ = dataTables["organizers"].find(c => c.organizerId == org.organizerRef);
      variable["organizations"] = { "organizationName": organ.organizerName }
      let subrequests = [];
      let request = [];
      let permissionExamId = [];
      let permission = [];

      try {
        permissionExamId = dataTables["permissionexams"].find(g => g.examRef === exam.examId).permissionRef;
        permission = dataTables["permissions"].find(p => p.permissionId === permissionExamId);
        let permissionId = permission.permissionRequestRef;
        request = dataTables["requests"].find(r => r.requestId === permissionId)
        subrequests = dataTables["subrequests"].filter(e => e.subRequestToRequestRef === request.requestId);
      } catch {
        subrequests = [];
      }

      let jobs = [];
      let jobDetails = [];
      subrequests.forEach((subreq) => {
        let joblocation = dataTables["joblocations"].find(c => c.jobLocationId === subreq.subRequestJobLocationRef);
        let authQG = dataTables["authqgs"].find(c => c.authQGJobLocationRef === joblocation.jobLocationId);
        let executiveBody = dataTables["executivebodies"].find(c => c.executiveBodyId === joblocation.jobLocationExecutiveBodyRef);
        let provinceText = dataTables["geography"].find(c => c.geographyId === executiveBody.executiveBodyProvince).geographyName;
        let cityText = dataTables["geography"].find(c => c.geographyId === executiveBody.ExecutiveBodyCountey).geographyName;
        let placeText = ", " + executiveBody.executiveBodyPlace;
        let job = dataTables["jobs"].find(c => c.jobId === joblocation.jobLocationJobRef);
        let gender = dataTables["genders"].find(c=>c.genderId === authQG.authQGGenderRef).genderName;
        let quota = dataTables["quotas"].find(c=>c.quotaId === authQG.authQGQuotaRef).quotaTitle;
        let grade = dataTables["grades"].find(c=>c.gradeId === subreq.subRequestGradeRef).gradeTitle;
        let field = dataTables["fields"].find(c=>c.fieldId === subreq.subRequestFieldRef).fieldTitle;
        jobs.push({ "jobName": job.jobName });
        jobDetails["province"] = provinceText;
        jobDetails["specificConditions"] = request.requestAuthDesc;
        jobDetails["jobLocation"] = cityText + placeText;
        jobDetails["capacity"] = request.requestHireCapacity;
        jobDetails["gender"] = gender;
        jobDetails["quota"] = quota;
        jobDetails["educationLevel"] = grade;
        jobDetails["fieldOfStudy"] = field;
        jobDetails["multiplierCapacity"] = request.RequestExtraCapacity;
      });
      variable["jobs"] = jobs;
      variable["jobDetails"] = jobDetails;
      console.log(variable);
    });

    results.push(variable);
  });

  console.log(results);
  //  console.log(examData);
  //  const result = {
  //    exams: [],
  //    organizations: [],
  //    jobs: [],
  //    jobDetails: [],
  //    candidates: [],
  //    documents: []
  //  };

  //  examData.forEach(exam => {
  //    // اضافه کردن اطلاعات آزمون
  //    result.exams.push({
  //      ExamId: exam.examId,
  //      ExamName: exam.examTitle,
  //      // سایر فیلدهای مورد نیاز از dataTables.exams
  //      ExamOrganizerRef: null,
  //      ExamTypeRef: null,
  //      ExamDate: null,
  //      ExamTime: null,
  //      ExamStatusRef: 'active'
  //    });

  //    org = dataTables["organizers"].find(c=>c.organizerId === exam.examOrganizerRef);
  //    result.push({
  //     ExecutiveBodyId: org.organizerId,
  //     ExecutiveBodyName: org.organizationName,
  //     ExecutiveBodyParent: null,
  //     ExecutiveBodyProvince: null,
  //     ExecutiveBodyCountey: null
  //    });

  //     org.jobs.forEach(job => {
  //       // اضافه کردن شغل
  //       const jobId = `job-${Math.random().toString(36).substr(2, 9)}`;
  //       result.jobs.push({
  //         JobId: jobId,
  //         JobName: job.jobName,
  //         // سایر فیلدهای مورد نیاز از dataTables.jobs
  //       });

  //       // اضافه کردن جزئیات شغل
  //       const jobLocationId = `loc-${Math.random().toString(36).substr(2, 9)}`;
  //       result.jobDetails.push({
  //         JobLocationId: jobLocationId,
  //         JobLocationName: `${job.jobName} - ${job.jobDetails.jobLocation}`,
  //         JobLocationExecutiveBodyRef: orgId,
  //         JobLocationJobRef: jobId,
  //         // سایر فیلدهای مورد نیاز از dataTables.joblocations
  //       });

  //       // اضافه کردن داوطلبان
  //       job.candidates.forEach(candidate => {
  //         const candidateId = `cand-${Math.random().toString(36).substr(2, 9)}`;
  //         result.candidates.push({
  //           ApplicantId: candidateId,
  //           ApplicantProfileRef: null, // می‌توانید اطلاعات پروفایل را اضافه کنید
  //           // سایر فیلدهای مورد نیاز از dataTables.applicants
  //           ApplicantEducationalRef: null,
  //           ApplicantContactRef: null,
  //           ApplicantRecordRef: null
  //         });

  //         // اضافه کردن اطلاعات انتخاب داوطلب
  //         result.selectionlists.push({
  //           SelectionListId: `sel-${Math.random().toString(36).substr(2, 9)}`,
  //           SelectionListExamRef: examId,
  //           SelectionListExecutiveBodyRef: orgId,
  //           SelectionListJobRef: jobId,
  //           SelectionListApplicantsCount: job.candidates.length,
  //           // سایر فیلدهای مورد نیاز از dataTables.selectionlists
  //         });

  //         // اضافه کردن مدارک داوطلب
  //         Object.entries(candidate.documents).forEach(([docType, docPath]) => {
  //           if (docPath) {
  //             result.documents.push({
  //               DocumentId: `doc-${Math.random().toString(36).substr(2, 9)}`,
  //               DocumentTypeRef: docType,
  //               DocumentContentBase64: null, // می‌توانید محتوای فایل را اضافه کنید
  //               DocumentStatus: 'notReviewed',
  //               DocumentExecutiveBodyRef: orgId,
  //               DocumentExamRef: examId,
  //               DocumentApplicantRef: candidateId
  //             });
  //           }
  //         });
  //       });
  //     });
  //    });
};

// تبدیل داده‌ها
const mappedData = mapExamDataToDataTables(dataTables["exams"]);

// ادغام با dataTables
const combinedData = {
  ...dataTables["exams"],
  ...mappedData
};

export default combinedData;