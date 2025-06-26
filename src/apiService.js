// // src/apiService.js
// import axios from "axios";

// const api = axios.create({
//   baseURL: "/api",
// });

// let tokenExpiration = null;

// export const fetchToken = async (force = false) => {
//   const cachedToken = localStorage.getItem("RayanToken");
//   const now = Date.now();
//   // فقط اگه توکن نزدیک انقضا باشه (مثلاً 30 ثانیه مونده) یا force باشه، آپدیت کن
//   if (cachedToken && tokenExpiration > now + 1000 * 30 && !force) {
//     return cachedToken;
//   }

//   try {
//     const response = await fetch("/api/auth", {
//       headers: {
//         "RAYAN-USERNAME": "S.JAMEIE",
//         "RAYAN-PASSWORD": "1156789",
//         "RAYAN-DEBUG": true,
//         "RAYAN-NOCATCH": true,
//       },
//       method: "POST",
//     });
//     const data = await response.json();
//     localStorage.setItem("RayanToken", data.token);
//     tokenExpiration = now + 1000 * 60 * 5; // 5 دقیقه از حالا
//     return data.token;
//   } catch (err) {
//     throw new Error("خطا در دریافت توکن!");
//   }
// };

// api.interceptors.request.use(async (config) => {
//   const token = await fetchToken();
//   config.headers["Rayan-Token"] = token;
//   config.headers["Rayan-Debug"] = true;
//   config.headers["RAYAN-NOCATCH"] = true;
//   return config;
// });

// api.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     if (error.response?.status === 401) {
//       await fetchToken(true); // توکن رو اجباری آپدیت کن
//       error.config.headers["Rayan-Token"] = localStorage.getItem("RayanToken");
//       return api.request(error.config); // درخواست رو دوباره امتحان کن
//     }
//     return Promise.reject(error);
//   }
// );

// export const getExamStatuses = async () => {
//   const response = await api.get("/examstatus/examstatuses");
//   return response.data.reduce((acc, status) => {
//     acc[status.examStatusId] = status.examStatusName;
//     return acc;
//   }, {});
// };

// export const getExams = async () => {
//   const response = await api.get("/exam/exams");
//   return response.data;
// };

import axios from "axios";

const api = axios.create({
  baseURL: "/api",
});

let tokenExpiration = null;
let retryCount = 0;
const maxRetries = 2;

export const fetchToken = async (force = false) => {
  const cachedToken = localStorage.getItem("RayanToken");
  const now = Date.now();
  if (cachedToken && tokenExpiration > now + 1000 * 30 && !force) {
    console.log("Using cached token:", cachedToken);
    return cachedToken;
  }

  try {
    console.log("Fetching new token...");
    const response = await fetch("/api/auth", {
      headers: {
        "RAYAN-USERNAME": "S.JAMEIE",
        "RAYAN-PASSWORD": "1156789",
        "RAYAN-DEBUG": true,
        "RAYAN-NOCATCH": true,
      },
      method: "POST",
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log("New token fetched:", data.token);
    localStorage.setItem("RayanToken", data.token);
    tokenExpiration = now + 1000 * 60 * 5; // 5 دقیقه
    return data.token;
  } catch (err) {
    console.error("Error fetching token:", err);
    throw new Error("خطا در دریافت توکن: " + err.message);
  }
};

api.interceptors.request.use(async (config) => {
  const token = await fetchToken();
  console.log("Adding token to request:", token);
  config.headers["Rayan-Token"] = token;
  config.headers["Rayan-Debug"] = true;
  config.headers["RAYAN-NOCATCH"] = true;
  return config;
});

api.interceptors.response.use(
  (response) => {
    retryCount = 0;
    console.log("Request successful:", response.config.url);
    return response;
  },
  async (error) => {
    console.error("Request failed:", error.response?.status, error.config.url);
    if (error.response?.status === 401 && retryCount < maxRetries) {
      retryCount++;
      console.log("Retrying request with new token...");
      await fetchToken(true);
      error.config.headers["Rayan-Token"] = localStorage.getItem("RayanToken");
      return api.request(error.config);
    }
    retryCount = 0;
    throw error;
  }
);

export const getExamStatuses = async () => {
  try {
    const response = await api.get("/examstatus/examstatuses");
    console.log("getExamStatuses response:", response.data);
    return response.data.reduce((acc, status) => {
      acc[status.examStatusId] = status.examStatusName;
      return acc;
    }, {});
  } catch (error) {
    console.error("Error fetching exam statuses:", error);
    throw new Error("خطا در دریافت وضعیت‌های آزمون: " + error.message);
  }
};

export const getExams = async () => {
  try {
    const response = await api.get("/exam/exams");
    console.log("getExams response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching exams:", error);
    throw new Error("خطا در دریافت آزمون‌ها: " + error.message);
  }
};

export const getExamById = async (examId) => {
  try {
    console.log("Fetching exam with ID:", examId);
    const response = await api.get(`/exam/${examId}`);
    console.log("getExamById response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching exam:", error);
    throw new Error("خطا در دریافت اطلاعات آزمون: " + error.message);
  }
};

export const getEducationLevels = async () => {
  try {
    const response = await api.get("/grade/grades");
    console.log("getEducationLevels response:", response.data);
    return response.data || [];
  } catch (error) {
    console.error("Error fetching education levels:", error);
    throw new Error("خطا در دریافت مقاطع تحصیلی: " + error.message);
  }
};

export const getBirthProvinces = async () => {
  try {
    const response = await api.get("/geography/geographies");
    console.log("getBirthProvinces response:", response.data);
    return response.data.filter((item) => item.geographyParent === null) || [];
  } catch (error) {
    console.error("Error fetching birth provinces:", error);
    throw new Error("خطا در دریافت استان‌ها: " + error.message);
  }
};

export const getQuotas = async () => {
  try {
    const response = await api.get("/quota/quotas");
    console.log("getQuotas response:", response.data);
    return response.data.filter((quota) => quota.quotaParent === null) || [];
  } catch (error) {
    console.error("Error fetching quotas:", error);
    throw new Error("خطا در دریافت سهمیه‌ها: " + error.message);
  }
};

// tool
export function plural(word) {
  if (!word) return word;

  // Define irregular plurals
  const irregulars = {
    person: "people",
    child: "children",
    man: "men",
    woman: "women",
    mouse: "mice",
    goose: "geese",
    foot: "feet",
    tooth: "teeth",
  };

  // Check for irregular plurals
  if (irregulars[word.toLowerCase()]) {
    return irregulars[word.toLowerCase()];
  }

  // Handle words ending in -y
  if (word.match(/y$/i) && !word.match(/[aeiou]y$/i)) {
    return word.replace(/y$/i, "ies");
  }

  // Handle words ending in -s, -sh, -ch, -x, -z
  if (word.match(/(s|sh|ch|x|z)$/i)) {
    return word + "es";
  }

  // Default: add -s
  return word + "s";
}

export const getHandler = async (tableName) => {
  try {
    const response = await api.get("/" + tableName + "/" + plural(tableName));
    console.log("Table Fetched : " + tableName);
    console.log(response.data);
    return (await response.data) || [];
  } catch (error) {
    console.log("Error while fetching: " + tableName);
    console.error(error);
    throw new Error("خطا در دریافت جدول : " + error.message);
  }
};

export const getbyIDHandler = async (tableName, specID) => {
  try {
    const response = await api.get("/" + tableName + "/" + specID);
    console.log("Table Fetched : " + tableName);
    console.log(response.data);
    return (await response.data) || [];
  } catch (error) {
    console.log("Error while fetching: " + tableName);
    console.error(error);
    throw new Error("خطا در دریافت جدول : " + error.message);
  }
};

// export const getbyConditionHandler = async (tableName, Condition) => {
//   try {
//     const response = await api.get("/" + tableName + "/" + specID);
//     console.log("Table Fetched : " + tableName);
//     console.log(response.data);
//     return (await response.data) || [];
//   } catch (error) {
//     console.log("Error while fetching: " + tableName);
//     console.error(error);
//     throw new Error("خطا در دریافت جدول : " + error.message);
//   }
// };
