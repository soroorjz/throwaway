import {
  FaTachometerAlt,
  FaDatabase,
  FaFileAlt,
  FaClipboardList,
  FaUsersCog,
  FaChartBar,
  FaUserCheck,
  FaLock,
  FaSyncAlt,
} from "react-icons/fa";
import { IoDocuments } from "react-icons/io5";
import { IoIosHome } from "react-icons/io";

export const menuItems = [
  {
    title: "خانه",
    icon: <IoIosHome />,
    children: [],
  },
  {
    title: "دسترسی سریع",
    icon: <FaTachometerAlt />,
    children: [],
  },

  {
    title: "اطلاعات پایه",
    icon: <FaDatabase />,
    children: [
      { title: "اطلاعات ثابت", icon: <FaLock /> },
      { title: "اطلاعات متغیر", icon: <FaSyncAlt /> },
    ],
  },
  {
    title: "مجوز استخدام",
    icon: <FaFileAlt />,
    children: ["مدیریت مجوزها", "ثبت شرایط و تعریف شغل محل‌ها"],
  },
  {
    title: "آزمون‌های استخدامی",
    icon: <FaClipboardList />,
    children: ["مدیریت آزمون", "تخصیص مجوز به آزمون", "نتایج آزمون"],
  },
  {
    title: "سازماندهی آزمون",
    icon: <FaUsersCog />,
    children: [
      "معرفی آزمون",
      "لیست نفرات",
      "عوامل اجرایی مجری",
      "حوزه آزمون",
      "مدیریت حوزه‌های آزمون",
      "قرنطینه سوال",
      "طراح سوال",
      "تولید دفترچه آزمون",
    ],
  },
  {
    title: "بررسی مدارک",
    icon: <IoDocuments />,
    children: [
      "بررسی نشده",
      "تأیید شده",
      "رد شده",
      "دارای نواقص",
      "دریافتی جدید",
      "تأیید نهایی",
      "نیاز به حضور",
      "بایگانی",
    ],
  },
  {
    title: "ارزیابی تکمیلی",
    icon: <FaChartBar />,
    children: [
      "تعیین مجری",
      // "ارزیابی‌های جاری",
      "لیست نفرات ارزیابی تکمیلی",
      "سازماندهی ارزیابی",
      "مواد ارزیابی تکمیلی",
      "مستندات ارزیابی تکمیلی",
      "نتایج ارزیابی تکمیلی",
    ],
  },
  {
    title: "گزینش",
    icon: <FaUserCheck />,
    children: ["لیست نفرات گزینش", "سازماندهی گزینش", "نتایج گزینش"],
  },
];
