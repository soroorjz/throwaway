export function toPersianDate(date) {
  const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  const dateObj = new Date(date);
  const jalali = new Intl.DateTimeFormat("fa-IR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(dateObj);

  const year = jalali.find((part) => part.type === "year").value;
  const month = jalali.find((part) => part.type === "month").value;
  const day = jalali.find((part) => part.type === "day").value;
  const hour = jalali.find((part) => part.type === "hour").value;
  const minute = jalali.find((part) => part.type === "minute").value;

  const formattedDate = `${hour}:${minute} | ${year}/${month}/${day}`;
  return formattedDate.replace(/\d/g, (d) => persianDigits[parseInt(d)]);
}

// ✅ تابع برای تبدیل اعداد پیام‌های چت به فارسی
export function convertToPersianDigits(str) {
  const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return str.toString().replace(/\d/g, (d) => persianDigits[parseInt(d)]);
}
