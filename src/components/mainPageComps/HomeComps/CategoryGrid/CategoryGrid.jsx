import React from "react";
import {
  FaBook,
  FaChartBar,
  FaBuilding,
  FaTasks,
  FaClipboardList,
  FaUserShield,
  FaUserEdit,
  FaUsers,
  FaUsersCog,
  FaCheckCircle,
  FaLock,
  FaSitemap,
  FaUserCheck,
} from "react-icons/fa";
import { BiSolidArchive } from "react-icons/bi";
import { FaFilePen } from "react-icons/fa6";
import { FaFileCircleCheck } from "react-icons/fa6";
import { FaFileShield } from "react-icons/fa6";
import { FaFileImport } from "react-icons/fa6";
import { FaFileCircleQuestion } from "react-icons/fa6";
import { FaFileCircleXmark } from "react-icons/fa6";
import { BsFillFileEarmarkPersonFill } from "react-icons/bs";
import { FaUsersGear } from "react-icons/fa6";
import { FaFileCircleExclamation } from "react-icons/fa6";
import { BsBuildingFillAdd } from "react-icons/bs";
import { BiSolidDetail } from "react-icons/bi";
import { GiNotebook } from "react-icons/gi";
import "./CategoryGrid.scss";
import iranIcon from "../../../../icons/iranIcon.svg";

const CategoryGrid = ({ children, setSelectedChild }) => {
  const iconMap = {
    "ثبت شرایط و تعریف شغل محل‌ها": <FaClipboardList />,
    "مدیریت مجوزها": <FaCheckCircle />,
    "مدیریت آزمون": <FaTasks />,
    "تخصیص مجوز به آزمون": <FaChartBar />,
    "نتایج آزمون": <FaBook />,
    "مدیریت حوزه‌های آزمون": (
      <img className="iranIcon" src={iranIcon} alt="نقشه ایران" />
    ),
    "طراح سوال": <FaUserEdit />,
    "عوامل اجرایی مجری": <FaUsersGear />,
    "قرنطینه سوال": <FaLock />,

    "حوزه آزمون": <FaBuilding />,
    // "ارزیابی‌های جاری": <FaChartBar />,
    "لیست نفرات": <FaUsers />,
    "سازماندهی ارزیابی": <FaSitemap />,
    "مواد ارزیابی تکمیلی": <FaBook />,
    "مستندات ارزیابی تکمیلی": <FaClipboardList />,
    "نتایج ارزیابی تکمیلی": <FaCheckCircle />,
    "لیست نفرات ارزیابی تکمیلی": <FaUserCheck />,
    "سازماندهی گزینش": <FaUsersCog />,
    "لیست نفرات گزینش": <FaUserShield />,
    "نتایج گزینش": <FaCheckCircle />,
    "تولید دفترچه آزمون": <GiNotebook />,
    "معرفی آزمون": <BiSolidDetail />,
    "تعیین مجری": <BsBuildingFillAdd />,
    "بررسی نشده": <FaFileCircleQuestion />,
    "تأیید شده": <FaFileCircleCheck />,
    "رد شده": <FaFileCircleXmark />,
    "دارای نواقص": <FaFileCircleExclamation />,
    "نیاز به حضور": <BsFillFileEarmarkPersonFill />,
    بایگانی: <BiSolidArchive />,
    "دریافتی جدید": <FaFileImport />,
    "تأیید نهایی": <FaFileShield />,
  };

  return (
    <div className="category-grid">
      {children.map((child, index) => {
        const childTitle = typeof child === "string" ? child : child?.title;
        const childIcon =
          typeof child === "string" ? iconMap[child] : child?.icon;

        return (
          <div
            key={index}
            className="category-grid__box"
            onClick={() => {
              setSelectedChild(childTitle);

              //Dastore Taghire Hash
              window.location.hash = childTitle
                .trim()
                .replaceAll(" ", "_")
                .replace(/\u200C/g, "");
            }}
          >
            <div className="category-grid__icon">
              {childIcon ? childIcon : <FaTasks />}{" "}
            </div>
            <p className="category-grid__title">{childTitle}</p>
          </div>
        );
      })}
    </div>
  );
};

export default CategoryGrid;
