export const mapAuthQGsToQuotaTable = (authQGs, dataTables) => {
  const { joblocations, quotas, genders, geographies } = dataTables;

  // نگاشت quotaId به کلیدهای quotaTable
  const quotaMap = {
    1: "free",
    2: "quota3",
    3: "quota5",
    4: "quota25",
  };

  // نگاشت genderId به کلیدهای جنسیت
  const genderMap = {
    1: "male",
    2: "female",
    3: "both",
  };

  // گروه‌بندی authQGs بر اساس jobLocationRef, provinceRef, counteyRef, jobPlace
  const groupedQGs = authQGs.reduce((acc, qg) => {
    const key = `${qg.authQGJobLocationRef}-${qg.authQGProvinceRef}-${qg.authQGCounteyRef}-${qg.authQGJobPlace}`;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(qg);
    return acc;
  }, {});

  // تبدیل گروه‌ها به ردیف‌های quotaTable
  const quotaTable = Object.values(groupedQGs).map((group) => {
    const firstQG = group[0];
    const jobLocation =
      joblocations.find(
        (jl) => jl.jobLocationId === firstQG.authQGJobLocationRef
      ) || {};
    const province =
      geographies.find((g) => g.geographyId === firstQG.authQGProvinceRef) ||
      {};
    const city =
      geographies.find((g) => g.geographyId === firstQG.authQGCounteyRef) || {};

    // ساختار اولیه ردیف
    const row = {
      jobTitle: jobLocation.jobLocationName || "نامشخص",
      province: province.geographyName || "",
      city: city.geographyName || "",
      location: firstQG.authQGJobPlace || "",
      free: { female: "0", male: "0", both: "0" },
      quota3: { female: "0", male: "0", both: "0" },
      quota5: { female: "0", male: "0", both: "0" },
      quota25: { female: "0", male: "0", both: "0" },
    };

    // پر کردن ظرفیت‌ها
    group.forEach((qg) => {
      const quotaKey = quotaMap[qg.authQGQuotaRef];
      const genderKey = genderMap[qg.authQGGenderRef];
      if (quotaKey && genderKey) {
        row[quotaKey][genderKey] = qg.authQGCapacity.toString();
      }
    });

    return row;
  });

  return quotaTable;
};
