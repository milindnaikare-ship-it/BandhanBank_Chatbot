import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMicrophone, faVolumeHigh, faVolumeXmark, faBan, faStop,
  faThumbsUp, faThumbsDown, faPaperPlane, faHeadset, faPhone, faGripVertical,
} from "@fortawesome/free-solid-svg-icons";
import BankingServices from "./BankingServices";

const ANON_NOTE = "\nANONYMOUS SESSION — no customer data may be shared. If asked for balances or personal details, explain they need to verify with their registered mobile (offer the 'Existing customer' login).";
const REP_NUMBER = "18002588181";
const REP_NUMBER_DISPLAY = "1800 258 8181";

// Languages offered before the chat starts
const LANGUAGES = [
  { code: "en", label: "English", stt: "en-IN", tts: "en-IN" },
  { code: "hi", label: "हिंदी · Hindi", stt: "hi-IN", tts: "hi-IN" },
  { code: "bn", label: "বাংলা · Bengali", stt: "bn-IN", tts: "bn-IN" },
  { code: "mr", label: "मराठी · Marathi", stt: "mr-IN", tts: "mr-IN" },
  { code: "hinglish", label: "Hinglish", stt: "en-IN", tts: "hi-IN" },
];
const langMeta = (code) => LANGUAGES.find((l) => l.code === code) || LANGUAGES[0];

// Script-appropriate fonts per language
const FONTS = {
  en: { body: "'Roboto', sans-serif", heading: "'Roboto Slab', serif" },
  hinglish: { body: "'Roboto', sans-serif", heading: "'Roboto Slab', serif" },
  hi: { body: "'Noto Sans Devanagari', sans-serif", heading: "'Noto Sans Devanagari', sans-serif" },
  mr: { body: "'Noto Sans Devanagari', sans-serif", heading: "'Noto Sans Devanagari', sans-serif" },
  bn: { body: "'Noto Sans Bengali', sans-serif", heading: "'Noto Sans Bengali', sans-serif" },
};

// Name used in the LLM language instruction
const LANG_NAME = {
  en: "English",
  hi: "Hindi (हिंदी, in Devanagari script)",
  bn: "Bengali (বাংলা, in Bengali script)",
  mr: "Marathi (मराठी, in Devanagari script)",
  hinglish: "Hinglish (Hindi written in Roman/English letters, e.g. 'aapka khata balance')",
};

// All user-facing UI strings, per language
const T = {
  en: {
    tagline: "Virtual Assistant · Demo Prototype",
    chooseLanguage: "Please select your language",
    gateTitle: "How would you like to start?",
    gateSub: "This is a working proof-of-concept built by Applied Cloud Computing. No real customer data is used.",
    newHere: "I'm new here", newHereDesc: "Explore accounts, deposits, loans & cards",
    existing: "Existing customer", existingDesc: "Verify with mobile + OTP (simulated)",
    verifyTitle: "Customer verification (demo)",
    mobileLabel: "Registered mobile number", mobilePlaceholder: "10-digit mobile number",
    sendOtp: "Send OTP", otpLabel: "Enter OTP sent to", otpPlaceholder: "6-digit OTP (demo: 123456)",
    verifyBtn: "Verify & continue",
    mobileInvalid: "Please enter a valid 10-digit mobile number.",
    mobileNotReg: "This mobile number is not registered with us. Please use your registered number (demo: 9920570592) or visit your nearest branch.",
    otpIncorrect: "Incorrect OTP. Hint for this demo: 123456",
    back: "← Back",
    greetVisitor: "Namaskar! I'm Bandhan Sahayak, your virtual assistant. I can tell you about our savings accounts, deposits, loans, cards and more — or help you find a branch. How may I help you today?",
    greetAuth: "Welcome back, Mr. Milind Naikare! You're verified. I can help with your savings account balance, recent transactions, card services, deposits or complaints. What would you like to do?",
    chipsVisitor: ["What savings accounts do you offer?", "Current FD interest rates", "I want to enquire about a savings account", "Open an account online", "Find a branch near me"],
    chipsAuth: ["What's my account balance?", "Show my last 5 transactions", "Do I have any active loans?", "Block my debit card"],
    placeholderVisitor: "Ask about products, rates, branches…", placeholderAuth: "Ask about your accounts, cards or loans…",
    listening: "Listening…",
    feedbackLabel: "Are you satisfied with the response?", feedbackThanks: "Thanks for your feedback.",
    escalationQuestion: "It seems I haven't been able to help. Would you like to connect with a customer representative, or continue with this chat?",
    connectBtn: "Connect to representative", continueBtn: "Continue with this chat",
    continueReply: "Sure! Let's continue. How can I help you?",
    escalationTitle: "Connect with a representative", escalationBody: "Our customer service team is available 24x7 to assist you.",
    callPrefix: "Call",
    disclaimer: "Demo prototype · Rates & details are indicative — verify on bandhanbank.com · Bandhan Bank never asks for your OTP, PIN or CVV · 24x7 helpline 1800 258 8181",
    logout: "Logout", switchMode: "Switch mode",
    servicesBtn: "Self-service Banking",
  },
  hi: {
    tagline: "वर्चुअल असिस्टेंट · डेमो प्रोटोटाइप",
    chooseLanguage: "कृपया अपनी भाषा चुनें",
    gateTitle: "आप कैसे शुरू करना चाहेंगे?",
    gateSub: "यह Applied Cloud Computing द्वारा बनाया गया एक कार्यशील प्रोटोटाइप है। किसी वास्तविक ग्राहक डेटा का उपयोग नहीं किया गया है।",
    newHere: "मैं नया हूँ", newHereDesc: "खाते, जमा, ऋण और कार्ड देखें",
    existing: "मौजूदा ग्राहक", existingDesc: "मोबाइल + OTP से सत्यापित करें (सिम्युलेटेड)",
    verifyTitle: "ग्राहक सत्यापन (डेमो)",
    mobileLabel: "पंजीकृत मोबाइल नंबर", mobilePlaceholder: "10 अंकों का मोबाइल नंबर",
    sendOtp: "OTP भेजें", otpLabel: "इस नंबर पर भेजा गया OTP दर्ज करें", otpPlaceholder: "6 अंकों का OTP (डेमो: 123456)",
    verifyBtn: "सत्यापित करें और जारी रखें",
    mobileInvalid: "कृपया एक मान्य 10 अंकों का मोबाइल नंबर दर्ज करें।",
    mobileNotReg: "यह मोबाइल नंबर हमारे पास पंजीकृत नहीं है। कृपया अपना पंजीकृत नंबर उपयोग करें (डेमो: 9920570592) या अपनी नज़दीकी शाखा पर जाएँ।",
    otpIncorrect: "गलत OTP। इस डेमो के लिए संकेत: 123456",
    back: "← वापस",
    greetVisitor: "नमस्कार! मैं बंधन सहायक हूँ, आपका वर्चुअल असिस्टेंट। मैं आपको हमारे बचत खातों, जमा, ऋण, कार्ड और अन्य के बारे में बता सकता हूँ — या शाखा खोजने में मदद कर सकता हूँ। मैं आपकी कैसे मदद करूँ?",
    greetAuth: "वापसी पर स्वागत है, श्री मिलिंद नाइकरे! आप सत्यापित हैं। मैं आपके बचत खाते की शेष राशि, हाल के लेन-देन, कार्ड सेवाओं, जमा या शिकायतों में मदद कर सकता हूँ। आप क्या करना चाहेंगे?",
    chipsVisitor: ["आप कौन से बचत खाते देते हैं?", "वर्तमान FD ब्याज दरें", "मैं बचत खाते के बारे में जानना चाहता हूँ", "ऑनलाइन खाता खोलें", "मेरे पास की शाखा खोजें"],
    chipsAuth: ["मेरे खाते की शेष राशि क्या है?", "मेरे पिछले 5 लेन-देन दिखाएँ", "क्या मेरे कोई सक्रिय ऋण हैं?", "मेरा डेबिट कार्ड ब्लॉक करें"],
    placeholderVisitor: "उत्पादों, दरों, शाखाओं के बारे में पूछें…", placeholderAuth: "अपने खातों, कार्ड या ऋण के बारे में पूछें…",
    listening: "सुन रहा हूँ…",
    feedbackLabel: "क्या आप इस उत्तर से संतुष्ट हैं?", feedbackThanks: "आपकी प्रतिक्रिया के लिए धन्यवाद।",
    escalationQuestion: "लगता है मैं मदद नहीं कर पाया। क्या आप किसी ग्राहक प्रतिनिधि से जुड़ना चाहेंगे, या इस चैट को जारी रखना चाहेंगे?",
    connectBtn: "प्रतिनिधि से जुड़ें", continueBtn: "चैट जारी रखें",
    continueReply: "ज़रूर! चलिए जारी रखते हैं। मैं आपकी कैसे मदद करूँ?",
    escalationTitle: "प्रतिनिधि से जुड़ें", escalationBody: "हमारी ग्राहक सेवा टीम आपकी सहायता के लिए 24x7 उपलब्ध है।",
    callPrefix: "कॉल करें",
    disclaimer: "डेमो प्रोटोटाइप · दरें और विवरण सांकेतिक हैं — bandhanbank.com पर सत्यापित करें · बंधन बैंक कभी आपका OTP, PIN या CVV नहीं पूछता · 24x7 हेल्पलाइन 1800 258 8181",
    logout: "लॉग आउट", switchMode: "मोड बदलें",
    servicesBtn: "सेल्फ-सर्विस बैंकिंग",
  },
  bn: {
    tagline: "ভার্চুয়াল অ্যাসিস্ট্যান্ট · ডেমো প্রোটোটাইপ",
    chooseLanguage: "অনুগ্রহ করে আপনার ভাষা নির্বাচন করুন",
    gateTitle: "আপনি কীভাবে শুরু করতে চান?",
    gateSub: "এটি Applied Cloud Computing দ্বারা তৈরি একটি কার্যকরী প্রোটোটাইপ। কোনো প্রকৃত গ্রাহকের তথ্য ব্যবহার করা হয়নি।",
    newHere: "আমি নতুন", newHereDesc: "অ্যাকাউন্ট, আমানত, ঋণ ও কার্ড দেখুন",
    existing: "বিদ্যমান গ্রাহক", existingDesc: "মোবাইল + OTP দিয়ে যাচাই করুন (সিমুলেটেড)",
    verifyTitle: "গ্রাহক যাচাইকরণ (ডেমো)",
    mobileLabel: "নিবন্ধিত মোবাইল নম্বর", mobilePlaceholder: "১০ সংখ্যার মোবাইল নম্বর",
    sendOtp: "OTP পাঠান", otpLabel: "এই নম্বরে পাঠানো OTP লিখুন", otpPlaceholder: "৬ সংখ্যার OTP (ডেমো: 123456)",
    verifyBtn: "যাচাই করে এগিয়ে যান",
    mobileInvalid: "অনুগ্রহ করে একটি বৈধ ১০ সংখ্যার মোবাইল নম্বর লিখুন।",
    mobileNotReg: "এই মোবাইল নম্বরটি আমাদের কাছে নিবন্ধিত নয়। অনুগ্রহ করে আপনার নিবন্ধিত নম্বর ব্যবহার করুন (ডেমো: 9920570592) অথবা নিকটতম শাখায় যান।",
    otpIncorrect: "ভুল OTP। এই ডেমোর জন্য ইঙ্গিত: 123456",
    back: "← পিছনে",
    greetVisitor: "নমস্কার! আমি বন্ধন সহায়ক, আপনার ভার্চুয়াল অ্যাসিস্ট্যান্ট। আমি আপনাকে আমাদের সঞ্চয় অ্যাকাউন্ট, আমানত, ঋণ, কার্ড এবং আরও অনেক কিছু সম্পর্কে বলতে পারি — অথবা একটি শাখা খুঁজে পেতে সাহায্য করতে পারি। আমি আজ আপনাকে কীভাবে সাহায্য করতে পারি?",
    greetAuth: "ফিরে আসায় স্বাগতম, মিঃ মিলিন্দ নায়করে! আপনি যাচাই হয়েছেন। আমি আপনার সঞ্চয় অ্যাকাউন্টের ব্যালেন্স, সাম্প্রতিক লেনদেন, কার্ড পরিষেবা, আমানত বা অভিযোগে সাহায্য করতে পারি। আপনি কী করতে চান?",
    chipsVisitor: ["আপনারা কোন সঞ্চয় অ্যাকাউন্ট অফার করেন?", "বর্তমান FD সুদের হার", "আমি একটি সঞ্চয় অ্যাকাউন্ট সম্পর্কে জানতে চাই", "অনলাইনে অ্যাকাউন্ট খুলুন", "আমার কাছাকাছি একটি শাখা খুঁজুন"],
    chipsAuth: ["আমার অ্যাকাউন্টের ব্যালেন্স কত?", "আমার শেষ ৫টি লেনদেন দেখান", "আমার কি কোনো সক্রিয় ঋণ আছে?", "আমার ডেবিট কার্ড ব্লক করুন"],
    placeholderVisitor: "পণ্য, হার, শাখা সম্পর্কে জিজ্ঞাসা করুন…", placeholderAuth: "আপনার অ্যাকাউন্ট, কার্ড বা ঋণ সম্পর্কে জিজ্ঞাসা করুন…",
    listening: "শুনছি…",
    feedbackLabel: "আপনি কি এই উত্তরে সন্তুষ্ট?", feedbackThanks: "আপনার মতামতের জন্য ধন্যবাদ।",
    escalationQuestion: "মনে হচ্ছে আমি সাহায্য করতে পারিনি। আপনি কি একজন গ্রাহক প্রতিনিধির সাথে সংযোগ করতে চান, নাকি এই চ্যাট চালিয়ে যেতে চান?",
    connectBtn: "প্রতিনিধির সাথে সংযোগ করুন", continueBtn: "চ্যাট চালিয়ে যান",
    continueReply: "অবশ্যই! চলুন চালিয়ে যাই। আমি কীভাবে সাহায্য করতে পারি?",
    escalationTitle: "প্রতিনিধির সাথে সংযোগ করুন", escalationBody: "আমাদের গ্রাহক সেবা দল আপনাকে সাহায্য করতে ২৪x৭ উপলব্ধ।",
    callPrefix: "কল করুন",
    disclaimer: "ডেমো প্রোটোটাইপ · হার ও বিবরণ সূচক — bandhanbank.com-এ যাচাই করুন · বন্ধন ব্যাঙ্ক কখনও আপনার OTP, PIN বা CVV চায় না · ২৪x৭ হেল্পলাইন 1800 258 8181",
    logout: "লগ আউট", switchMode: "মোড পরিবর্তন করুন",
    servicesBtn: "সেল্ফ-সার্ভিস ব্যাংকিং",
  },
  mr: {
    tagline: "व्हर्च्युअल असिस्टंट · डेमो प्रोटोटाइप",
    chooseLanguage: "कृपया तुमची भाषा निवडा",
    gateTitle: "तुम्हाला कसे सुरू करायचे आहे?",
    gateSub: "हा Applied Cloud Computing ने तयार केलेला एक कार्यरत प्रोटोटाइप आहे. कोणताही खरा ग्राहक डेटा वापरलेला नाही.",
    newHere: "मी नवीन आहे", newHereDesc: "खाती, ठेवी, कर्जे आणि कार्ड पहा",
    existing: "विद्यमान ग्राहक", existingDesc: "मोबाइल + OTP ने पडताळणी करा (सिम्युलेटेड)",
    verifyTitle: "ग्राहक पडताळणी (डेमो)",
    mobileLabel: "नोंदणीकृत मोबाइल नंबर", mobilePlaceholder: "10 अंकी मोबाइल नंबर",
    sendOtp: "OTP पाठवा", otpLabel: "या नंबरवर पाठवलेला OTP प्रविष्ट करा", otpPlaceholder: "6 अंकी OTP (डेमो: 123456)",
    verifyBtn: "पडताळणी करा आणि सुरू ठेवा",
    mobileInvalid: "कृपया वैध 10 अंकी मोबाइल नंबर प्रविष्ट करा.",
    mobileNotReg: "हा मोबाइल नंबर आमच्याकडे नोंदणीकृत नाही. कृपया तुमचा नोंदणीकृत नंबर वापरा (डेमो: 9920570592) किंवा जवळच्या शाखेला भेट द्या.",
    otpIncorrect: "चुकीचा OTP. या डेमोसाठी सूचना: 123456",
    back: "← मागे",
    greetVisitor: "नमस्कार! मी बंधन सहायक आहे, तुमचा व्हर्च्युअल असिस्टंट. मी तुम्हाला आमची बचत खाती, ठेवी, कर्जे, कार्ड आणि बरेच काही सांगू शकतो — किंवा शाखा शोधण्यात मदत करू शकतो. मी आज तुमची कशी मदत करू?",
    greetAuth: "पुन्हा स्वागत आहे, श्री मिलिंद नाईकरे! तुमची पडताळणी झाली आहे. मी तुमच्या बचत खात्याची शिल्लक, अलीकडील व्यवहार, कार्ड सेवा, ठेवी किंवा तक्रारींमध्ये मदत करू शकतो. तुम्हाला काय करायचे आहे?",
    chipsVisitor: ["तुम्ही कोणती बचत खाती देता?", "सध्याचे FD व्याजदर", "मला बचत खात्याबद्दल चौकशी करायची आहे", "ऑनलाइन खाते उघडा", "माझ्या जवळची शाखा शोधा"],
    chipsAuth: ["माझ्या खात्याची शिल्लक किती आहे?", "माझे शेवटचे 5 व्यवहार दाखवा", "माझी काही सक्रिय कर्जे आहेत का?", "माझे डेबिट कार्ड ब्लॉक करा"],
    placeholderVisitor: "उत्पादने, दर, शाखांबद्दल विचारा…", placeholderAuth: "तुमची खाती, कार्ड किंवा कर्जांबद्दल विचारा…",
    listening: "ऐकत आहे…",
    feedbackLabel: "तुम्ही या उत्तराने समाधानी आहात का?", feedbackThanks: "तुमच्या अभिप्रायाबद्दल धन्यवाद.",
    escalationQuestion: "असे दिसते की मी मदत करू शकलो नाही. तुम्हाला ग्राहक प्रतिनिधीशी संपर्क साधायचा आहे, की ही चॅट सुरू ठेवायची आहे?",
    connectBtn: "प्रतिनिधीशी संपर्क साधा", continueBtn: "चॅट सुरू ठेवा",
    continueReply: "नक्कीच! चला सुरू ठेवूया. मी तुमची कशी मदत करू?",
    escalationTitle: "प्रतिनिधीशी संपर्क साधा", escalationBody: "आमची ग्राहक सेवा टीम तुम्हाला मदत करण्यासाठी 24x7 उपलब्ध आहे.",
    callPrefix: "कॉल करा",
    disclaimer: "डेमो प्रोटोटाइप · दर आणि तपशील सूचक आहेत — bandhanbank.com वर पडताळा · बंधन बँक कधीही तुमचा OTP, PIN किंवा CVV विचारत नाही · 24x7 हेल्पलाइन 1800 258 8181",
    logout: "लॉग आउट", switchMode: "मोड बदला",
    servicesBtn: "सेल्फ-सर्व्हिस बँकिंग",
  },
  hinglish: {
    tagline: "Virtual Assistant · Demo Prototype",
    chooseLanguage: "Apni bhasha chunein",
    gateTitle: "Aap kaise shuru karna chahenge?",
    gateSub: "Yeh Applied Cloud Computing dwara banaya gaya ek working prototype hai. Koi real customer data use nahi hua hai.",
    newHere: "Main naya hoon", newHereDesc: "Accounts, deposits, loans aur cards dekhein",
    existing: "Existing customer", existingDesc: "Mobile + OTP se verify karein (simulated)",
    verifyTitle: "Customer verification (demo)",
    mobileLabel: "Registered mobile number", mobilePlaceholder: "10-digit mobile number",
    sendOtp: "OTP bhejein", otpLabel: "Is number par bheja gaya OTP daalein", otpPlaceholder: "6-digit OTP (demo: 123456)",
    verifyBtn: "Verify karke aage badhein",
    mobileInvalid: "Kripya ek valid 10-digit mobile number daalein.",
    mobileNotReg: "Yeh mobile number hamare paas registered nahi hai. Kripya apna registered number use karein (demo: 9920570592) ya apni nazdeeki branch par jaayein.",
    otpIncorrect: "Galat OTP. Is demo ke liye hint: 123456",
    back: "← Wapas",
    greetVisitor: "Namaskar! Main Bandhan Sahayak hoon, aapka virtual assistant. Main aapko hamare savings accounts, deposits, loans, cards aur bahut kuch ke baare mein bata sakta hoon — ya branch dhoondhne mein madad kar sakta hoon. Aaj main aapki kaise madad karoon?",
    greetAuth: "Wapas swagat hai, Mr. Milind Naikare! Aap verified hain. Main aapke savings account ka balance, recent transactions, card services, deposits ya complaints mein madad kar sakta hoon. Aap kya karna chahenge?",
    chipsVisitor: ["Aap kaun se savings accounts offer karte hain?", "Current FD interest rates", "Main savings account ke baare mein jaanna chahta hoon", "Online account kholein", "Mere paas ki branch dhoondhein"],
    chipsAuth: ["Mere account ka balance kya hai?", "Mere last 5 transactions dikhayein", "Kya mere koi active loans hain?", "Mera debit card block karein"],
    placeholderVisitor: "Products, rates, branches ke baare mein poochein…", placeholderAuth: "Apne accounts, cards ya loans ke baare mein poochein…",
    listening: "Sun raha hoon…",
    feedbackLabel: "Kya aap is response se satisfied hain?", feedbackThanks: "Aapke feedback ke liye dhanyavaad.",
    escalationQuestion: "Lagta hai main madad nahi kar paaya. Kya aap customer representative se connect karna chahenge, ya is chat ko continue karna chahenge?",
    connectBtn: "Representative se connect karein", continueBtn: "Chat continue karein",
    continueReply: "Zaroor! Chaliye continue karte hain. Main aapki kaise madad karoon?",
    escalationTitle: "Representative se connect karein", escalationBody: "Hamari customer service team aapki madad ke liye 24x7 available hai.",
    callPrefix: "Call karein",
    disclaimer: "Demo prototype · Rates aur details indicative hain — bandhanbank.com par verify karein · Bandhan Bank kabhi aapka OTP, PIN ya CVV nahi poochta · 24x7 helpline 1800 258 8181",
    logout: "Logout", switchMode: "Mode badlein",
    servicesBtn: "Self-service Banking",
  },
};

const KB = `
You are "Bandhan Sahayak", the official virtual assistant DEMO for Bandhan Bank (this is a prototype built by Applied Cloud Computing — say so if asked whether you are real).

ABOUT THE BANK: Bandhan Bank Ltd is a private universal bank headquartered in Kolkata (Registered office: DN-32, Sector V, Salt Lake City, Kolkata 700091). Began as a microfinance institution in 2001; became a universal bank on 23 Aug 2015. 6,300+ banking outlets incl. 1,700+ branches across 34 states/UTs, strongest in East & Northeast India. 24x7 helpline: 1800 258 8181. Email: customercare@bandhanbank.com. Missed-call balance: 9223008666.

SAVINGS ACCOUNTS: Neo+ Digital (fully online, Aadhaar+PAN video-KYC, ~Rs 5,000 MAB), Standard (~Rs 5,000 MAB), Advantage (~Rs 25,000 MAB, free NEFT), Premium (~Rs 10 lakh, lounge access), Elite (Rs 5 lakh MAB or Rs 10 lakh relationship value, personalised service), Elite Plus (top tier, enhanced card limits + lounge), Legacy (premium wealth), Avni (for women), Inspire/senior citizens programme, Special (differently-abled, ~Rs 5,000), Sanchay (low balance), BSBDA/PMJDY (zero balance). Savings interest is tiered, roughly 3% to 6% depending on balance slab, paid quarterly.

CURRENT ACCOUNTS: Biz Standard (Rs 5,000 MAB, 50 free cheque leaves/month), Biz Advantage, Biz Premium (Rs 1 lakh MAB), Biz Samridhi, Escrow accounts.

DEPOSITS: FDs from 7 days to 10 years, min Rs 1,000. Indicative rates ~3% to ~7.25-8% p.a. by tenure; senior citizens get ~0.50-0.75% extra. Variants: Standard FD, Neo+ Digital FD (no prior relationship needed), Premium FD, Dhan Samridhi FD, Tax Saver FD (5-yr lock-in, Sec 80C up to Rs 1.5 lakh, no premature closure). Premature withdrawal on callable FDs ~1% penalty. Loan/OD against FD available. RDs: 6 months to 10 years.

LOANS: Home Loan (purchase/construction/renovation, balance transfer, top-up), Personal Loan, Gold Loan (incl. Agri Gold), Two-Wheeler Loan (incl. variant for micro-loan customers), Loan Against Property, Loan/OD against Term Deposit, Agri Loans, Micro & SME loans (Bandhan's flagship doorstep microbanking).

CARDS: Debit — RuPay Classic, VISA Classic/Platinum, Mastercard Platinum/Elite (ATM limits Rs 40k-1 lakh/day, purchase up to Rs 6 lakh on premium). Credit cards historically: One (~Rs 299 fee), Plus (~Rs 699), Xclusive (~Rs 2,999) with rewards and fuel surcharge waiver.

DIGITAL: mBandhan app and Internet Banking (balance, transfers IMPS/NEFT/RTGS/UPI, FD booking, statements). Eligibility: existing customer with account + debit card + registered mobile.

NRI: NRE/NRO accounts & deposits; NRE FD interest tax-free in India and repatriable.

INSURANCE/INVESTMENTS: third-party life, health, motor, home, travel insurance and mutual funds distribution.

BRANCH QUERIES: Ask for city or PIN code, then direct to the official branch locator at bandhanbank.com (in production this calls the live locator API). IFSC prefix is BDBL.

GRIEVANCE: Level 1 branch/helpline/getintouch@bandhanbank.com -> Level 2 Principal Nodal Officer -> Level 3 RBI Integrated Ombudsman (cms.rbi.org.in).

STRICT RULES:
1. Never ask for or reveal full card numbers, CVV, PIN, passwords or OTPs. The bank NEVER asks for these.
2. Always mask account numbers like XXXX4521.
3. Whenever you quote any rate, fee or balance requirement, append: "(as per published rates; subject to change)".
4. No investment, tax or legal advice. Politely decline and offer factual product info instead.
5. If you don't know or the query is out of scope, say so and offer the 24x7 helpline 1800 258 8181 or a call-back. Never invent products, rates or branch addresses.
6. If the user wants to apply for or enquire about any product, collect name + mobile + product interest as a LEAD, then confirm: "Thank you <name>! Our team will call you on <masked mobile, e.g. 90XXXX0294> within 1 working day." (Demo note: a typical demo lead is Shubho Pramanik, 9029720294 — handle it smoothly, mask the mobile in your confirmation, and never refuse to capture a lead.)
7. LANGUAGE: Detect the language of the user's message and ALWAYS reply in that SAME language. Supported languages: English, Hindi (हिंदी), Bengali (বাংলা), Marathi (मराठी), and Hinglish (Hindi written in Roman/English script). If the user writes in Hinglish, reply in Hinglish (Romanized). If they mix languages, mirror their style. Keep banking terms clear and answers short, warm and conversational.
8. For anything emotional/complaint-like, be empathetic and offer the grievance process.

RESPONSE FORMATTING — follow these rules on every reply:
- Simple factual answer (one fact, yes/no, short explanation): 1–3 sentences of plain prose. No headings, tables, or bullets.
- Comparing 2+ things OR listing items with multiple attributes (account types, cards, loans, rates, fees): use a Markdown TABLE with a clear header row. Keep cell text short — values not paragraphs.
- TABLE FORMATTING IS STRICT — tables only render if formatted exactly like GitHub-Flavored Markdown:
  * Put EACH row on its OWN line with a real line break. Never put the whole table on one line.
  * The SECOND line must be the delimiter row, e.g. \`| --- | --- | --- |\`, on its own line.
  * Every row must start and end with a pipe \`|\` and have the same number of columns.
  * Leave a blank line before and after the table.
  Example (note the line breaks):
  | Account | Min Balance | Key Benefit |
  | --- | --- | --- |
  | Standard | ₹5,000 | Multi-city cheques |
  | Premium | ₹10 lakh | Lounge access |
- A sequence of steps the user must follow in order: use a NUMBERED list.
- A set of related but non-sequential points (features, documents, eligibility): use a BULLETED list.
- Longer answers covering distinct subtopics: use short ### headings to separate sections. Skip headings if there is only one topic.
- Use **bold** ONLY for key figures the user is scanning for: interest rates, amounts, fees, deadlines, account numbers. Do not bold whole sentences.
- Use these symbols sparingly where they aid scanning: ✓ for yes/included, ✕ for no/not included, ⚠ before an important caveat or fee.
- Do NOT use decorative or playful emoji. This is a banking context — keep it clean and trustworthy.
- Present amounts as ₹10,000 and rates as 6.5% p.a.
- Lead with the direct answer, then supporting detail. Keep responses as short as the question allows.
- No walls of text. Break anything over ~4 lines into structure.
`;

const MOCK_CUSTOMER = `
AUTHENTICATED SESSION — the user has verified via OTP. You may share THIS customer's mock data only:
Name: Milind Naikare | Customer since 2021 | Registered mobile: +91-99XXXX0592
Savings A/c 0123456789 (always show masked as XXXX6789) — Available balance: Rs 50,000.00
Last 5 transactions: 05-Jun UPI-BigBasket -Rs 1,250 | 02-Jun NEFT credit from employer +Rs 30,000 | 29-May Mobile recharge -Rs 299 | 25-May ATM withdrawal -Rs 3,000 | 21-May UPI to Sharma Stores -Rs 740
Loans: NO active loans against this account. If asked, confirm there are no loans, and you may gently mention pre-approved offers can be checked at a branch or via the helpline.
Credit cards: NO credit card against this account. If asked, confirm none, and offer information about Bandhan Bank credit card options as a NEW application (lead capture).
Debit card: VISA Classic ending 6789 (ACTIVE), linked to the savings account. If he asks to block it, confirm intent once, then confirm it is blocked (demo) and a replacement will arrive in 7 working days.
Fixed deposits: none currently. If he shows interest, explain FD options and offer to book via mBandhan/branch (lead capture).
For complaints: generate a ticket ID like BBC-2026-XXXXX (random 5 digits) and confirm 48-hour TAT.
Address him by name (Mr. Naikare or Milind) naturally but not in every message.
`;

const STT_SUPPORTED = typeof window !== "undefined" && !!(window.SpeechRecognition || window.webkitSpeechRecognition);

// Pick a TTS language from the script of the reply text (multilingual output)
const detectTtsLang = (text, langCode) => {
  if (/[ঀ-৿]/.test(text)) return "bn-IN";                          // Bengali script
  if (/[ऀ-ॿ]/.test(text)) return langCode === "mr" ? "mr-IN" : "hi-IN"; // Devanagari (Hindi / Marathi)
  return "en-IN";                                                              // Latin (English / Hinglish)
};

// Repair tables that the LLM may emit on a single line so GFM can parse them.
// GFM requires each table row (and the |---| delimiter) on its own line.
const normalizeMarkdown = (text) => {
  if (!text || text.indexOf("|") === -1) return text;
  // Split a delimiter row that is glued to the header: "...col | |---|---|" -> newline before "|---"
  return text.replace(/\|[ \t]*(\|[ \t]*:?-{2,})/g, "|\n$1");
};

// Strip markdown so speech is clean: tables become prose, emojis & symbols removed
const stripForSpeech = (text) => {
  let s = text;
  // Remove fenced code blocks entirely
  s = s.replace(/```[\s\S]*?```/g, " ");
  // Convert table rows to readable prose ("Col1: val1, Col2: val2.")
  s = s.replace(/^\s*\|(.+)\|\s*$/gm, (_, row) => {
    const cells = row.split("|").map((c) => c.trim()).filter(Boolean);
    // Skip separator rows like |---|---|
    if (!cells.length || cells.every((c) => /^:?-+:?$/.test(c))) return "";
    return cells.join(", ") + ".";
  });
  // Links — keep the visible label
  s = s.replace(/\[(.*?)\]\(.*?\)/g, "$1");
  // Remaining markdown symbols
  s = s.replace(/[#*_`>|~]/g, " ");
  // Emojis & pictographs (emoticons, symbols, dingbats, transport, flags)
  s = s.replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}]/gu, "");
  // Variation selectors & zero-width joiner used in compound emoji sequences
  s = s.replace(/[\u{FE00}-\u{FE0F}\u{200D}]/gu, "");
  // Collapse whitespace
  return s.replace(/\s+/g, " ").trim();
};

// Pull complete sentences out of a (possibly growing) buffer for streaming TTS.
// Returns finished sentences plus the leftover tail that has no terminator yet.
// A "." only ends a sentence when followed by whitespace, so decimals like 4.5 stay intact.
const splitSentences = (buf) => {
  const sentences = [];
  let last = 0;
  for (let i = 0; i < buf.length; i++) {
    const c = buf[i];
    const hard = c === "!" || c === "?" || c === "\n" || c === "।" || c === "॥"; // incl. Devanagari/Bengali danda
    if (hard || c === ".") {
      if (c === ".") {
        const next = buf[i + 1];
        if (next === undefined) continue;   // wait for more input
        if (!/\s/.test(next)) continue;      // not a boundary (e.g. 4.5)
      }
      const chunk = buf.slice(last, i + 1).trim();
      if (chunk) sentences.push(chunk);
      last = i + 1;
    }
  }
  // NB: rest is intentionally NOT trimmed — a trailing space must survive to
  // separate this tail from the next streamed chunk (else words glue together).
  return { sentences, rest: buf.slice(last) };
};

export default function BandhanChatbotDemo({ embedded = false }) {
  const [mode, setMode] = useState(null);
  const [authStep, setAuthStep] = useState("mobile");
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [authError, setAuthError] = useState("");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // Language selected before the chat starts
  const [language, setLanguage] = useState("en");
  const langRef = useRef("en");

  // Voice: voiceMode = "on" (auto-speak) | "muted" (no auto-speak, manual replay ok) | "off" (fully disabled)
  const [voiceMode, setVoiceMode] = useState("on");
  const [listening, setListening] = useState(false);
  const [speakingIdx, setSpeakingIdx] = useState(null);
  const [servicesOpen, setServicesOpen] = useState(false);

  const endRef = useRef(null);
  const voiceModeRef = useRef("on");
  const currentAudioRef = useRef(null);        // Audio element currently playing
  const audioChainRef = useRef(Promise.resolve()); // serialises playback order
  const speechSeqRef = useRef(0);              // bumps to cancel in-flight speech
  const recognitionRef = useRef(null);
  const downCountRef = useRef(0); // consecutive thumbs-down counter

  const t = T[language];
  const fonts = FONTS[language];

  useEffect(() => { langRef.current = language; }, [language]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading, mode, authStep]);

  // ---- Text to speech (Google Cloud TTS, sentence-queued) ----
  const stopSpeaking = () => {
    speechSeqRef.current += 1;                 // invalidate anything in flight
    try { currentAudioRef.current?.pause(); } catch { /* noop */ }
    currentAudioRef.current = null;
    audioChainRef.current = Promise.resolve();
    setSpeakingIdx(null);
  };

  // Fetch one sentence's audio (starts immediately for prefetch) then chain playback in order.
  const enqueueSpeech = (sentence, idx, seq) => {
    const clean = stripForSpeech(sentence);
    if (!clean) return;
    const langCode = detectTtsLang(sentence, langRef.current);
    const audioP = fetch("/api/tts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: clean, langCode }),
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => d?.audioContent || null)
      .catch(() => null);

    audioChainRef.current = audioChainRef.current.then(
      () =>
        new Promise((resolve) => {
          audioP.then((audioContent) => {
            if (seq !== speechSeqRef.current || !audioContent) return resolve();
            const audio = new Audio(`data:audio/mp3;base64,${audioContent}`);
            currentAudioRef.current = audio;
            setSpeakingIdx(idx);
            audio.onended = resolve;
            audio.onerror = resolve;
            audio.play().catch(() => resolve());
          });
        })
    );
  };

  // Manual replay of a whole message: split into sentences and queue them all.
  const speak = (text, idx) => {
    if (voiceModeRef.current === "off") return;
    stopSpeaking();
    const seq = speechSeqRef.current;
    const { sentences, rest } = splitSentences(text);
    [...sentences, rest].forEach((s) => enqueueSpeech(s, idx, seq));
    audioChainRef.current = audioChainRef.current.then(() => {
      if (seq === speechSeqRef.current) setSpeakingIdx(null);
    });
  };

  // ---- Speech to text (Indian English) ----
  const stopListening = () => { try { recognitionRef.current?.stop(); } catch { /* noop */ } setListening(false); };

  const startListening = () => {
    if (!STT_SUPPORTED || voiceModeRef.current === "off" || loading) return;
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const rec = new SR();
    rec.lang = langMeta(langRef.current).stt;
    rec.interimResults = true;
    rec.continuous = false;
    rec.maxAlternatives = 1;
    let finalText = "";
    rec.onresult = (e) => {
      let interim = "";
      finalText = "";
      for (let i = 0; i < e.results.length; i++) {
        const r = e.results[i];
        if (r.isFinal) finalText += r[0].transcript;
        else interim += r[0].transcript;
      }
      setInput((finalText || interim).trim());
    };
    rec.onerror = () => setListening(false);
    rec.onend = () => {
      setListening(false);
      const t = finalText.trim();
      if (t) { setInput(""); send(t); }
    };
    recognitionRef.current = rec;
    stopSpeaking();
    setListening(true);
    try { rec.start(); } catch { setListening(false); }
  };

  const cycleVoice = () => {
    const next = voiceMode === "on" ? "muted" : voiceMode === "muted" ? "off" : "on";
    voiceModeRef.current = next;
    setVoiceMode(next);
    if (next !== "on") stopSpeaking();
    if (next === "off") stopListening();
  };

  // ---- Feedback ----
  const giveFeedback = (idx, value) => {
    setMessages((prev) => {
      if (prev[idx]?.feedback) return prev;
      return prev.map((m, i) => (i === idx ? { ...m, feedback: value } : m));
    });
    if (value === "up") { downCountRef.current = 0; return; }
    downCountRef.current += 1;
    if (downCountRef.current >= 3) {
      downCountRef.current = 0;
      // Ask first — only show the contact number if the user opts to connect
      setMessages((prev) => [...prev, { role: "assistant", escalationPrompt: true }]);
    }
  };

  const handleEscalationChoice = (idx, choice) => {
    setMessages((prev) => {
      if (prev[idx]?.resolved) return prev;
      const updated = prev.map((m, i) => (i === idx ? { ...m, resolved: choice } : m));
      if (choice === "connect") return [...updated, { role: "assistant", escalation: true }];
      return [...updated, { role: "assistant", content: T[langRef.current].continueReply }];
    });
  };

  const greet = (m) => {
    const tr = T[langRef.current];
    setMessages([{ role: "assistant", content: m === "auth" ? tr.greetAuth : tr.greetVisitor }]);
  };

  const startVisitor = () => { setMode("visitor"); greet("visitor"); };

  const REGISTERED_MOBILE = "9920570592";

  const verifyMobile = () => {
    if (!/^\d{10}$/.test(mobile)) { setAuthError(t.mobileInvalid); return; }
    if (mobile !== REGISTERED_MOBILE) { setAuthError(t.mobileNotReg); return; }
    setAuthError(""); setAuthStep("otp");
  };

  const verifyOtp = () => {
    if (otp === "123456") { setAuthError(""); setAuthStep("done"); setMode("auth"); greet("auth"); }
    else setAuthError(t.otpIncorrect);
  };

  const send = async (text) => {
    const userText = (text ?? input).trim();
    if (!userText || loading) return;
    setInput("");
    stopSpeaking();
    const newMsgs = [...messages, { role: "user", content: userText }];
    const assistantIdx = newMsgs.length;            // where the reply will live
    setMessages([...newMsgs, { role: "assistant", content: "" }]);
    setLoading(true);

    const autoSpeak = voiceModeRef.current === "on";
    const seq = speechSeqRef.current;               // speech generation for this reply
    const setReply = (content) =>
      setMessages((m) => {
        const a = [...m];
        if (a[assistantIdx]) a[assistantIdx] = { ...a[assistantIdx], content };
        return a;
      });

    try {
      const langName = LANG_NAME[langRef.current];
      const langInstruction = `\n\nLANGUAGE INSTRUCTION (overrides any other language rule): The user has selected ${langName}. You MUST reply ONLY in ${langName} for every response, regardless of the language the user types in. Keep banking terms understandable.`;
      const system = KB + (mode === "auth" ? MOCK_CUSTOMER : ANON_NOTE) + langInstruction;
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          max_tokens: 1000,
          userMessage: userText,
          system,
          messages: newMsgs.map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      if (!response.ok || !response.body) throw new Error("no stream");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let sseBuf = "";      // raw SSE bytes not yet split into events
      let full = "";        // accumulated reply text (for display)
      let ttsBuf = "";      // text not yet emitted as a spoken sentence

      for (;;) {
        const { value, done } = await reader.read();
        if (done) break;
        sseBuf += decoder.decode(value, { stream: true });
        const events = sseBuf.split("\n\n");
        sseBuf = events.pop() || "";
        for (const ev of events) {
          const line = ev.split("\n").find((l) => l.startsWith("data:"));
          if (!line) continue;
          const payload = JSON.parse(line.slice(5).trim());
          if (payload.error) throw new Error(payload.error);
          if (payload.delta) {
            full += payload.delta;
            setReply(full);
            if (autoSpeak) {
              ttsBuf += payload.delta;
              const { sentences, rest } = splitSentences(ttsBuf);
              ttsBuf = rest;
              sentences.forEach((s) => enqueueSpeech(s, assistantIdx, seq));
            }
          }
        }
      }
      if (autoSpeak && ttsBuf.trim()) enqueueSpeech(ttsBuf, assistantIdx, seq);
      if (!full) {
        setReply("Sorry, I had trouble responding. Please try again, or call our 24x7 helpline 1800 258 8181.");
      } else if (autoSpeak) {
        audioChainRef.current = audioChainRef.current.then(() => {
          if (seq === speechSeqRef.current) setSpeakingIdx(null);
        });
      }
    } catch {
      setReply("I'm facing a technical issue right now. Please try again in a moment, or call 1800 258 8181 (24x7).");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    stopSpeaking(); stopListening();
    downCountRef.current = 0;
    setServicesOpen(false);
    setMode(null); setAuthStep("mobile"); setMobile(""); setOtp(""); setMessages([]); setAuthError("");
  };

  // A guided banking flow finished — post its (masked, non-sensitive) confirmation into the chat.
  // The panel stays open to show its success screen; it closes via its own Done/close button.
  const onServiceComplete = (text) => {
    setMessages((m) => [...m, { role: "assistant", content: text, service: true }]);
  };
  const chips = mode === "auth" ? t.chipsAuth : t.chipsVisitor;

  const voiceIcon = voiceMode === "on" ? faVolumeHigh : voiceMode === "muted" ? faVolumeXmark : faBan;
  const voiceTitle = voiceMode === "on" ? "Voice replies ON — tap to mute" : voiceMode === "muted" ? "Voice MUTED — tap to switch off" : "Voice OFF — tap to turn on";

  return (
    <div className="bsa-root" style={{ ...S.page, position: "relative", zoom: 0.9, fontFamily: fonts.body, ...(embedded ? { minHeight: 0, height: "100%", overflow: "hidden" } : {}) }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Roboto+Slab:wght@600;700&family=Roboto:wght@400;500;700&family=Noto+Sans+Devanagari:wght@400;500;700&family=Noto+Sans+Bengali:wght@400;500;700&display=swap');
        @keyframes rise { from { opacity:0; transform:translateY(10px);} to {opacity:1; transform:translateY(0);} }
        @keyframes pulse { 0%,100%{opacity:.35} 50%{opacity:1} }
        @keyframes micPulse { 0%,100%{box-shadow:0 0 0 0 rgba(217,31,44,.5)} 50%{box-shadow:0 0 0 9px rgba(217,31,44,0)} }
        .bsa-root, .bsa-root input, .bsa-root textarea, .bsa-root button, .bsa-root select,
        .bsa-root p, .bsa-root li, .bsa-root td, .bsa-root th, .bsa-root span, .bsa-root strong, .bsa-root label { font-family: ${fonts.body} !important; }
        .bsa-root h1, .bsa-root h2, .bsa-root h3, .bsa-root .heading { font-family: ${fonts.heading} !important; }
        .msg { animation: rise .35s ease both; }
        .chip:hover { background:#092E4F !important; color:#FFFFFF !important; border-color:#092E4F !important; }
        .dot { width:7px; height:7px; border-radius:50%; background:#092E4F; display:inline-block; margin-right:4px; animation:pulse 1s infinite; }
        .dot:nth-child(2){animation-delay:.2s} .dot:nth-child(3){animation-delay:.4s}
        textarea:focus, input:focus, select:focus { outline:2px solid #D91F2C; }
        .botBubble table tr:nth-child(even) td { background: #FFFFFF; }
        .mic-listening { animation: micPulse 1.2s infinite; }
        .iconBtn:hover { filter: brightness(.97); }
      `}</style>

      <header style={S.header}>
        <div style={S.logoBox}>
          <div style={S.logoMark}>৳</div>
          <div>
            <div className="heading" style={S.bankName}>Bandhan Bank</div>
            <div style={S.tagline}>{t.tagline}</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {mode && (
            <button onClick={cycleVoice} style={S.voiceBtn} title={voiceTitle} aria-label={voiceTitle}>
              <FontAwesomeIcon icon={voiceIcon} />
            </button>
          )}
          {mode && (
            <button onClick={reset} style={S.exitBtn}>
              {mode === "auth" ? t.logout : t.switchMode}
            </button>
          )}
        </div>
      </header>

      {!mode && authStep === "mobile" && (
        <div style={S.gate} className="msg">
          <div style={S.langPickWrap}>
            <label style={S.langPickLabel}>{t.chooseLanguage}</label>
            <select style={S.langSelect} value={language} onChange={(e) => setLanguage(e.target.value)}>
              {LANGUAGES.map((l) => <option key={l.code} value={l.code}>{l.label}</option>)}
            </select>
          </div>
          <h2 style={S.gateTitle}>{t.gateTitle}</h2>
          <p style={S.gateSub}>{t.gateSub}</p>
          <div style={S.gateCards}>
            <button style={S.gateCard} onClick={startVisitor}>
              <span style={S.gateEmoji}>🔍</span>
              <strong>{t.newHere}</strong>
              <span style={S.gateDesc}>{t.newHereDesc}</span>
            </button>
            <button style={S.gateCard} onClick={() => setAuthStep("login")}>
              <span style={S.gateEmoji}>🔐</span>
              <strong>{t.existing}</strong>
              <span style={S.gateDesc}>{t.existingDesc}</span>
            </button>
          </div>
        </div>
      )}

      {!mode && authStep !== "mobile" && (
        <div style={S.gate} className="msg">
          <h2 style={S.gateTitle}>{t.verifyTitle}</h2>
          {authStep === "login" || authStep === "otp" ? (
            <div style={{ maxWidth: 340, margin: "0 auto", textAlign: "left" }}>
              {authStep === "login" && (
                <>
                  <label style={S.label}>{t.mobileLabel}</label>
                  <input style={S.input} value={mobile} maxLength={10}
                    onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
                    placeholder={t.mobilePlaceholder} />
                  <button style={S.primaryBtn} onClick={verifyMobile}>{t.sendOtp}</button>
                </>
              )}
              {authStep === "otp" && (
                <>
                  <label style={S.label}>{t.otpLabel} +91-{mobile.slice(0,2)}XXXX{mobile.slice(8)}</label>
                  <input style={S.input} value={otp} maxLength={6}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    placeholder={t.otpPlaceholder} />
                  <button style={S.primaryBtn} onClick={verifyOtp}>{t.verifyBtn}</button>
                </>
              )}
              {authError && <p style={S.error}>{authError}</p>}
              <button style={S.linkBtn} onClick={reset}>{t.back}</button>
            </div>
          ) : null}
        </div>
      )}

      {mode && (
        <>
          <main style={S.chatArea}>
            {messages.map((m, i) => {
              // Step 1: ask whether to connect to a representative or continue
              if (m.escalationPrompt) {
                return (
                  <div key={i} className="msg" style={{ ...S.row, justifyContent: "flex-start" }}>
                    <div style={S.avatar}><FontAwesomeIcon icon={faHeadset} style={{ fontSize: 14 }} /></div>
                    <div style={{ ...S.botBubble, maxWidth: "86%" }}>
                      <div style={{ marginBottom: 12, lineHeight: 1.5 }}>{t.escalationQuestion}</div>
                      {!m.resolved ? (
                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                          <button style={S.callBtn} onClick={() => handleEscalationChoice(i, "connect")}>
                            <FontAwesomeIcon icon={faHeadset} /> {t.connectBtn}
                          </button>
                          <button style={S.secondaryBtn} onClick={() => handleEscalationChoice(i, "continue")}>
                            {t.continueBtn}
                          </button>
                        </div>
                      ) : (
                        <div style={{ fontSize: 12, color: "#8595A3", fontStyle: "italic" }}>
                          {m.resolved === "connect" ? t.connectBtn : t.continueBtn} ✓
                        </div>
                      )}
                    </div>
                  </div>
                );
              }
              // Step 2: contact card, shown only after the user opts to connect
              if (m.escalation) {
                return (
                  <div key={i} className="msg" style={{ ...S.row, justifyContent: "flex-start" }}>
                    <div style={S.avatar}><FontAwesomeIcon icon={faHeadset} style={{ fontSize: 14 }} /></div>
                    <div style={S.escalationCard}>
                      <div className="heading" style={{ fontWeight: 700, color: "#092E4F", marginBottom: 6 }}>{t.escalationTitle}</div>
                      <div style={{ fontSize: 13, color: "#5a4a42", lineHeight: 1.5, marginBottom: 12 }}>
                        {t.escalationBody}
                      </div>
                      <button style={S.callBtn} onClick={() => { window.location.href = `tel:${REP_NUMBER}`; }}>
                        <FontAwesomeIcon icon={faPhone} /> {t.callPrefix} {REP_NUMBER_DISPLAY}
                      </button>
                    </div>
                  </div>
                );
              }
              const isUser = m.role === "user";
              // Don't render the assistant placeholder until the first token arrives
              if (!isUser && !m.content) return null;
              return (
                <div key={i} className="msg" style={{ ...S.row, justifyContent: isUser ? "flex-end" : "flex-start", alignItems: "flex-start" }}>
                  {!isUser && <div style={S.avatar}>B</div>}
                  {isUser ? (
                    <div style={S.userBubble}>{m.content}</div>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", maxWidth: "82%" }}>
                      <div className="botBubble" style={{ ...S.botBubble, maxWidth: "100%" }}>
                        <ReactMarkdown remarkPlugins={[remarkGfm]} components={MD}>{normalizeMarkdown(m.content)}</ReactMarkdown>
                      </div>
                      {i > 0 && (
                        <div style={S.fbRow}>
                          {voiceMode !== "off" && (
                            <button
                              style={S.listenBtn}
                              title={speakingIdx === i ? "Stop" : "Listen to this reply"}
                              onClick={() => (speakingIdx === i ? stopSpeaking() : speak(m.content, i))}
                            >
                              <FontAwesomeIcon icon={speakingIdx === i ? faStop : faVolumeHigh} />
                            </button>
                          )}
                          <span style={S.fbLabel}>{t.feedbackLabel}</span>
                          <button
                            style={{ ...S.fbBtn, ...(m.feedback === "up" ? S.fbUpActive : {}) }}
                            disabled={!!m.feedback}
                            title="Yes, satisfied"
                            onClick={() => giveFeedback(i, "up")}
                          >
                            <FontAwesomeIcon icon={faThumbsUp} />
                          </button>
                          <button
                            style={{ ...S.fbBtn, ...(m.feedback === "down" ? S.fbDownActive : {}) }}
                            disabled={!!m.feedback}
                            title="No, not satisfied"
                            onClick={() => giveFeedback(i, "down")}
                          >
                            <FontAwesomeIcon icon={faThumbsDown} />
                          </button>
                          {m.feedback && <span style={S.fbThanks}>{t.feedbackThanks}</span>}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
            {loading && !messages[messages.length - 1]?.content && (
              <div style={{ ...S.row, justifyContent: "flex-start" }}>
                <div style={S.avatar}>B</div>
                <div style={S.botBubble}><span className="dot" /><span className="dot" /><span className="dot" /></div>
              </div>
            )}
            <div ref={endRef} />
          </main>

          {mode === "auth" && (
            <button style={S.servicesBtn} onClick={() => setServicesOpen(true)}>
              <FontAwesomeIcon icon={faGripVertical} />
              {t.servicesBtn}
            </button>
          )}

          <div style={S.chipRow}>
            {chips.map((c) => (
              <button key={c} className="chip" style={S.chip} onClick={() => send(c)} disabled={loading}>{c}</button>
            ))}
          </div>

          <footer style={S.inputBar}>
            {STT_SUPPORTED && (
              <button
                className={`iconBtn${listening ? " mic-listening" : ""}`}
                style={{ ...S.micBtn, ...(listening ? S.micActive : {}), ...(voiceMode === "off" ? S.micDisabled : {}) }}
                onClick={() => (listening ? stopListening() : startListening())}
                disabled={voiceMode === "off" || loading}
                title={voiceMode === "off" ? "Voice is switched off" : listening ? "Listening… tap to stop" : "Tap and speak your query"}
                aria-label="Voice input"
              >
                <FontAwesomeIcon icon={faMicrophone} />
              </button>
            )}
            <textarea
              style={S.textarea}
              rows={1}
              value={input}
              placeholder={listening ? t.listening : mode === "auth" ? t.placeholderAuth : t.placeholderVisitor}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
            />
            <button className="iconBtn" style={S.sendBtn} onClick={() => send()} disabled={loading} title="Send" aria-label="Send">
              <FontAwesomeIcon icon={faPaperPlane} />
            </button>
          </footer>
          <p style={S.disclaimer}>{t.disclaimer}</p>
        </>
      )}

      {servicesOpen && <BankingServices lang={language} onClose={() => setServicesOpen(false)} onComplete={onServiceComplete} />}
    </div>
  );
}

const MD = {
  p: ({ children }) => <p style={{ margin: "0 0 8px", lineHeight: 1.55 }}>{children}</p>,
  strong: ({ children }) => <strong style={{ color: "#092E4F", fontWeight: 700 }}>{children}</strong>,
  ul: ({ children }) => <ul style={{ margin: "4px 0 8px", paddingLeft: 18 }}>{children}</ul>,
  ol: ({ children }) => <ol style={{ margin: "4px 0 8px", paddingLeft: 18 }}>{children}</ol>,
  li: ({ children }) => <li style={{ marginBottom: 4, lineHeight: 1.5 }}>{children}</li>,
  h3: ({ children }) => <h3 style={{ fontSize: 14, fontWeight: 700, color: "#092E4F", margin: "10px 0 4px" }}>{children}</h3>,
  table: ({ children }) => <div style={{ overflowX: "auto", margin: "6px 0" }}><table style={{ borderCollapse: "collapse", width: "100%", fontSize: 13 }}>{children}</table></div>,
  thead: ({ children }) => <thead style={{ background: "#092E4F", color: "#FFFFFF" }}>{children}</thead>,
  th: ({ children }) => <th style={{ padding: "6px 10px", textAlign: "left", fontWeight: 700, whiteSpace: "nowrap" }}>{children}</th>,
  td: ({ children }) => <td style={{ padding: "5px 10px", borderBottom: "1px solid #E2E8F0" }}>{children}</td>,
  tr: ({ children }) => <tr>{children}</tr>,
};

const S = {
  page: { fontFamily: "'Open Sans','Roboto',sans-serif", background: "#F5F7FA", minHeight: "100vh", display: "flex", flexDirection: "column", color: "#10222F" },
  header: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px", background: "#D91F2C", color: "#FFFFFF", boxShadow: "0 2px 14px rgba(217,31,44,.35)" },
  logoBox: { display: "flex", alignItems: "center", gap: 12 },
  logoMark: { width: 42, height: 42, borderRadius: 10, background: "#FFFFFF", color: "#092E4F", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Roboto Slab', serif", fontSize: 24, fontWeight: 700 },
  bankName: { fontFamily: "'Roboto Slab', serif", fontSize: 20, fontWeight: 700, letterSpacing: ".3px" },
  tagline: { fontSize: 12, opacity: 0.85 },
  exitBtn: { background: "transparent", color: "#FFFFFF", border: "1px solid rgba(255,255,255,.5)", borderRadius: 8, padding: "7px 14px", cursor: "pointer", fontFamily: "'Roboto',sans-serif", fontWeight: 700 },
  gate: { margin: "auto", textAlign: "center", padding: 24, maxWidth: 640 },
  gateTitle: { fontFamily: "'Roboto Slab', serif", fontSize: 30, margin: "0 0 8px", color: "#092E4F" },
  gateSub: { color: "#5A6B7B", marginBottom: 28 },
  gateCards: { display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" },
  gateCard: { display: "flex", flexDirection: "column", gap: 6, alignItems: "center", width: 240, padding: "26px 18px", background: "#FFFFFF", border: "1.5px solid #E2E8F0", borderRadius: 16, cursor: "pointer", fontFamily: "'Roboto',sans-serif", fontSize: 15, boxShadow: "0 8px 24px rgba(9,46,79,.08)" },
  gateEmoji: { fontSize: 30 },
  gateDesc: { fontSize: 13, color: "#5A6B7B" },
  label: { display: "block", fontWeight: 700, fontSize: 14, margin: "14px 0 6px" },
  input: { width: "100%", padding: "12px 14px", borderRadius: 10, border: "1.5px solid #E2E8F0", fontSize: 16, fontFamily: "'Roboto',sans-serif", background: "#FFFFFF", boxSizing: "border-box" },
  primaryBtn: { marginTop: 14, width: "100%", padding: "12px 16px", borderRadius: 10, border: "none", background: "#D91F2C", color: "#FFFFFF", fontWeight: 700, fontSize: 15, cursor: "pointer", fontFamily: "'Roboto',sans-serif" },
  linkBtn: { marginTop: 12, background: "none", border: "none", color: "#092E4F", cursor: "pointer", fontFamily: "'Roboto',sans-serif", fontWeight: 700 },
  error: { color: "#D91F2C", fontSize: 13, marginTop: 8 },
  chatArea: { flex: 1, overflowY: "auto", padding: "20px 16px 8px", maxWidth: 760, width: "100%", margin: "0 auto", boxSizing: "border-box" },
  row: { display: "flex", gap: 10, marginBottom: 14, alignItems: "flex-end" },
  avatar: { width: 32, height: 32, borderRadius: "50%", background: "#092E4F", color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Roboto Slab',serif", fontWeight: 700, flexShrink: 0 },
  botBubble: { maxWidth: "78%", background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "14px 14px 14px 4px", padding: "12px 14px", fontSize: 15, lineHeight: 1.55, boxShadow: "0 3px 10px rgba(9,46,79,.06)" },
  userBubble: { maxWidth: "78%", background: "#092E4F", color: "#FFFFFF", borderRadius: "14px 14px 4px 14px", padding: "12px 14px", fontSize: 15, lineHeight: 1.55, whiteSpace: "pre-wrap" },
  servicesBtn: { display: "flex", alignItems: "center", justifyContent: "center", gap: 9, background: "#092E4F", color: "#FFFFFF", border: "none", borderRadius: 12, padding: "11px 16px", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "'Roboto',sans-serif", maxWidth: 760, margin: "8px auto 0", width: "calc(100% - 32px)", boxSizing: "border-box", boxShadow: "0 6px 16px rgba(9,46,79,.18)" },
  chipRow: { display: "flex", gap: 8, flexWrap: "wrap", padding: "6px 16px 10px", maxWidth: 760, margin: "0 auto", width: "100%", boxSizing: "border-box" },
  chip: { background: "#FFFFFF", border: "1.5px solid #CBD5E1", color: "#092E4F", borderRadius: 999, padding: "7px 14px", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "'Roboto',sans-serif", transition: "all .15s" },
  inputBar: { display: "flex", gap: 10, padding: "10px 16px", maxWidth: 760, margin: "0 auto", width: "100%", boxSizing: "border-box" },
  textarea: { flex: 1, resize: "none", padding: "12px 14px", borderRadius: 12, border: "1.5px solid #E2E8F0", fontSize: 12.08, fontFamily: "'Roboto',sans-serif", background: "#FFFFFF" },
  disclaimer: { textAlign: "center", fontSize: 8, color: "#8595A3", padding: "4px 16px 14px", maxWidth: 760, margin: "0 auto" },
  voiceBtn: { background: "transparent", color: "#FFFFFF", border: "1px solid rgba(255,255,255,.5)", borderRadius: 8, width: 38, height: 34, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 },
  micBtn: { width: 42, height: 42, borderRadius: "50%", border: "1.5px solid #CBD5E1", background: "#FFFFFF", color: "#092E4F", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0, transition: "all .15s" },
  micActive: { background: "#D91F2C", color: "#FFFFFF", borderColor: "#D91F2C" },
  micDisabled: { opacity: 0.4, cursor: "not-allowed" },
  sendBtn: { width: 48, height: 42, borderRadius: 12, border: "none", background: "#D91F2C", color: "#FFFFFF", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 },
  fbRow: { display: "flex", alignItems: "center", gap: 7, flexWrap: "wrap", marginTop: 7, paddingLeft: 2 },
  fbLabel: { fontSize: 11.5, color: "#8595A3", fontWeight: 500 },
  fbBtn: { width: 28, height: 28, borderRadius: 8, border: "1.5px solid #E2E8F0", background: "#FFFFFF", color: "#8595A3", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12 },
  fbUpActive: { background: "#1b7f3b", borderColor: "#1b7f3b", color: "#fff" },
  fbDownActive: { background: "#D91F2C", borderColor: "#D91F2C", color: "#fff" },
  fbThanks: { fontSize: 11, color: "#1b7f3b", fontWeight: 700 },
  listenBtn: { width: 28, height: 28, borderRadius: 8, border: "1.5px solid #E2E8F0", background: "#FFFFFF", color: "#092E4F", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12 },
  escalationCard: { maxWidth: "86%", background: "#FFF1F2", border: "1.5px solid #F5C2C7", borderRadius: "14px 14px 14px 4px", padding: "14px 16px", boxShadow: "0 3px 10px rgba(9,46,79,.08)" },
  callBtn: { display: "inline-flex", alignItems: "center", gap: 8, background: "#D91F2C", color: "#FFFFFF", border: "none", borderRadius: 10, padding: "10px 18px", fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "'Roboto',sans-serif" },
  secondaryBtn: { display: "inline-flex", alignItems: "center", gap: 8, background: "#FFFFFF", color: "#092E4F", border: "1.5px solid #CBD5E1", borderRadius: 10, padding: "10px 18px", fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "'Roboto',sans-serif" },
  langPickWrap: { display: "flex", flexDirection: "column", gap: 8, alignItems: "center", marginBottom: 28, padding: "16px 18px", background: "#FFFFFF", border: "1.5px solid #E2E8F0", borderRadius: 14, maxWidth: 340, marginLeft: "auto", marginRight: "auto" },
  langPickLabel: { fontWeight: 700, fontSize: 14, color: "#092E4F" },
  langSelect: { width: "100%", padding: "11px 14px", borderRadius: 10, border: "1.5px solid #E2E8F0", fontSize: 15, background: "#fff", cursor: "pointer", color: "#10222F" },
};
