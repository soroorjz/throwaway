import React from "react";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal);
let currentHash = "";

async function startMicrophoneWithVolumeBoost() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ 
      audio: {
        echoCancellation: false,
        noiseSuppression: false,
        autoGainControl: false
      } 
    }).catch(err => {
      throw err;
    });
    
    const audioContext = new AudioContext();
    const source = audioContext.createMediaStreamSource(stream);
    const gainNode = audioContext.createGain();
    gainNode.gain.value = 5; // Increase volume (adjust as needed)
    
    source.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Store references for cleanup
    return {
      stream,
      audioContext,
      source,
      gainNode,
      stop: () => {
        stream.getTracks().forEach(track => track.stop());
        if (audioContext.state !== 'closed') {
          audioContext.close();
        }
      }
    };
  } catch (err) {
    console.error('Error accessing microphone:', err);
    
    // Handle specific error cases
    if (err.name === 'NotAllowedError') {
      console.error('Microphone access was denied by the user');
      // Show user-friendly message to request permission
    } else if (err.name === 'NotFoundError') {
      console.error('No microphone found');
    } else if (err.name === 'NotReadableError') {
      console.error('Microphone is already in use');
    }
    
    throw err; // Re-throw if you want calling code to handle it
  }
}

// Usage example:
let audioResources;

startMicrophoneWithVolumeBoost()
  .then(resources => {
    audioResources = resources;
    console.log('Microphone access granted with volume boost');
  })
  .catch(err => {
    console.error('Failed to access microphone:', err.message);
  });

const VoiceButton = () => {
  if (!('webkitSpeechRecognition' in window)) {
      alert("مرورگر شما از این قابلیت پشتیبانی نمی کند، ترجیحا برای استفاده از این قابلیت از مرورگر Chrome استفاده شود.");
  }

  const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    console.error("Speech Recognition not supported in this browser.");
    return;
  }

  function processCommand(text) {
    let edit = false;
    let rem = false;
    let table = "";
    text = convertPersianToEnglishNumbers(text);

    // تشخیص دستورات اصلی
    if (/برو\s*به\s*([\u0600-\u06FF\s]+?)(?=\s*(ویرایش|حذف|اضافه|ثبت|ردیف|بروزرسانی|به روزرسانی| و |به روز رسانی|بروز|به روز|پاک|مقدار|برابر|کن))/i.test(text)) {
        table = text.match(/برو\s*به\s*([\u0600-\u06FF\s]+?)(?=\s*(ویرایش|حذف|اضافه|ثبت|ردیف|بروزرسانی|به روزرسانی|به روز رسانی| و |بروز|به روز|پاک|مقدار|برابر|کن))/i)[1].trim();
        console.log(`📂 رفتن به جدول: ${table}`);
    } else if (/برگرد/.test(text)) {
        console.log("🔙 بازگشت به مرحله قبل");
    } else if (/(?:داخل|درون|برروی|بر روی|جدول)\s*([\u0600-\u06FF\s]+?)(?=\s*(ویرایش|حذف|اضافه|ثبت|ردیف|بروزرسانی|به روزرسانی| و |به روز رسانی|بروز|به روز|پاک|مقدار|برابر|کن))/i.test(text)) {
        let table = text.match(/(?:داخل|درون|برروی|بر روی|جدول)\s*([\u0600-\u06FF\s]+?)(?=\s*(ویرایش|حذف|اضافه|ثبت|ردیف|بروزرسانی|به روزرسانی| و |به روز رسانی|بروز|به روز|پاک|مقدار|برابر|کن))/i)[1].trim();
        console.log("📋 انجام عملیات بر روی جدول: " + table);
    }

    // تشخیص نوع عملیات
    if (/بروزرسانی کن|به روزرسانی کن|به روز رسانی کن|بروز کن|به روز کن|ویرایش کن/.test(text)) {
        console.log("🔄 بروزرسانی اطلاعات");
        edit = true;
    } else if (/اضافه کن|ثبت کن|ثبت جدید کن/.test(text)) {
        console.log("➕ اضافه کردن مقدار جدید");
        if (table) {
            setTimeout(async () => {
                // let tableFinder = await menuRequest("scripts", null, {"Rayan-Token": sessionStorage.RayanToken}, true);
                // let filtered = tableFinder[0].filter(c => c.MenuName === table)[0];
                // if (filtered) {
                //     let addByVoice = filtered.SectionScriptName.replace(".php", "") + "/" + filtered.ClassName + "/addnew";
                //     let voiceModal = await processRequest(addByVoice, null, {"Rayan-Token": sessionStorage.RayanToken}, true)
                //     await ManagePrompts(null, JSON.parse(voiceModal["response"]));
                // }
            }, 10);
        } else {
            console.error("جدول مشخص نشده است");
        }
    } else if (/حذف کن|پاک کن/.test(text)) {
        console.log("🗑️ حذف مقدار");
        if (table) {
            rem = true;
        } else {
            console.error("جدول مشخص نشده است");
        }
    }

    // تشخیص انتخاب ردیف
    if (/ردیف\s*(\d+)/.test(text)) {
        let row = text.match(/ردیف\s*(\d+)/)[1];
        if (wordsToNumbers(row))
            row = wordsToNumbers(row);
        row = (parseInt(row) + 1);
        console.log(`📌 انتخاب ردیف: ${row}`);
        setTimeout(async()=>{
            // let tableFinder = await menuRequest("scripts",null,{"Rayan-Token":sessionStorage.RayanToken},true);
            // let filtered = tableFinder[0].filter(c => c.MenuName === table)[0];
            // if (edit) {
            //     let editByVoice = filtered.SectionScriptName.replace(".php","") + "/" + filtered.ClassName + "/editonebyvoice";
            //     let voiceModal = await processRequest(editByVoice ,JSON.stringify({"id":row}),{"Rayan-Token": sessionStorage.RayanToken},true)
            //     await ManagePrompts(null,JSON.parse(voiceModal["response"]))
            // } else if (rem) {
            //     let delByVoice = filtered.SectionScriptName.replace(".php", "") + "/" + filtered.ClassName + "/deleteonebyvoice";
            //     let voiceModal = await processRequest(delByVoice, JSON.stringify({"id": row}), {"Rayan-Token": sessionStorage.RayanToken}, true)
            //     await ManageAlerts(null, JSON.parse(voiceModal["response"]));
            // }
        }, 10);
    }

    // تشخیص مقدار قیمت
    if (/مقدار\s*قیمت\s*[:،]?\s*(.+)/.test(text)) {
        let priceText = text.match(/مقدار\s*قیمت\s*[:،]?\s*(.+)/)[1];
        let price = extractPrice(priceText);
        console.log(`💰 مقدار قیمت: ${price} تومان`);
    }

    text = text.replaceAll(" ", "");

    if (!text.includes("قیمت")) {
        if (/مقدار\s*(\S+)\s*که برابر است با\s*(.+)/.test(text)) {
            let [, key, value] = text.match(/مقدار\s*(\S+)\s*که برابر است با\s*(.+)/);
            value = extractDate(value); // بررسی تاریخ بودن مقدار
            console.log(`📊 مقدار ${key}: ${value}`);
        } else if (/مقدار\s*(\S+)\s*که\s*(\S+)\s*است/.test(text)) {
            let [, key, value] = text.match(/مقدار\s*(\S+)\s*که\s*(\S+)\s*است/);
            value = extractDate(value);
            console.log(`📊 مقدار ${key}: ${value}`);
        } else if (/(\S+)\s*با مقدار\s*(.+)/.test(text)) {
            let [, key, value] = text.match(/(\S+)\s*با مقدار\s*(.+)/);
            value = extractDate(value);
            console.log(`📊 مقدار ${key}: ${value}`);
        } else if (/مقدار\s*(\S+)\s*برابر\s*(\S+)\s*/.test(text)) {
            let [, key, value] = text.match(/مقدار\s*(\S+)\s*برابر\s*(\S+)\s*/);
            value = extractDate(value);
            console.log(`📊 مقدار ${key}: ${value}`);
        } else if (/(\S+)\s*مقدار\s*(.+)/.test(text)) {
            let [, key, value] = text.match(/(\S+)\s*مقدار\s*(.+)/);
            value = extractDate(value);
            console.log(`📊 مقدار ${key}: ${value}`);
        }
    }
  }

  function extractValue(text, pattern) {
    const match = text.match(pattern);
    return match ? match[1].trim() : "Not Found";
}

// Extract Persian (Jalali) date
function extractDate(text) {
    const persianMonths = {
        "فروردین": "01", "اردیبهشت": "02", "خرداد": "03",
        "تیر": "04", "مرداد": "05", "شهریور": "06",
        "مهر": "07", "آبان": "08", "آذر": "09",
        "دی": "10", "بهمن": "11", "اسفند": "12"
    };

    // **۱. دریافت سال شمسی دقیق از سیستم**
    const currentYear = new Intl.DateTimeFormat('fa-IR-u-nu-latn', { year: 'numeric' }).format(new Date());

    // **۲. تبدیل اعداد فارسی به انگلیسی**
    text = convertPersianToEnglishNumbers(text);

    // **۳. تشخیص ترتیب‌های مختلف تاریخ**
    let year = "", month = "", day = "";

    // **حالت ۱۴۰۳ ۱۱ ۰۸ یا ۱۴۰۳/۱۱/۰۸ یا ۱۴۰۳-۱۱-۰۸**
    let match = text.match(/(\d{4})[\/\-\s]?(\d{1,2})[\/\-\s]?(\d{1,2})?/);
    if (match) {
        year = match[1];
        month = match[2].padStart(2, "0");
        day = (match[3] || "00").padStart(2, "0");
        return `${year}/${month}/${day}`;
    }

    // **حالت ۸ بهمن ۱۴۰۳ یا ۸بهمن۱۴۰۳ یا ۸ بهمن۱۴۰۳**
    match = text.match(/(\d{1,2})\s*([\u0600-\u06FF]+)\s*(\d{4})?/);
    if (match && persianMonths[match[2]]) {
        day = match[1].padStart(2, "0");
        month = persianMonths[match[2]];
        year = match[3] || currentYear; // اگر سال نبود، امسال را جایگزین کن
        return `${year}/${month}/${day}`;
    }

    // **حالت بهمن ۸ ۱۴۰۳ یا بهمن ۸**
    match = text.match(/([\u0600-\u06FF]+)\s*(\d{1,2})\s*(\d{4})?/);
    if (match && persianMonths[match[1]]) {
        month = persianMonths[match[1]];
        day = match[2].padStart(2, "0");
        year = match[3] || currentYear;
        return `${year}/${month}/${day}`;
    }

    // **حالت ۱۴۰۳ بهمن ۸ یا ۸ بهمن**
    match = text.match(/(\d{4})?\s*([\u0600-\u06FF]+)\s*(\d{1,2})/);
    if (match && persianMonths[match[2]]) {
        year = match[1] || currentYear;
        month = persianMonths[match[2]];
        day = match[3].padStart(2, "0");
        return `${year}/${month}/${day}`;
    }

    // **حالت ۱۴۰۳ ۸ بهمن یا ۸ بهمن**
    match = text.match(/(\d{4})?\s*(\d{1,2})\s*([\u0600-\u06FF]+)/);
    if (match && persianMonths[match[3]]) {
        year = match[1] || currentYear;
        day = match[2].padStart(2, "0");
        month = persianMonths[match[3]];
        return `${year}/${month}/${day}`;
    }

    // اگر هیچ فرمت معتبری نبود، مقدار اصلی را برگردان
    return text;
}

function extractPrice(text) {
    const units = {
        "میلیارد": 1_000_000_000,
        "میلیون": 1_000_000,
        "هزار": 1_000
    };

    let price = 0;
    let temp = 0;
    let words = text.split(/ و |\s+/).filter(w => w); // جداسازی کلمات
    console.log(words);
    let isToman = /تومان/.test(text); // بررسی واحد قیمت
    let isRial = /ریال/.test(text); // بررسی واحد ریال

    // ابتدا تبدیل اعداد فارسی به انگلیسی
    words = words.map(word => convertPersianToEnglishNumbers(word));

    // پردازش کلمات و اعداد
    words.forEach(word => {
        if (!isNaN(word)) {
            temp += parseInt(word); // اگر عدد بود، اضافه کن
        } else if (units[word]) {
            temp *= units[word]; // اگر واحد بود، مقدار قبلی را در واحد ضرب کن
            price += temp;
            temp = 0;
        } else {
            let num = wordsToNumbers(word); // تبدیل عدد به حروف
            if (num !== null) temp += num;
        }
    });

    price += temp;

    // اگر واحد "ریال" بود، تبدیل به تومان کنیم
    if (isRial) {
        price = Math.floor(price / 10); // تبدیل ریال به تومان
    }

    // اگر هیچ واحدی ذکر نشد، پیش‌فرض به تومان حساب کنیم
    if (!isToman && !isRial) {
        price = price; // در اینجا هیچ تغییرات دیگری انجام نمی‌دهیم
    }

    return price > 0 ? price.toLocaleString("en-US") : "0"; // اگر قیمت صفر بود، "0" را نمایش بده
}


function levenshteinDistance(s1, s2) {
    if (s1.length === 0) return s2.length;
    if (s2.length === 0) return s1.length;

    let matrix = [];

    for (let i = 0; i <= s2.length; i++) {
        matrix[i] = [i];
    }
    for (let j = 0; j <= s1.length; j++) {
        matrix[0][j] = j;
    }

    for (let i = 1; i <= s2.length; i++) {
        for (let j = 1; j <= s1.length; j++) {
            if (s2.charAt(i - 1) === s1.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1, // Substitution
                    Math.min(matrix[i][j - 1] + 1, // Insertion
                        matrix[i - 1][j] + 1) // Deletion
                );
            }
        }
    }

    return matrix[s2.length][s1.length];
}

function convertPersianToEnglishNumbers(text) {
    const persianDigits = "۰۱۲۳۴۵۶۷۸۹";  // Persian digits
    const englishDigits = "0123456789";  // English digits

    return text.replace(/[۰-۹]/g, (digit) =>
        englishDigits[persianDigits.indexOf(digit)]
    );
}

function wordsToNumbers(word) {
    const numWords = {
        "یک": 1, "دو": 2, "سه": 3, "چهار": 4, "پنج": 5, "شش": 6, "هفت": 7, "هشت": 8, "نه": 9, "ده": 10,
        "یازده": 11, "دوازده": 12, "سیزده": 13, "چهارده": 14, "پانزده": 15, "شانزده": 16, "هفده": 17,
        "هجده": 18, "نوزده": 19, "بیست": 20, "سی": 30, "چهل": 40, "پنجاه": 50, "شصت": 60, "هفتاد": 70,
        "هشتاد": 80, "نود": 90, "صد": 100, "هزار": 1000, "میلیون": 1000000, "میلیارد": 1000000000
    };

    return numWords[word] || null;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = "fa-IR";
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.maxAlternatives = 10;

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    processCommand(transcript);
    recognition.stop();
  };

  recognition.onerror = (event) => {
    if (event.error.includes("not-allowed"))
      alert("دسترسی به میکروفن وجود ندارد یا دسترسی مسدود شده است.");
    else
      console.error("Speech recognition error:", event.error);
  };

  recognition.onend = () => {
    console.log("Speech recognition ended.");
  };

  recognition.start();
  console.log("Listening...");
};

export default VoiceButton;
