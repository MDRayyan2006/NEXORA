/**
 * NEXORA Multilingual Internationalization (i18n)
 * Supports: English (en), Telugu (te), Hindi (hi), Tamil (ta)
 */

export type LanguageCode = "en" | "te" | "hi" | "ta";

export interface LanguageInfo {
  code: LanguageCode;
  name: string;
  nativeName: string;
  flag: string;
  pollyVoice: string;
}

export const SUPPORTED_LANGUAGES: LanguageInfo[] = [
  { code: "en", name: "English", nativeName: "English", flag: "🇬🇧", pollyVoice: "Polly.Aditi" },
  { code: "te", name: "Telugu", nativeName: "తెలుగు", flag: "🇮🇳", pollyVoice: "Polly.Aditi" },
  { code: "hi", name: "Hindi", nativeName: "हिंदी", flag: "🇮🇳", pollyVoice: "Polly.Aditi" },
  { code: "ta", name: "Tamil", nativeName: "தமிழ்", flag: "🇮🇳", pollyVoice: "Polly.Aditi" },
];

export const TRANSLATIONS: Record<LanguageCode, Record<string, string>> = {
  en: {
    // Nav & General
    appName: "NEXORA",
    tagline: "Voice & WhatsApp Learning",
    dashboard: "Skills Dashboard",
    callTutor: "AI Phone Call Tutor",
    whatsappBot: "WhatsApp Assistant",
    learningResources: "Videos & Textbooks",
    resumeBuilder: "AI Resume & Form Filler",
    settings: "Settings & Profile",
    signOut: "Sign Out",
    welcome: "Welcome",
    
    // User Mode
    userMode: "Student Mode",
    keypadUser: "Keypad Phone Student",
    webUser: "Website & Smartphone Student",
    keypadDesc: "Optimized for feature phones with daily automated phone calls and DTMF keypad tests.",
    webDesc: "Full interactive dashboard with video lectures, textbook notes, and auto-resume generation.",
    
    // Call Tutor
    dailyCallSchedule: "Daily Call Schedule",
    scheduleDesc: "AI calls your phone number every day at this time to teach and test you via keypad.",
    phoneNumber: "Phone Number",
    preferredTime: "Preferred Call Time",
    topic: "Current Learning Topic",
    callLanguage: "Call Audio Language",
    saveSchedule: "Save Daily Call Schedule",
    dialNow: "Dial My Phone via AI Call",
    audioSimulator: "Interactive Audio Simulator",
    callActive: "Active Daily Call",
    callPaused: "Call Paused",
    liveDialogue: "Live Audio Dialogue Stream",
    keypadDialpad: "Phone Keypad (DTMF Dialpad)",
    pressKeyToAnswer: "Press 1, 2, 3, or 4 on your phone keypad to answer questions.",
    
    // Skills Dashboard
    skillsOverview: "Demonstrated Skills Overview",
    skillsDesc: "Real-time representation of competencies calibrated from your call tests and learning progress.",
    masteredSkills: "Mastered Skills",
    learningInProgress: "In Progress",
    readyToLearn: "Next Topics",
    recentScores: "Recent Call Test Scores",
    dailyStreak: "Daily Call Streak",
    totalCalls: "Completed Calls",
    
    // WhatsApp
    whatsappTitle: "WhatsApp Homework & Doubt Assistant",
    whatsappDesc: "Send your doubts or photos of homework to our WhatsApp AI bot for step-by-step guidance.",
    doubtMode: "Doubt Solver",
    assignmentMode: "Assignment Review",
    typeDoubt: "Type your academic question or doubt...",
    sendDoubt: "Send Doubt to WhatsApp Bot",
    submitAssignment: "Submit Solution for Rubric Review",
    
    // Resume
    resumeTitle: "Automated Resume & Job Form Filler",
    resumeDesc: "As our AI tutor trains you in skills, it automatically builds your verified professional resume and fills job applications.",
    generateResume: "Generate / Refresh Resume",
    downloadResume: "Download Resume PDF",
    autoFillForms: "Auto-Fill Job Applications",
    verifiedSkills: "Verified Competencies (From AI Call Tests)",
    
    // Resources
    resourcesTitle: "Curriculum Resources: Videos & Textbooks",
    resourcesDesc: "Comprehensive study materials designed for both audio call lessons and web study.",
    watchVideo: "Watch Video Lecture",
    readTextbook: "Read Textbook Notes",
    triggerTopicCall: "Teach Me via Phone Call",
  },
  te: {
    // Nav & General
    appName: "నెక్సోరా",
    tagline: "ఫోన్ కాల్ & వాట్సాప్ లెర్నింగ్",
    dashboard: "నైపుణ్యాల డ్యాష్‌బోర్డ్",
    callTutor: "AI ఫోన్ కాల్ ట్యూటర్",
    whatsappBot: "వాట్సాప్ అసిస్టెంట్",
    learningResources: "వీడియోలు & పాఠ్యపుస్తకాలు",
    resumeBuilder: "AI రెజ్యూమ్ & ఫారమ్ ఫిల్లర్",
    settings: "సెట్టింగ్‌లు & ప్రొఫైల్",
    signOut: "లాగ్ అవుట్",
    welcome: "స్వాగతం",
    
    // User Mode
    userMode: "విద్యార్థి మోడ్",
    keypadUser: "కీప్యాడ్ ఫోన్ విద్యార్థి",
    webUser: "వెబ్‌సైట్ & స్మార్ట్‌ఫోన్ విద్యార్థి",
    keypadDesc: "కీప్యాడ్ ఫోన్‌ల కోసం రోజూ ఆటోమేటిక్ కాల్‌లు మరియు బటన్ల (DTMF) ద్వారా పరీక్షలు.",
    webDesc: "వీడియో పాఠాలు, పాఠ్యపుస్తక నోట్స్ మరియు ఆటోమేటిక్ రెజ్యూమ్ తయారీతో కూడిన పూర్తి డ్యాష్‌బోర్డ్.",
    
    // Call Tutor
    dailyCallSchedule: "రోజువారీ కాల్ సమయం",
    scheduleDesc: "రోజూ ఈ సమయంలో AI మీ ఫోన్‌కు కాల్ చేసి పాఠం బోధించి, కీప్యాడ్ ద్వారా పరీక్ష నిర్వహిస్తుంది.",
    phoneNumber: "ఫోన్ నంబర్",
    preferredTime: "కాల్ సమయం",
    topic: "నేర్చుకునే అంశం",
    callLanguage: "కాల్ ఆడియో భాష",
    saveSchedule: "కాల్ షెడ్యూల్ సేవ్ చేయండి",
    dialNow: "ఇప్పుడే నా ఫోన్‌కు కాల్ చేయండి",
    audioSimulator: "ఆడియో సిమ్యులేటర్",
    callActive: "కాల్ యాక్టివ్ చేయబడింది",
    callPaused: "కాల్ నిలిపివేయబడింది",
    liveDialogue: "లైవ్ సంభాషణ స్ట్రీమ్",
    keypadDialpad: "ఫోన్ కీప్యాడ్ (డయల్‌ప్యాడ్)",
    pressKeyToAnswer: "సమాధానం ఇవ్వడానికి మీ ఫోన్ కీప్యాడ్‌లో 1, 2, 3, లేదా 4 నొక్కండి.",
    
    // Skills Dashboard
    skillsOverview: "నేర్చుకున్న నైపుణ్యాల వివరాలు",
    skillsDesc: "మీ ఫోన్ కాల్ పరీక్షలు మరియు సాధన ఆధారంగా లెక్కించబడిన అసలైన నైపుణ్యాలు.",
    masteredSkills: "పూర్తిగా నేర్చుకున్నవి",
    learningInProgress: "సాధనలో ఉన్నవి",
    readyToLearn: "తరువాతి అంశాలు",
    recentScores: "ఇటీవలి కాల్ పరీక్ష మార్కులు",
    dailyStreak: "రోజువారీ కాల్ స్ట్రీక్",
    totalCalls: "పూర్తయిన కాల్స్",
    
    // WhatsApp
    whatsappTitle: "వాట్సాప్ సందేహాలు & హోంవర్క్ రివ్యూ",
    whatsappDesc: "మీ సందేహాలు లేదా హోంవర్క్ ఫోటోలను మా వాట్సాప్ బాట్‌కు పంపి తక్షణ సహాయం పొందండి.",
    doubtMode: "సందేహాల నివృత్తి",
    assignmentMode: "హోంవర్క్ పరిశీలన",
    typeDoubt: "మీ సందేహాన్ని ఇక్కడ టైప్ చేయండి...",
    sendDoubt: "వాట్సాప్ బాట్‌కు పంపండి",
    submitAssignment: "సమాధానాన్ని పరిశీలనకు పంపండి",
    
    // Resume
    resumeTitle: "ఆటోమేటిక్ రెజ్యూమ్ & ఉద్యోగ ఫారమ్ ఫిల్లర్",
    resumeDesc: "AI మీకు నేర్పించిన నైపుణ్యాల ఆధారంగా మీ ఉద్యోగ రెజ్యూమ్‌ను స్వయంగా తయారు చేసి దరఖాస్తులను నింపుతుంది.",
    generateResume: "రెజ్యూమ్ తయారు చేయండి",
    downloadResume: "రెజ్యూమ్ డౌన్‌లోడ్ (PDF)",
    autoFillForms: "ఉద్యోగ దరఖాస్తులను నింపండి",
    verifiedSkills: "ధృవీకరించబడిన నైపుణ్యాలు (కాల్ పరీక్షల నుండి)",
    
    // Resources
    resourcesTitle: "వీడియో పాఠాలు & పాఠ్యపుస్తకాలు",
    resourcesDesc: "ఫోన్ కాల్ పాఠాలు మరియు వెబ్ అభ్యసనం రెండింటికీ ఉపయోగపడే స్టడీ మెటీరియల్.",
    watchVideo: "వీడియో పాఠం చూడండి",
    readTextbook: "పుస్తక నోట్స్ చదవండి",
    triggerTopicCall: "నాకు ఫోన్ కాల్ ద్వారా బోధించండి",
  },
  hi: {
    // Nav & General
    appName: "नेक्सोरा",
    tagline: "फ़ोन कॉल और व्हाट्सएप शिक्षा",
    dashboard: "कौशल डैशबोर्ड",
    callTutor: "AI फ़ोन कॉल ट्यूटर",
    whatsappBot: "व्हाट्सएप सहायक",
    learningResources: "वीडियो और पाठ्यपुस्तकें",
    resumeBuilder: "AI बायोडाटा और फॉर्म फिलर",
    settings: "सेटिंग्स और प्रोफ़ाइल",
    signOut: "साइन आउट",
    welcome: "स्वागत है",
    
    // User Mode
    userMode: "छात्र मोड",
    keypadUser: "कीपैड फ़ोन छात्र",
    webUser: "वेबसाइट और स्मार्टफ़ोन छात्र",
    keypadDesc: "साधारण कीपैड फ़ोन के लिए दैनिक स्वचालित कॉल और कीपैड (DTMF) टेस्ट।",
    webDesc: "वीडियो लेक्चर्स, पाठ्यपुस्तकों और ऑटो-बायोडाटा के साथ संपूर्ण डैशबोर्ड।",
    
    // Call Tutor
    dailyCallSchedule: "दैनिक कॉल शेड्यूल",
    scheduleDesc: "AI हर दिन इस समय आपके फ़ोन पर कॉल करके पाठ पढ़ाएगा और कीपैड से टेस्ट लेगा।",
    phoneNumber: "फ़ोन नंबर",
    preferredTime: "कॉल का समय",
    topic: "पढ़ने का विषय",
    callLanguage: "कॉल की भाषा",
    saveSchedule: "कॉल शेड्यूल सहेजें",
    dialNow: "मेरे फ़ोन पर अभी कॉल करें",
    audioSimulator: "ऑडियो सिम्युलेटर",
    callActive: "दैनिक कॉल सक्रिय",
    callPaused: "कॉल रुकी हुई",
    liveDialogue: "लाइव बातचीत स्ट्रीम",
    keypadDialpad: "फ़ोन कीपैड (डायलपैड)",
    pressKeyToAnswer: "उत्तर देने के लिए अपने फ़ोन कीपैड पर 1, 2, 3 या 4 दबाएं।",
    
    // Skills Dashboard
    skillsOverview: "कौशल और दक्षता का विवरण",
    skillsDesc: "आपके कॉल टेस्ट और अभ्यास के आधार पर वास्तविक कौशल का प्रदर्शन।",
    masteredSkills: "पूर्णतः सीखे गए कौशल",
    learningInProgress: "अभ्यास जारी है",
    readyToLearn: "अगले विषय",
    recentScores: "हालिया कॉल टेस्ट स्कोर",
    dailyStreak: "दैनिक कॉल स्ट्रीक",
    totalCalls: "कुल पूरी हुई कॉल्स",
    
    // WhatsApp
    whatsappTitle: "व्हाट्सएप होमवर्क और संदेह समाधान",
    whatsappDesc: "व्हाट्सएप पर अपने प्रश्न या होमवर्क भेजें और चरण-दर-चरण समाधान पाएं।",
    doubtMode: "संदेह समाधान",
    assignmentMode: "होमवर्क समीक्षा",
    typeDoubt: "अपना प्रश्न या संदेह यहाँ लिखें...",
    sendDoubt: "व्हाट्सएप बॉट को भेजें",
    submitAssignment: "समीक्षा के लिए भेजें",
    
    // Resume
    resumeTitle: "स्वचालित बायोडाटा और फॉर्म फिलर",
    resumeDesc: "AI द्वारा सीखे गए कौशलों के आधार पर आपका पेशेवर बायोडाटा तैयार किया जाता है।",
    generateResume: "बायोडाटा तैयार करें",
    downloadResume: "बायोडाटा डाउनलोड करें (PDF)",
    autoFillForms: "नौकरी आवेदन फॉर्म भरें",
    verifiedSkills: "सत्यापित कौशल (कॉल टेस्ट द्वारा)",
    
    // Resources
    resourcesTitle: "पाठ्यक्रम संसाधन: वीडियो और पुस्तकें",
    resourcesDesc: "फ़ोन कॉल पाठों और वेब अध्ययन दोनों के लिए उपयोगी अध्ययन सामग्री।",
    watchVideo: "वीडियो लेक्चर देखें",
    readTextbook: "पुस्तक नोट्स पढ़ें",
    triggerTopicCall: "फ़ोन कॉल पर यह विषय पढ़ाएं",
  },
  ta: {
    // Nav & General
    appName: "நெக்ஸோரா",
    tagline: "தொலைபேசி அழைப்பு & வாட்ஸ்அப் கல்வி",
    dashboard: "திறன்கள் டாஷ்போர்டு",
    callTutor: "AI போன் கால் ஆசிரியர்",
    whatsappBot: "வாட்ஸ்அப் உதவியாளர்",
    learningResources: "வீடியோக்கள் & பாடப்புத்தகங்கள்",
    resumeBuilder: "AI ரெஸ்யூம் & விண்ணப்பம் நிரப்புபவர்",
    settings: "அமைப்புகள் & சுயவிவரம்",
    signOut: "வெளியேறு",
    welcome: "வரவேற்கிறோம்",
    
    // User Mode
    userMode: "மாணவர் பயன்முறை",
    keypadUser: "கீபேட் போன் மாணவர்",
    webUser: "வலைத்தளம் & ஸ்மார்ட்போன் மாணவர்",
    keypadDesc: "தினசரி போன் அழைப்புகள் மற்றும் பட்டன்கள் மூலம் தேர்வு எழுதும் வசதி.",
    webDesc: "வீடியோக்கள், பாடப்புத்தகங்கள் மற்றும் தானியங்கி ரெஸ்யூம் வசதி.",
    
    // Call Tutor
    dailyCallSchedule: "தினசரி அழைப்பு நேரம்",
    scheduleDesc: "AI தினமும் இந்த நேரத்தில் உங்கள் தொலைபேசிக்கு அழைத்து பாடம் சொல்லிக்கொடுக்கும்.",
    phoneNumber: "தொலைபேசி எண்",
    preferredTime: "அழைப்பு நேரம்",
    topic: "கற்கும் தலைப்பு",
    callLanguage: "அழைப்பு மொழி",
    saveSchedule: "அழைப்பு அட்டவணையை சேமிக்கவும்",
    dialNow: "இப்போதே என் தொலைபேசிக்கு அழைக்கவும்",
    audioSimulator: "ஆடியோ சிமுலேட்டர்",
    callActive: "அழைப்பு செயலில் உள்ளது",
    callPaused: "அழைப்பு நிறுத்தப்பட்டது",
    liveDialogue: "நேரடி உரையாடல் ஸ்ட்ரீம்",
    keypadDialpad: "போன் கீபேட்",
    pressKeyToAnswer: "பதிலளிக்க உங்கள் தொலைபேசி கீபேடில் 1, 2, 3 அல்லது 4 அழுத்தவும்.",
    
    // Skills Dashboard
    skillsOverview: "திறன்கள் கண்ணோட்டம்",
    skillsDesc: "உங்கள் அழைப்பு தேர்வுகள் மூலம் சரிபார்க்கப்பட்ட உண்மையான திறன்கள்.",
    masteredSkills: "முழுமையாக கற்றவை",
    learningInProgress: "கற்றுக்கொண்டிருப்பவை",
    readyToLearn: "அடுத்த தலைப்புகள்",
    recentScores: "சமீபத்திய தேர்வு மதிப்பெண்கள்",
    dailyStreak: "தினசரி அழைப்பு தொடர்ச்சி",
    totalCalls: "முழுமைபெற்ற அழைப்புகள்",
    
    // WhatsApp
    whatsappTitle: "வாட்ஸ்அப் வீட்டுப்பாடம் & சந்தேக தீர்வு",
    whatsappDesc: "உங்கள் சந்தேகங்களை வாட்ஸ்அப்பில் கேட்டு எளிய முறையில் விளக்கம் பெறுங்கள்.",
    doubtMode: "சந்தேக தீர்வு",
    assignmentMode: "வீட்டுப்பாட ஆய்வு",
    typeDoubt: "உங்கள் கேள்வியை இங்கே தட்டச்சு செய்யவும்...",
    sendDoubt: "வாட்ஸ்அப் பாட்டுக்கு அனுப்பு",
    submitAssignment: "ஆய்வுக்கு சமர்ப்பிக்கவும்",
    
    // Resume
    resumeTitle: "தானியங்கி ரெஸ்யூம் & விண்ணப்பம்",
    resumeDesc: "AI மூலம் நீங்கள் கற்றுக்கொண்ட திறன்களைக் கொண்டு உங்கள் வேலைவாய்ப்பு ரெஸ்யூம் தயாராகும்.",
    generateResume: "ரெஸ்யூம் உருவாக்கு",
    downloadResume: "பதிவிறக்கம் செய் (PDF)",
    autoFillForms: "வேலை விண்ணப்பங்களை நிரப்பு",
    verifiedSkills: "சரிபார்க்கப்பட்ட திறன்கள் (கால் தேர்வுகள் மூலம்)",
    
    // Resources
    resourcesTitle: "வீடியோக்கள் & பாடப்புத்தகங்கள்",
    resourcesDesc: "போன் அழைப்பு மற்றும் இணையவழி கல்விக்கான சிறந்த பாடப்பொருட்கள்.",
    watchVideo: "வீடியோ பார்க்கவும்",
    readTextbook: "புத்தக குறிப்புகளை படிக்கவும்",
    triggerTopicCall: "போன் அழைப்பில் கற்பிக்கவும்",
  },
};

export function getTranslation(lang: LanguageCode, key: string): string {
  const dict = TRANSLATIONS[lang] || TRANSLATIONS.en;
  return dict[key] || TRANSLATIONS.en[key] || key;
}

