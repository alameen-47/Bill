import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LANGUAGE_STORAGE_KEY = '@app_language';

// Supported languages
export const languages = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', flag: '🇮🇳' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', flag: '🇮🇳' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', flag: '🇧🇩' },
];

// Translations
const translations = {
  en: {
    // Navigation
    home: 'Home',
    newBill: 'New Bill',
    allBills: 'All Bills',
    products: 'Products',
    reports: 'Reports',
    settings: 'Settings',
    profile: 'Profile',

    // Home Screen
    search: 'Search',
    noBillsYet: 'No bills yet',
    printBillToSee: 'Print a bill to see it here',
    last5Bills: 'Recent Bills',

    // Bill
    billNumber: 'Bill Number',
    date: 'Date',
    time: 'Time',
    items: 'Items',
    subtotal: 'SubTotal',
    tax: 'Tax',
    discount: 'Discount',
    grandTotal: 'Grand Total',
    paymentMethod: 'Payment Method',
    cash: 'Cash',
    card: 'Card',
    upi: 'UPI',
    other: 'Other',

    // Receipt
    receipt: 'Receipt',
    printReceipt: 'Print Receipt',
    printerNotConnected: 'Printer not connected',
    applyDiscount: 'Apply Discount',
    selectPaymentMethod: 'Select Payment Method',
    taxIncluded: 'Tax Included',
    taxExcluded: 'Tax Excluded',
    thankYou: 'Thank you for shopping!',
    pleaseVisitAgain: 'Please visit again!',

    // Reports
    salesReport: 'Sales Report',
    totalSales: 'Total Sales',
    totalBills: 'Total Bills',
    averageBill: 'Avg. Bill',
    daily: 'Daily',
    monthly: 'Monthly',
    yearly: 'Yearly',
    last7DaysSales: 'Last 7 Days Sales',
    last6MonthsSales: 'Last 6 Months Sales',
    yearlySalesDistribution: 'Yearly Sales Distribution',
    recentBills: 'Recent Bills',

    // All Bills
    allBillsTitle: 'All Bills',
    filterByDate: 'Filter by Date',
    quickSelect: 'Quick Select',
    customRange: 'Custom Range',
    fromDate: 'From Date',
    toDate: 'To Date',
    today: 'Today',
    yesterday: 'Yesterday',
    last7Days: 'Last 7 Days',
    last30Days: 'Last 30 Days',
    thisMonth: 'This Month',
    lastMonth: 'Last Month',
    apply: 'Apply',
    clearAll: 'Clear All',
    cancel: 'Cancel',
    clearFilters: 'Clear filters',
    noBillsFound: 'No bills found',

    // Settings
    userInformation: 'USER INFORMATION',
    printerStatus: 'PRINTER STATUS',
    bluetoothDevices: 'BLUETOOTH DEVICES',
    language: 'Language',
    selectLanguage: 'Select Language',
    scanForDevices: 'Scan for Devices',
    scanning: 'Scanning...',
    testPrint: 'Test Print',
    disconnect: 'Disconnect',
    logout: 'Logout',
    connected: 'Connected',

    // Products
    addProduct: 'Add Product',
    productName: 'Product Name',
    price: 'Price',
    category: 'Category',
    save: 'Save',

    // Common
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    done: 'Done',
    error: 'Error',
    success: 'Success',
    loading: 'Loading...',
  },

  ar: {
    // Navigation
    home: 'الرئيسية',
    newBill: 'فاتورة جديدة',
    allBills: 'جميع الفواتير',
    products: 'المنتجات',
    reports: 'التقارير',
    settings: 'الإعدادات',
    profile: 'الملف الشخصي',

    // Home Screen
    search: 'بحث',
    noBillsYet: 'لا توجد فواتير بعد',
    printBillToSee: 'اطبع فاتورة لرؤيتها هنا',
    last5Bills: 'الفواتير الأخيرة',

    // Bill
    billNumber: 'رقم الفاتورة',
    date: 'التاريخ',
    time: 'الوقت',
    items: 'المنتجات',
    subtotal: 'المجموع الفرعي',
    tax: 'الضريبة',
    discount: 'الخصم',
    grandTotal: 'المجموع الكلي',
    paymentMethod: 'طريقة الدفع',
    cash: 'نقدي',
    card: 'بطاقة',
    upi: 'UPI',
    other: 'أخرى',

    // Receipt
    receipt: 'الإيصال',
    printReceipt: 'طباعة الإيصال',
    printerNotConnected: 'الطابعة غير متصلة',
    applyDiscount: 'تطبيق الخصم',
    selectPaymentMethod: 'اختر طريقة الدفع',
    taxIncluded: 'شامل الضريبة',
    taxExcluded: 'غير شامل الضريبة',
    thankYou: 'شكراً لتسوقك معنا!',
    pleaseVisitAgain: 'نرجو زيارتنا مرة أخرى!',
    // Reports
    salesReport: 'تقرير المبيعات',
    totalSales: 'إجمالي المبيعات',
    totalBills: 'إجمالي الفواتير',
    averageBill: 'متوسط الفاتورة',
    daily: 'يومي',
    monthly: 'شهري',
    yearly: 'سنوي',
    last7DaysSales: 'مبيعات آخر 7 أيام',
    last6MonthsSales: 'مبيعات آخر 6 أشهر',
    yearlySalesDistribution: 'توزيع المبيعات السنوي',
    recentBills: 'الفواتير الأخيرة',

    // All Bills
    allBillsTitle: 'جميع الفواتير',
    filterByDate: 'تصفية حسب التاريخ',
    quickSelect: 'اختيار سريع',
    customRange: 'نطاق مخصص',
    fromDate: 'من تاريخ',
    toDate: 'إلى تاريخ',
    today: 'اليوم',
    yesterday: 'أمس',
    last7Days: 'آخر 7 أيام',
    last30Days: 'آخر 30 يوم',
    thisMonth: 'هذا الشهر',
    lastMonth: 'الشهر الماضي',
    apply: 'تطبيق',
    clearAll: 'مسح الكل',
    cancel: 'إلغاء',
    clearFilters: 'مسح الفلاتر',
    noBillsFound: 'لم يتم العثور على فواتير',

    // Settings
    userInformation: 'معلومات المستخدم',
    printerStatus: 'حالة الطابعة',
    bluetoothDevices: 'أجهزة البلوتوث',
    language: 'اللغة',
    selectLanguage: 'اختر اللغة',
    scanForDevices: 'البحث عن الأجهزة',
    scanning: 'جاري البحث...',
    testPrint: 'اختبار الطباعة',
    disconnect: 'قطع الاتصال',
    logout: 'تسجيل الخروج',
    connected: 'متصل',

    // Products
    addProduct: 'إضافة منتج',
    productName: 'اسم المنتج',
    price: 'السعر',
    category: 'الفئة',
    save: 'حفظ',

    // Common
    save: 'حفظ',
    cancel: 'إلغاء',
    delete: 'حذف',
    edit: 'تعديل',
    done: 'تم',
    error: 'خطأ',
    success: 'نجاح',
    loading: 'جاري التحميل...',
  },

  hi: {
    // Navigation
    home: 'होम',
    newBill: 'नया बिल',
    allBills: 'सभी बिल',
    products: 'उत्पाद',
    reports: 'रिपोर्ट',
    settings: 'सेटिंग्स',
    profile: 'प्रोफाइल',

    // Home Screen
    search: 'खोजें',
    noBillsYet: 'अभी तक कोई बिल नहीं',
    printBillToSee: 'यहां देखने के लिए बिल प्रिंट करें',
    recentBills: 'हाल के बिल',

    // Bill
    billNumber: 'बिल नंबर',
    date: 'तारीख',
    time: 'समय',
    items: 'आइटम',
    subtotal: 'उप-योग',
    tax: 'कर',
    discount: 'छूट',
    grandTotal: 'कुल योग',
    paymentMethod: 'भुगतान तरीका',
    cash: 'कैश',
    card: 'कार्ड',
    upi: 'UPI',
    other: 'अन्य',

    // Receipt
    receipt: 'रसीद',
    printReceipt: 'रसीद प्रिंट करें',
    printerNotConnected: 'प्रिंटर कनेक्ट नहीं है',
    applyDiscount: 'छूट लागू करें',
    selectPaymentMethod: 'भुगतान तरीका चुनें',
    taxIncluded: 'कर सहित',
    taxExcluded: 'कर बिना',
    thankYou: 'खरीदारी के लिए धन्यवाद!',
    pleaseVisitAgain: 'कृपया फिर से आएं!',

    // Reports
    salesReport: 'बिक्री रिपोर्ट',
    totalSales: 'कुल बिक्री',
    totalBills: 'कुल बिल',
    averageBill: 'औसत बिल',
    daily: 'दैनिक',
    monthly: 'मासिक',
    yearly: 'वार्षिक',
    last7DaysSales: 'पिछले 7 दिन की बिक्री',
    last6MonthsSales: 'पिछले 6 महीने की बिक्री',
    yearlySalesDistribution: 'वार्षिक बिक्री वितरण',
    recentBills: 'हाल के बिल',

    // All Bills
    allBillsTitle: 'सभी बिल',
    filterByDate: 'तारीख से फ़िल्टर करें',
    quickSelect: 'त्वरित चयन',
    customRange: 'कस्टम रेंज',
    fromDate: 'प्रारंभ तिथि',
    toDate: 'अंतिम तिथि',
    today: 'आज',
    yesterday: 'कल',
    last7Days: 'पिछले 7 दिन',
    last30Days: 'पिछले 30 दिन',
    thisMonth: 'इस महीने',
    lastMonth: 'पिछला महीना',
    apply: 'लागू करें',
    clearAll: 'सभी साफ़ करें',
    cancel: 'रद्द करें',
    clearFilters: 'फ़िल्टर साफ़ करें',
    noBillsFound: 'कोई बिल नहीं मिला',

    // Settings
    userInformation: 'उपयोगकर्ता जानकारी',
    printerStatus: 'प्रिंटर स्थिति',
    bluetoothDevices: 'ब्लूटूथ उपकरण',
    language: 'भाषा',
    selectLanguage: 'भाषा चुनें',
    scanForDevices: 'उपकरण खोजें',
    scanning: 'खोज रहा है...',
    testPrint: 'टेस्ट प्रिंट',
    disconnect: 'डिस्कनेक्ट',
    logout: 'लॉगआउट',
    connected: 'कनेक्टेड',

    // Products
    addProduct: 'उत्पाद जोड़ें',
    productName: 'उत्पाद का नाम',
    price: 'कीमत',
    category: 'श्रेणी',
    save: 'सहेजें',

    // Common
    save: 'सहेजें',
    cancel: 'रद्द करें',
    delete: 'हटाएं',
    edit: 'संपादित करें',
    done: 'हो गया',
    error: 'त्रुटि',
    success: 'सफलता',
    loading: 'लोड हो रहा है...',
  },

  ml: {
    // Navigation
    home: 'ഹോം',
    newBill: 'പുതിയ ബില്ല്',
    allBills: 'എല്ലാ ബില്ലുകളും',
    products: 'ഉത്പന്നങ്ങൾ',
    reports: 'റിപ്പോര്‍ട്ടുകൾ',
    settings: 'സജ്ജീകരണങ്ങൾ',
    profile: 'പ്രൊഫൈല്‍',

    // Home Screen
    search: 'തിരയുക',
    noBillsYet: 'ഇതുവരെ ബില്ലുകളില്ല',
    printBillToSee: 'ഇവിടെ കാണാന്‍ ബില്ല് പ്രിന്റ് ചെയ്യുക',
    recentBills: 'അടുത്ത ബില്ലുകൾ',

    // Bill
    billNumber: 'ബില്ല് നമ്പര്‍',
    date: 'തീയതി',
    time: 'സമയം',
    items: 'ഇനങ്ങള്‍',
    subtotal: 'ഉപതുക്കം',
    tax: 'നികുതി',
    discount: 'ഇളവ്',
    grandTotal: 'ആകെ തുക',
    paymentMethod: 'പണമടക്കൽ രീതി',
    cash: 'പണം',
    card: 'കാര്‍ഡ്',
    upi: 'UPI',
    other: 'മറ്റുള്ളവ',

    // Receipt
    receipt: 'രസീത്',
    printReceipt: 'രസീത് പ്രിന്റ് ചെയ്യുക',
    printerNotConnected: 'പ്രിന്ററിന് കണക്ഷനില്ല',
    applyDiscount: 'ഇളവ് ബാധകമാക്കുക',
    selectPaymentMethod: 'പണമടക്കൽ രീതി തിരഞ്ഞെടുക്കുക',
    taxIncluded: 'നികുതി ഉൾപ്പെടുത്തി',
    taxExcluded: 'നികുതിയില്ല',
    thankYou: 'ഷോപ്പിങ്ങിന് നന്ദി!',
    pleaseVisitAgain: 'ദയവായി വീണ്ടും വരുക!',

    // Reports
    salesReport: 'വിൽപ്പന റിപ്പോർട്ട്',
    totalSales: 'ആകെ വില്‍പന',
    totalBills: 'ആകെ ബില്ലുകള്‍',
    averageBill: 'ശരാശരി ബില്ല്',
    daily: 'ദിവസേന',
    monthly: 'മാസിക',
    yearly: 'വാര്‍ഷിക',
    last7DaysSales: 'കഴിഞ്ഞ 7 ദിവസങ്ങളിലെ വില്‍പന',
    last6MonthsSales: 'കഴിഞ്ഞ 6 മാസങ്ങളിലെ വില്‍പന',
    yearlySalesDistribution: 'വാര്‍ഷിക വില്‍പന വിതരണം',
    recentBills: 'അടുത്ത ബില്ലുകൾ',

    // All Bills
    allBillsTitle: 'എല്ലാ ബില്ലുകളും',
    filterByDate: 'തീയതി അനുസരിച്ച് ഫില്‍റ്റര്‍ ചെയ്യുക',
    quickSelect: 'വേഗത്തില്‍ തിരഞ്ഞെടുക്കുക',
    customRange: 'ഇഷ്ടപ്പടിക്കപ്പെട്ട ശ്രേണി',
    fromDate: 'തുടങ്ങുന്ന തീയതി',
    toDate: 'അവസാന തീയതി',
    today: 'ഇന്ന്',
    yesterday: 'ഇന്നലെ',
    last7Days: 'കഴിഞ്ഞ 7 ദിവസങ്ങള്‍',
    last30Days: 'കഴിഞ്ഞ 30 ദിവസങ്ങള്‍',
    thisMonth: 'ഈ മാസം',
    lastMonth: 'കഴിഞ്ഞ മാസം',
    apply: 'ബാധകമാക്കുക',
    clearAll: 'എല്ലാം മായ്ക്കുക',
    cancel: 'റദ്ദാക്കുക',
    clearFilters: 'ഫില്‍റ്ററുകൾ മായ്ക്കുക',
    noBillsFound: 'ബില്ലുകള്‍ കണ്ടില്ല',

    // Settings
    userInformation: 'ഉപയോക്താവിന്റെ വിവരങ്ങൾ',
    printerStatus: 'പ്രിന്ററിന്റെ അവസ്ഥ',
    bluetoothDevices: 'ബ്ലൂടൂത്ത് ഉപകരണങ്ങള്‍',
    language: 'ഭാഷ',
    selectLanguage: 'ഭാഷ തിരഞ്ഞെടുക്കുക',
    scanForDevices: 'ഉപകരണങ്ങള്‍ തിരയുക',
    scanning: 'തിരയുന്നു...',
    testPrint: 'ടെസ്റ്റ് പ്രിന്റ്',
    disconnect: 'വിട്ടുമാറുക',
    logout: 'ലോഗ്ഔട്ട്',
    connected: 'കണക്റ്റഡ്',

    // Products
    addProduct: 'ഉത്പന്നം ചേര്‍ക്കുക',
    productName: 'ഉത്പന്നത്തിന്റെ പേര്',
    price: 'വില',
    category: 'വിഭാഗം',
    save: 'സംരക്ഷിക്കുക',

    // Common
    save: 'സംരക്ഷിക്കുക',
    cancel: 'റദ്ദാക്കുക',
    delete: 'മായ്ക്കുക',
    edit: 'തിരുത്തുക',
    done: 'ചെയ്തു',
    error: 'പിഴവ്',
    success: 'വിജയം',
    loading: 'ലോഡിങ്...',
  },

  ta: {
    // Navigation
    home: 'முகப்பு',
    newBill: 'புதிய பில்',
    allBills: 'அனைத்து மதிப்புகள்',
    products: 'தயாரிப்புகள்',
    reports: 'அறிக்கைகள்',
    settings: 'அமைப்புகள்',
    profile: 'சுயவிவரம்',

    // Home Screen
    search: 'தேடு',
    noBillsYet: 'இன்னும் மதிப்புகள் இல்லை',
    printBillToSee: 'இதைப் பார்க்க மதிப்பை அச்சிடவும்',
    recentBills: 'சமீபத்திய மதிப்புகள்',

    // Bill
    billNumber: 'மதிப்பு எண்',
    date: 'தேதி',
    time: 'நேரம்',
    items: 'பொருட்கள்',
    subtotal: 'துணை மொத்தம்',
    tax: 'வரி',
    discount: 'தள்ளுபடி',
    grandTotal: 'மொத்தம்',
    paymentMethod: 'பணம் செலுத்தும் முறை',
    cash: 'பணம்',
    card: 'கார்டு',
    upi: 'UPI',
    other: 'மற்றவை',

    // Receipt
    receipt: 'ரசீது',
    printReceipt: 'ரசீதை அச்சிடு',
    printerNotConnected: 'பிரிண்டர் இணைக்கப்படவில்லை',
    applyDiscount: 'தள்ளுபடி விண்ணப்பி',
    selectPaymentMethod: 'பணம் செலுத்தும் முறையைத் தேர்வுசெய்',
    taxIncluded: 'வரி சேர்க்கப்பட்டது',
    taxExcluded: 'வரி இல்லை',
    thankYou: 'ஷாப்பிங்கிற்கு நன்றி!',
    pleaseVisitAgain: 'மீண்டும் வருக!',

    // Reports
    salesReport: 'விற்பனை அறிக்கை',
    totalSales: 'மொத்த விற்பனை',
    totalBills: 'மொத்த மதிப்புகள்',
    averageBill: 'சராசரி மதிப்பு',
    daily: 'தினசரி',
    monthly: 'மாதாந்திர',
    yearly: 'வருடாந்திர',
    last7DaysSales: 'கடந்த 7 நாட்கள் விற்பனை',
    last6MonthsSales: 'கடந்த 6 மாதங்கள் விற்பனை',
    yearlySalesDistribution: 'வருடாந்திர விற்பனை பகிர்வு',
    recentBills: 'சமீபத்திய மதிப்புகள்',

    // All Bills
    allBillsTitle: 'அனைத்து மதிப்புகள்',
    filterByDate: 'தேதியால் வடிகட்டு',
    quickSelect: 'விரைவு தேர்வு',
    customRange: 'தனிப்பட்ட வரம்பு',
    fromDate: 'தொடக்க தேதி',
    toDate: 'முடிவு தேதி',
    today: 'இன்று',
    yesterday: 'நேற்று',
    last7Days: 'கடந்த 7 நாட்கள்',
    last30Days: 'கடந்த 30 நாட்கள்',
    thisMonth: 'இந்த மாதம்',
    lastMonth: 'கடந்த மாதம்',
    apply: 'விண்ணப்பி',
    clearAll: 'அனைத்தையும் அழி',
    cancel: 'ரத்துசெய்',
    clearFilters: 'வடிப்பான்களை அழி',
    noBillsFound: 'மதிப்புகள் கிடைக்கவில்லை',

    // Settings
    userInformation: 'பயனர் தகவல்',
    printerStatus: 'பிரிண்டர் நிலை',
    bluetoothDevices: 'புளூடூத் சாதனங்கள்',
    language: 'மொழி',
    selectLanguage: 'மொழியைத் தேர்வுசெய்',
    scanForDevices: 'சாதனங்களைத் தேடு',
    scanning: 'தேடுகிறது...',
    testPrint: 'சோதனை அச்சு',
    disconnect: 'துணை நீக்கு',
    logout: 'வெளியேறு',
    connected: 'இணைக்கப்பட்ட',

    // Products
    addProduct: 'தயாரிப்பு சேர்',
    productName: 'தயாரிப்பு பெயர்',
    price: 'விலை',
    category: 'வகை',
    save: 'சேமி',

    // Common
    save: 'சேமி',
    cancel: 'ரத்துசெய்',
    delete: 'நீக்கு',
    edit: 'திருத்து',
    done: 'முடிந்தது',
    error: 'பிழை',
    success: 'வெற்றி',
    loading: 'ஏற்றுகிறது...',
  },

  te: {
    home: 'హోమ్',
    newBill: 'కొత్త బిల్',
    allBills: 'అన్ని బిల్లులు',
    products: 'ఉత్పత్తులు',
    reports: 'నివేదికలు',
    settings: 'సెట్టింగ్‌లు',
    profile: 'ప్రొఫైల్',

    search: 'శోధించు',
    noBillsYet: 'ఇంకా బిల్లులు లేవు',
    printBillToSee: 'ఇక్కడ చూడటానికి బిల్ ముద్రించండి',
    recentBills: 'ఇటీవలి బిల్లులు',

    billNumber: 'బిల్ నంబర్',
    date: 'తేదీ',
    time: 'సమయం',
    items: 'అంశాలు',
    subtotal: 'ఉప మొత్తం',
    tax: 'పన్ను',
    discount: 'డిస్కౌంట్',
    grandTotal: 'మొత్తం',
    paymentMethod: 'చెల్లింపు విధానం',
    cash: 'నగదు',
    card: 'కార్డు',
    upi: 'UPI',
    other: 'ఇతర',

    receipt: 'రసీదు',
    printReceipt: 'రసీదు ముద్రించు',
    printerNotConnected: 'ప్రింటర్ కనెక్ట్ కాలేదు',
    applyDiscount: 'డిస్కౌంట్ వర్తించు',
    selectPaymentMethod: 'చెల్లింపు విధానం ఎంచుకోండి',
    taxIncluded: 'Tax Included (Telugu)',
    taxExcluded: 'Tax Excluded (Telugu)',
    thankYou: 'కొనుగోలు చేసినందుకు ధన్యవాదాలు!',
    pleaseVisitAgain: 'మళ్లీ విచ్చేయండి!',

    salesReport: 'అమ్మకాల నివేదిక',
    totalSales: 'మొత్తం అమ్మకాలు',
    totalBills: 'మొత్తం బిల్లులు',
    averageBill: 'సగటు బిల్',
    daily: 'రోజువారీ',
    monthly: 'మాసిక',
    yearly: 'వార్షిక',
    last7DaysSales: 'గత 7 రోజుల అమ్మకాలు',
    last6MonthsSales: 'గత 6 నెలల అమ్మకాలు',
    yearlySalesDistribution: 'వార్షిక అమ్మకాల పంపిణీ',
    recentBills: 'ఇటీవలి బిల్లులు',

    allBillsTitle: 'అన్ని బిల్లులు',
    filterByDate: 'తేదీ ద్వారా ఫిల్టర్ చేయండి',
    quickSelect: 'త్వరిత ఎంపిక',
    customRange: 'అనుకూల శ్రేణి',
    fromDate: 'ప్రారంభ తేదీ',
    toDate: 'ముగింపు తేదీ',
    today: 'ఈ రోజు',
    yesterday: 'నిన్న',
    last7Days: 'గత 7 రోజులు',
    last30Days: 'గత 30 రోజులు',
    thisMonth: 'ఈ నెల',
    lastMonth: 'గత నెల',
    apply: 'వర్తించు',
    clearAll: 'అన్నీ క్లియర్ చేయండి',
    cancel: 'రద్దు',
    clearFilters: 'ఫిల్టర్ తొలగించు',
    noBillsFound: 'బిల్లులు కనబడలేదు',

    userInformation: 'వినియోగదారు సమాచారం',
    printerStatus: 'ప్రింటర్ స్థితి',
    bluetoothDevices: 'బ్లూటూత్ పరికరాలు',
    language: 'భాష',
    selectLanguage: 'భాష ఎంచుకోండి',
    scanForDevices: 'పరికరాలు స్కాన్ చేయండి',
    scanning: 'స్కాన్ అవుతోంది...',
    testPrint: 'టెస్ట్ ప్రింట్',
    disconnect: 'డిస్కనెక్ట్',
    logout: 'లాగౌట్',
    connected: 'కనెక్ట్ అయింది',

    addProduct: 'ఉత్పత్తి జోడించు',
    productName: 'ఉత్పత్తి పేరు',
    price: 'ధర',
    category: 'వర్గం',
    save: 'సేవ్',

    delete: 'తొలగించు',
    edit: 'సవరించు',
    done: 'పూర్తయింది',
    error: 'లోపం',
    success: 'విజయం',
    loading: 'లోడ్ అవుతోంది...',
  },

  bn: {
    // Navigation
    home: 'হোম',
    newBill: 'নতুন বিল',
    allBills: 'সব বিল',
    products: 'প্রোডাক্ট',
    reports: 'রিপোর্ট',
    settings: 'সেটিংস',
    profile: 'প্রোফাইল',

    // Home Screen
    search: 'খুঁজুন',
    noBillsYet: 'এখনও কোন বিল নেই',
    printBillToSee: 'এটা দেখতে বিল প্রিন্ট করুন',
    recentBills: 'সাম্প্রতিক বিল',

    // Bill
    billNumber: 'বিল নম্বর',
    date: 'তারিখ',
    time: 'সময়',
    items: 'আইটেম',
    subtotal: 'উপমোট',
    tax: 'কর',
    discount: 'ছাড়',
    grandTotal: 'মোট',
    paymentMethod: 'পেমেন্ট মেথড',
    cash: 'ক্যাশ',
    card: 'কার্ড',
    upi: 'UPI',
    other: 'অন্য',

    // Receipt
    receipt: 'রসিদ',
    printReceipt: 'রসিদ প্রিন্ট',
    printerNotConnected: 'প্রিন্টার কানেক্টেড নেই',
    applyDiscount: 'ছাড় প্রয়োগ',
    selectPaymentMethod: 'পেমেন্ট মেথড নির্বাচন',
    taxIncluded: 'कर সহ',
    taxExcluded: 'कर ছাড়া',
    thankYou: 'কেনাকাটার জন্য ধন্যবাদ!',
    pleaseVisitAgain: 'আবার আসুন!',

    // Reports
    salesReport: 'বিক্রয় রিপোর্ট',
    totalSales: 'মোট বিক্রয়',
    totalBills: 'মোট বিল',
    averageBill: 'গড় বিল',
    daily: 'দৈনিক',
    monthly: 'মাসিক',
    yearly: 'বার্ষিক',
    last7DaysSales: 'গত ৭ দিনের বিক্রয়',
    last6MonthsSales: 'গত ৬ মাসের বিক্রয়',
    yearlySalesDistribution: 'বার্ষিক বিক্রয় বিভাজন',
    recentBills: 'সাম্প্রতিক বিল',

    // All Bills
    allBillsTitle: 'সব বিল',
    filterByDate: 'তারিখ অনুযায়ী ফিল্টার',
    quickSelect: 'দ্রুত নির্বাচন',
    customRange: 'কাস্টম রেঞ্জ',
    fromDate: 'শুরু তারিখ',
    toDate: 'শেষ তারিখ',
    today: 'আজ',
    yesterday: 'গতকাল',
    last7Days: 'গত ৭ দিন',
    last30Days: 'গত ৩০ দিন',
    thisMonth: 'এই মাস',
    lastMonth: 'গত মাস',
    apply: 'প্রয়োগ',
    clearAll: 'সব মুছুন',
    cancel: 'বাতিল',
    clearFilters: 'ফিল্টার মুছুন',
    noBillsFound: 'কোন বিল পাওয়া যায়নি',

    // Settings
    userInformation: 'ব্যবহারকারী তথ্য',
    printerStatus: 'প্রিন্টার স্ট্যাটাস',
    bluetoothDevices: 'ব্লুটুথ ডিভাইস',
    language: 'ভাষা',
    selectLanguage: 'ভাষা নির্বাচন',
    scanForDevices: 'ডিভাইস খুঁজুন',
    scanning: 'খুঁজছে...',
    testPrint: 'টেস্ট প্রিন্ট',
    disconnect: 'বিচ্ছিন্ন',
    logout: 'লগআউট',
    connected: 'সংযুক্ত',

    // Products
    addProduct: 'প্রোডাক্ট যোগ',
    productName: 'প্রোডাক্ট নাম',
    price: 'দাম',
    category: 'ক্যাটাগরি',
    save: 'সংরক্ষণ',

    // Common
    save: 'সংরক্ষণ',
    cancel: 'বাতিল',
    delete: 'মুছুন',
    edit: 'সম্পাদনা',
    done: 'হয়েছে',
    error: 'ত্রুটি',
    success: 'সফল',
    loading: 'লোড হচ্ছে...',
  },
  kn: {
    // Navigation
    home: 'ಮುಖಪುಟ',
    newBill: 'ಹೊಸ ಬಿಲ್',
    allBills: 'ಎಲ್ಲಾ ಬಿಲ್‌ಗಳು',
    products: 'ಉತ್ಪನ್ನಗಳು',
    reports: 'ವರದಿಗಳು',
    settings: 'ಸೆಟ್ಟಿಂಗ್‌ಗಳು',
    profile: 'ಪ್ರೊಫೈಲ್',

    // Home Screen
    search: 'ಹುಡುಕು',
    noBillsYet: 'ಇನ್ನೂ ಯಾವುದೇ ಬಿಲ್‌ಗಳು ಇಲ್ಲ',
    printBillToSee: 'ಇಲ್ಲಿ ನೋಡಲು ಒಂದು ಬಿಲ್ ಮುದ್ರಿಸಿ',
    last5Bills: 'ಇತ್ತೀಚಿನ ಬಿಲ್‌ಗಳು',

    // Bill
    billNumber: 'ಬಿಲ್ ಸಂಖ್ಯೆ',
    date: 'ದಿನಾಂಕ',
    time: 'ಸಮಯ',
    items: 'ವಸ್ತುಗಳು',
    subtotal: 'ಉಪಮೊತ್ತ',
    tax: 'ತೆರಿಗೆ',
    discount: 'ರಿಯಾಯಿತಿ',
    grandTotal: 'ಒಟ್ಟು ಮೊತ್ತ',
    paymentMethod: 'ಪಾವತಿ ವಿಧಾನ',
    cash: 'ನಗದು',
    card: 'ಕಾರ್ಡ್',
    upi: 'ಯುಪಿಐ',
    other: 'ಇತರೆ',

    // Receipt
    receipt: 'ರಸೀದಿ',
    printReceipt: 'ರಸೀದಿ ಮುದ್ರಿಸಿ',
    printerNotConnected: 'ಪ್ರಿಂಟರ್ ಸಂಪರ್ಕಗೊಂಡಿಲ್ಲ',
    applyDiscount: 'ರಿಯಾಯಿತಿ ಅನ್ವಯಿಸಿ',
    selectPaymentMethod: 'ಪಾವತಿ ವಿಧಾನವನ್ನು ಆಯ್ಕೆಮಾಡಿ',
    taxIncluded: 'Tax Included (Kannada)',
    taxExcluded: 'Tax Excluded (Kannada)',
    thankYou: 'ಖರೀದಿಗೆ ಧನ್ಯವಾದಗಳು!',
    pleaseVisitAgain: 'ಮತ್ತೆ ಭೇಟಿ ನೀಡಿ!',

    // Reports
    salesReport: 'ಮಾರಾಟ ವರದಿ',
    totalSales: 'ಒಟ್ಟು ಮಾರಾಟ',
    totalBills: 'ಒಟ್ಟು ಬಿಲ್‌ಗಳು',
    averageBill: 'ಸರಾಸರಿ ಬಿಲ್',
    daily: 'ದೈನಂದಿನ',
    monthly: 'ಮಾಸಿಕ',
    yearly: 'ವಾರ್ಷಿಕ',
    last7DaysSales: 'ಕಳೆದ 7 ದಿನಗಳ ಮಾರಾಟ',
    last6MonthsSales: 'ಕಳೆದ 6 ತಿಂಗಳ ಮಾರಾಟ',
    yearlySalesDistribution: 'ವಾರ್ಷಿಕ ಮಾರಾಟ ಹಂಚಿಕೆ',
    recentBills: 'ಇತ್ತೀಚಿನ ಬಿಲ್‌ಗಳು',

    // All Bills
    allBillsTitle: 'ಎಲ್ಲಾ ಬಿಲ್‌ಗಳು',
    filterByDate: 'ದಿನಾಂಕದ ಮೂಲಕ ಫಿಲ್ಟರ್ ಮಾಡಿ',
    quickSelect: 'ತ್ವರಿತ ಆಯ್ಕೆ',
    customRange: 'ಕಸ್ಟಮ್ ಶ್ರೇಣಿ',
    fromDate: 'ಪ್ರಾರಂಭ ದಿನಾಂಕ',
    toDate: 'ಕೊನೆಯ ದಿನಾಂಕ',
    today: 'ಇಂದು',
    yesterday: 'ನಿನ್ನೆ',
    last7Days: 'ಕಳೆದ 7 ದಿನಗಳು',
    last30Days: 'ಕಳೆದ 30 ದಿನಗಳು',
    thisMonth: 'ಈ ತಿಂಗಳು',
    lastMonth: 'ಕಳೆದ ತಿಂಗಳು',
    apply: 'ಅನ್ವಯಿಸಿ',
    clearAll: 'ಎಲ್ಲವನ್ನೂ ತೆರವುಗೊಳಿಸಿ',
    cancel: 'ರದ್ದುಮಾಡಿ',
    clearFilters: 'ಫಿಲ್ಟರ್‌ಗಳನ್ನು ತೆರವುಗೊಳಿಸಿ',
    noBillsFound: 'ಯಾವುದೇ ಬಿಲ್‌ಗಳು ಕಂಡುಬಂದಿಲ್ಲ',

    // Settings
    userInformation: 'ಬಳಕೆದಾರರ ಮಾಹಿತಿ',
    printerStatus: 'ಪ್ರಿಂಟರ್ ಸ್ಥಿತಿ',
    bluetoothDevices: 'ಬ್ಲೂಟೂತ್ ಸಾಧನಗಳು',
    language: 'ಭಾಷೆ',
    selectLanguage: 'ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ',
    scanForDevices: 'ಸಾಧನಗಳನ್ನು ಹುಡುಕಿ',
    scanning: 'ಹುಡುಕಲಾಗುತ್ತಿದೆ...',
    testPrint: 'ಪರೀಕ್ಷಾ ಮುದ್ರಣ',
    disconnect: 'ಸಂಪರ್ಕ ಕಡಿತಗೊಳಿಸಿ',
    logout: 'ಲಾಗ್ ಔಟ್',
    connected: 'ಸಂಪರ್ಕಗೊಂಡಿದೆ',

    // Products
    addProduct: 'ಉತ್ಪನ್ನವನ್ನು ಸೇರಿಸಿ',
    productName: 'ಉತ್ಪನ್ನದ ಹೆಸರು',
    price: 'ಬೆಲೆ',
    category: 'ವರ್ಗ',
    save: 'ಉಳಿಸಿ',

    // Common
    save: 'ಉಳಿಸಿ',
    cancel: 'ರದ್ದುಮಾಡಿ',
    delete: 'ಅಳಿಸಿ',
    edit: 'ತಿದ್ದು',
    done: 'ಮುಗಿದಿದೆ',
    error: 'ದೋಷ',
    success: 'ಯಶಸ್ಸು',
    loading: 'ಲೋಡ್ ಆಗುತ್ತಿದೆ...',
  },
};

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState('en');

  // Load saved language on mount
  useEffect(() => {
    loadSavedLanguage();
  }, []);

  const loadSavedLanguage = async () => {
    try {
      const savedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (savedLanguage && translations[savedLanguage]) {
        setCurrentLanguage(savedLanguage);
      }
    } catch (error) {
      console.log('Error loading language:', error);
    }
  };

  const changeLanguage = async languageCode => {
    try {
      await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, languageCode);
      setCurrentLanguage(languageCode);
    } catch (error) {
      console.log('Error saving language:', error);
    }
  };

  // Translation function
  const t = key => {
    const langTranslations =
      translations[currentLanguage] || translations['en'];
    return langTranslations[key] || translations['en'][key] || key;
  };

  // Get current language object
  const getCurrentLanguage = () => {
    return languages.find(l => l.code === currentLanguage) || languages[0];
  };

  return (
    <LanguageContext.Provider
      value={{
        currentLanguage,
        changeLanguage,
        t,
        getCurrentLanguage,
        languages,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
