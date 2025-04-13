import { createContext, useEffect, useReducer } from 'react';

const initialLanguage = localStorage.getItem('language') || 'en';

// All translations organized by language code
const translationData = {
  en: {
    // Navigation and common elements
    home: "Home",
    about: "About",
    services: "Services",
    doctors: "Doctors",
    contact: "Contact",
    login: "Login",
    signup: "Sign Up",
    logout: "Logout",
    chatbot: "ChatBot",
    navlink: [
      "Home",
      "Find a Doctor",
      "Services",
      "Contact",
      "Verify If Not",
      "Chats",
      "ChatBot",
      "Report"

    ],
    // Hero section
    heroHeading: "Your Health, Our Priority",
    heroSubHeading: "We provide the most comprehensive medical services to ensure you receive the best healthcare possible.",
    requestAppointment: "Request an Appointment",
    yearsOfExperience: "Years of Experience",
    clientLocation: "Clinic Locations",
    patientSatisfaction: "Patient Satisfaction",
    
    // Service section
    bestMedicalServices: "Providing the Best Medical Services",
    worldClassCare: "World-class care for everyone. Our health system offers unmatched, expert healthcare.",
    findDoctor: "Find a Doctor",
    findDoctorDesc: "Find the perfect specialist for your needs with our comprehensive doctor directory.",
    findLocation: "Find a Location",
    findLocationDesc: "Locate our healthcare facilities near you for convenient access to medical services.",
    bookAppointment: "Book Appointment",
    bookAppointmentDesc: "Schedule your appointment online easily and get prompt medical attention.",
    
    // About
    aboutUsHeading: "About Us",
    aboutUsSubHeading: "Committed to Excellence in Healthcare",
    aboutUsContent: "With years of experience and a team of dedicated professionals, we strive to provide the highest quality healthcare services to our patients.",
    learnMore: "Learn More",
    
    // Medical services
    ourMedicalServices: "Our Medical Services",
    comprehensiveCare: "We provide comprehensive healthcare services to address all your medical needs.",
    
    // Virtual treatment
    virtualTreatmentHeading: "Get Virtual Treatment Anytime",
    virtualStep1: "Schedule your virtual appointment through our online portal",
    virtualStep2: "Connect with your doctor via secure video conferencing",
    virtualStep3: "Receive diagnosis, treatment plans, and prescriptions remotely",
    consultation: "Consultation",
    
    // Doctors section
    ourGreatDoctors: "Our Expert Doctors",
    
    // FAQ section
    faqHeading: "Frequently Asked Questions",
    
    // Testimonial
    testimonialHeading: "What Our Patients Say",
    genuineOpinions: "Genuine opinions from our valued patients about their healthcare experience with us.",
    
    // Language selection
    selectLanguage: "Select Language",
    languageChanged: "Language changed to English"
  },
  hi: {
    // Navigation and common elements
    home: "होम",
    about: "हमारे बारे में",
    services: "सेवाएं",
    doctors: "डॉक्टर्स",
    contact: "संपर्क",
    login: "लॉगिन",
    signup: "साइन अप",
    logout: "लॉगआउट",
    chatbot: "चैट",
    navlink: [
      "होम",
      "डॉक्टर खोजें",
      "सेवाएं",
      "संपर्क करें",
      "यदि नहीं तो सत्यापित करें",
      "चैट",
      "चैटबॉट",
      "रिपोर्ट"
    ],
    // Hero section
    heroHeading: "आपका स्वास्थ्य, हमारी प्राथमिकता",
    heroSubHeading: "हम सबसे व्यापक चिकित्सा सेवाएं प्रदान करते हैं ताकि आपको सर्वोत्तम स्वास्थ्य देखभाल मिल सके।",
    requestAppointment: "अपॉइंटमेंट बुक करें",
    yearsOfExperience: "अनुभव के वर्ष",
    clientLocation: "क्लिनिक स्थान",
    patientSatisfaction: "रोगी संतुष्टि",
    
    // Service section
    bestMedicalServices: "सर्वोत्तम चिकित्सा सेवाएं प्रदान करना",
    worldClassCare: "सभी के लिए विश्व स्तरीय देखभाल। हमारी स्वास्थ्य प्रणाली अद्वितीय, विशेषज्ञ स्वास्थ्य सेवा प्रदान करती है।",
    findDoctor: "डॉक्टर खोजें",
    findDoctorDesc: "हमारी व्यापक डॉक्टर डायरेक्टरी के साथ अपनी जरूरतों के लिए सही विशेषज्ञ खोजें।",
    findLocation: "स्थान खोजें",
    findLocationDesc: "चिकित्सा सेवाओं तक सुविधाजनक पहुंच के लिए अपने पास हमारी स्वास्थ्य सुविधाएं खोजें।",
    bookAppointment: "अपॉइंटमेंट बुक करें",
    bookAppointmentDesc: "आसानी से ऑनलाइन अपना अपॉइंटमेंट शेड्यूल करें और तुरंत चिकित्सा ध्यान प्राप्त करें।",
    
    // About
    aboutUsHeading: "हमारे बारे में",
    aboutUsSubHeading: "स्वास्थ्य सेवा में उत्कृष्टता के लिए प्रतिबद्ध",
    aboutUsContent: "वर्षों के अनुभव और समर्पित पेशेवरों की एक टीम के साथ, हम अपने रोगियों को उच्चतम गुणवत्ता वाली स्वास्थ्य सेवाएं प्रदान करने का प्रयास करते हैं।",
    learnMore: "और जानें",
    
    // Medical services
    ourMedicalServices: "हमारी चिकित्सा सेवाएं",
    comprehensiveCare: "हम आपकी सभी चिकित्सा जरूरतों को पूरा करने के लिए व्यापक स्वास्थ्य सेवाएं प्रदान करते हैं।",
    
    // Virtual treatment
    virtualTreatmentHeading: "कभी भी वर्चुअल उपचार प्राप्त करें",
    virtualStep1: "हमारे ऑनलाइन पोर्टल के माध्यम से अपनी वर्चुअल अपॉइंटमेंट शेड्यूल करें",
    virtualStep2: "सुरक्षित वीडियो कॉन्फ्रेंसिंग के माध्यम से अपने डॉक्टर से जुड़ें",
    virtualStep3: "दूरस्थ रूप से निदान, उपचार योजना और नुस्खे प्राप्त करें",
    consultation: "परामर्श",
    
    // Doctors section
    ourGreatDoctors: "हमारे विशेषज्ञ डॉक्टर",
    
    // FAQ section
    faqHeading: "अक्सर पूछे जाने वाले प्रश्न",
    
    // Testimonial
    testimonialHeading: "हमारे मरीज क्या कहते हैं",
    genuineOpinions: "हमारे साथ स्वास्थ्य सेवा अनुभव के बारे में हमारे मूल्यवान रोगियों की वास्तविक राय।",
    
    // Language selection
    selectLanguage: "भाषा चुनें",
    languageChanged: "भाषा हिंदी में बदल गई है"
  },
  kn: {
    // Navigation and common elements
    home: "ಮುಖಪುಟ",
    about: "ನಮ್ಮ ಬಗ್ಗೆ",
    services: "ಸೇವೆಗಳು",
    doctors: "ವೈದ್ಯರು",
    contact: "ಸಂಪರ್ಕ",
    login: "ಲಾಗಿನ್",
    signup: "ಸೈನ್ ಅಪ್",
    logout: "ಲಾಗ್ಔಟ್",
    chatbot: "ಚಾಟ್",
    
    navlink: [
      "ಮುಖಪುಟ",
      "ವೈದ್ಯರನ್ನು ಹುಡುಕಿ",
      "ಸೇವೆಗಳು",
      "ಸಂಪರ್ಕಿಸಿ",
      "ನೋಡಲು ಇಲ್ಲ",
      "ಚಾಟ್‌ಗಳು",
      "ಚಾಟ್‌ಬಾಟ್",
      "ವರದಿ"
    ],
    // Hero section
    heroHeading: "ನಿಮ್ಮ ಆರೋಗ್ಯ, ನಮ್ಮ ಆದ್ಯತೆ",
    heroSubHeading: "ನೀವು ಅತ್ಯುತ್ತಮ ಆರೋಗ್ಯ ಸೇವೆಯನ್ನು ಪಡೆಯುವುದನ್ನು ಖಚಿತಪಡಿಸಲು ನಾವು ಅತ್ಯಂತ ಸಮಗ್ರ ವೈದ್ಯಕೀಯ ಸೇವೆಗಳನ್ನು ಒದಗಿಸುತ್ತೇವೆ.",
    requestAppointment: "ಅಪಾಯಿಂಟ್ಮೆಂಟ್ ಕೋರಿ",
    yearsOfExperience: "ಅನುಭವದ ವರ್ಷಗಳು",
    clientLocation: "ಕ್ಲಿನಿಕ್ ಸ್ಥಳಗಳು",
    patientSatisfaction: "ರೋಗಿಯ ತೃಪ್ತಿ",
    
    // Service section
    bestMedicalServices: "ಅತ್ಯುತ್ತಮ ವೈದ್ಯಕೀಯ ಸೇವೆಗಳನ್ನು ಒದಗಿಸುವುದು",
    worldClassCare: "ಎಲ್ಲರಿಗೂ ವಿಶ್ವದರ್ಜೆಯ ಆರೈಕೆ. ನಮ್ಮ ಆರೋಗ್ಯ ವ್ಯವಸ್ಥೆಯು ಅಸಮಾನವಾದ, ತಜ್ಞ ಆರೋಗ್ಯ ಸೇವೆಯನ್ನು ನೀಡುತ್ತದೆ.",
    findDoctor: "ವೈದ್ಯರನ್ನು ಹುಡುಕಿ",
    findDoctorDesc: "ನಮ್ಮ ಸಮಗ್ರ ವೈದ್ಯರ ಡೈರೆಕ್ಟರಿಯೊಂದಿಗೆ ನಿಮ್ಮ ಅಗತ್ಯಗಳಿಗೆ ಸರಿಯಾದ ತಜ್ಞರನ್ನು ಹುಡುಕಿ.",
    findLocation: "ಸ್ಥಳ ಹುಡುಕಿ",
    findLocationDesc: "ವೈದ್ಯಕೀಯ ಸೇವೆಗಳಿಗೆ ಅನುಕೂಲಕರ ಪ್ರವೇಶಕ್ಕಾಗಿ ನಿಮ್ಮ ಹತ್ತಿರದ ನಮ್ಮ ಆರೋಗ್ಯ ಸೌಲಭ್ಯಗಳನ್ನು ಪತ್ತೆಹಚ್ಚಿ.",
    bookAppointment: "ಅಪಾಯಿಂಟ್ಮೆಂಟ್ ಬುಕ್ ಮಾಡಿ",
    bookAppointmentDesc: "ಸುಲಭವಾಗಿ ಆನ್‌ಲೈನ್‌ನಲ್ಲಿ ನಿಮ್ಮ ಅಪಾಯಿಂಟ್ಮೆಂಟ್ ಅನ್ನು ಶೆಡ್ಯೂಲ್ ಮಾಡಿ ಮತ್ತು ತ್ವರಿತ ವೈದ್ಯಕೀಯ ಗಮನ ಪಡೆಯಿರಿ.",
    
    // About
    aboutUsHeading: "ನಮ್ಮ ಬಗ್ಗೆ",
    aboutUsSubHeading: "ಆರೋಗ್ಯ ಸೇವೆಯಲ್ಲಿ ಶ್ರೇಷ್ಠತೆಗೆ ಬದ್ಧವಾಗಿದೆ",
    aboutUsContent: "ವರ್ಷಗಳ ಅನುಭವ ಮತ್ತು ಸಮರ್ಪಿತ ವೃತ್ತಿಪರರ ತಂಡದೊಂದಿಗೆ, ನಾವು ನಮ್ಮ ರೋಗಿಗಳಿಗೆ ಅತ್ಯುನ್ನತ ಗುಣಮಟ್ಟದ ಆರೋಗ್ಯ ಸೇವೆಗಳನ್ನು ಒದಗಿಸಲು ಪ್ರಯತ್ನಿಸುತ್ತೇವೆ.",
    learnMore: "ಇನ್ನಷ್ಟು ತಿಳಿಯಿರಿ",
    
    // Medical services
    ourMedicalServices: "ನಮ್ಮ ವೈದ್ಯಕೀಯ ಸೇವೆಗಳು",
    comprehensiveCare: "ನಿಮ್ಮ ಎಲ್ಲಾ ವೈದ್ಯಕೀಯ ಅಗತ್ಯಗಳನ್ನು ಪೂರೈಸಲು ನಾವು ಸಮಗ್ರ ಆರೋಗ್ಯ ಸೇವೆಗಳನ್ನು ಒದಗಿಸುತ್ತೇವೆ.",
    
    // Virtual treatment
    virtualTreatmentHeading: "ಯಾವುದೇ ಸಮಯದಲ್ಲಿ ವರ್ಚುವಲ್ ಚಿಕಿತ್ಸೆ ಪಡೆಯಿರಿ",
    virtualStep1: "ನಮ್ಮ ಆನ್‌ಲೈನ್ ಪೋರ್ಟಲ್ ಮೂಲಕ ನಿಮ್ಮ ವರ್ಚುವಲ್ ಅಪಾಯಿಂಟ್ಮೆಂಟ್ ಅನ್ನು ಶೆಡ್ಯೂಲ್ ಮಾಡಿ",
    virtualStep2: "ಸುರಕ್ಷಿತ ವೀಡಿಯೊ ಕಾನ್ಫರೆನ್ಸಿಂಗ್ ಮೂಲಕ ನಿಮ್ಮ ವೈದ್ಯರೊಂದಿಗೆ ಸಂಪರ್ಕ ಸಾಧಿಸಿ",
    virtualStep3: "ದೂರದಿಂದ ರೋಗನಿರ್ಣಯ, ಚಿಕಿತ್ಸಾ ಯೋಜನೆಗಳು ಮತ್ತು ಔಷಧಿಗಳನ್ನು ಪಡೆಯಿರಿ",
    consultation: "ಸಮಾಲೋಚನೆ",
    
    // Doctors section
    ourGreatDoctors: "ನಮ್ಮ ತಜ್ಞ ವೈದ್ಯರು",
    
    // FAQ section
    faqHeading: "ಪದೇ ಪದೇ ಕೇಳಲಾಗುವ ಪ್ರಶ್ನೆಗಳು",
    
    // Testimonial
    testimonialHeading: "ನಮ್ಮ ರೋಗಿಗಳು ಏನು ಹೇಳುತ್ತಾರೆ",
    genuineOpinions: "ನಮ್ಮೊಂದಿಗೆ ಅವರ ಆರೋಗ್ಯ ಅನುಭವದ ಬಗ್ಗೆ ನಮ್ಮ ಮೌಲ್ಯಯುತ ರೋಗಿಗಳ ನೈಜ ಅಭಿಪ್ರಾಯಗಳು.",
    
    // Language selection
    selectLanguage: "ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ",
    languageChanged: "ಭಾಷೆಯನ್ನು ಕನ್ನಡಕ್ಕೆ ಬದಲಾಯಿಸಲಾಗಿದೆ"
  },
  te: {
    // Navigation and common elements
    home: "హోమ్",
    about: "మా గురించి",
    services: "సేవలు",
    doctors: "వైద్యులు",
    contact: "సంప్రదించండి",
    login: "లాగిన్",
    signup: "సైన్ అప్",
    logout: "లాగ్ అవుట్",
    chatbot: "చాట్",
    
    navlink: [
      "హోమ్",
      "ఒక వైద్యుడిని కనుగొనండి",
      "సేవలు",
      "సంప్రదించండి",
      "లేకపోతే నిర్ధారించండి",
      "చాట్‌లు",
      "చాట్‌బాట్",
      "రిపోర్ట్"
    ],

    // Hero section
    heroHeading: "మీ ఆరోగ్యం, మా ప్రాధాన్యత",
    heroSubHeading: "మీరు ఉత్తమమైన ఆరోగ్య సంరక్షణను పొందేలా చూడటానికి మేము అత్యంత సమగ్రమైన వైద్య సేవలను అందిస్తున్నాము.",
    requestAppointment: "అపాయింట్మెంట్ కోరండి",
    yearsOfExperience: "అనుభవ సంవత్సరాలు",
    clientLocation: "క్లినిక్ స్థానాలు",
    patientSatisfaction: "రోగి సంతృప్తి",
    
    // Service section
    bestMedicalServices: "ఉత్తమమైన వైద్య సేవలను అందించడం",
    worldClassCare: "అందరికీ ప్రపంచ స్థాయి సంరక్షణ. మా ఆరోగ్య వ్యవస్థ అసమానమైన, నిపుణ ఆరోగ్య సంరక్షణను అందిస్తుంది.",
    findDoctor: "వైద్యుడిని కనుగొనండి",
    findDoctorDesc: "మా సమగ్ర డాక్టర్ల డైరెక్టరీతో మీ అవసరాలకు సరైన నిపుణుడిని కనుగొనండి.",
    findLocation: "స్థానాన్ని కనుగొనండి",
    findLocationDesc: "వైద్య సేవలకు సౌకర్యవంతమైన ప్రవేశం కోసం మీ సమీపంలోని మా ఆరోగ్య సదుపాయాలను కనుగొనండి.",
    bookAppointment: "అపాయింట్మెంట్ బుక్ చేసుకోండి",
    bookAppointmentDesc: "సులభంగా ఆన్‌లైన్‌లో మీ అపాయింట్‌మెంట్‌ను షెడ్యూల్ చేసుకొని శీఘ్ర వైద్య శ్రద్ధను పొందండి.",
    
    // About
    aboutUsHeading: "మా గురించి",
    aboutUsSubHeading: "ఆరోగ్య సంరక్షణలో శ్రేష్ఠతకు కట్టుబడి ఉన్నాము",
    aboutUsContent: "సంవత్సరాల అనుభవం మరియు అంకితభావంతో కూడిన వృత్తినిపుణుల బృందంతో, మా రోగులకు అత్యున్నత నాణ్యత గల ఆరోగ్య సంరక్షణ సేవలను అందించడానికి మేము కృషి చేస్తున్నాము.",
    learnMore: "మరింత తెలుసుకోండి",
    
    // Medical services
    ourMedicalServices: "మా వైద్య సేవలు",
    comprehensiveCare: "మీ అన్ని వైద్య అవసరాలను తీర్చడానికి మేము సమగ్ర ఆరోగ్య సంరక్షణ సేవలను అందిస్తాము.",
    
    // Virtual treatment
    virtualTreatmentHeading: "ఎప్పుడైనా వర్చువల్ చికిత్స పొందండి",
    virtualStep1: "మా ఆన్‌లైన్ పోర్టల్ ద్వారా మీ వర్చువల్ అపాయింట్‌మెంట్‌ను షెడ్యూల్ చేసుకోండి",
    virtualStep2: "సురక్షితమైన వీడియో కాన్ఫరెన్సింగ్ ద్వారా మీ వైద్యుడితో కనెక్ట్ అవ్వండి",
    virtualStep3: "రిమోట్‌గా రోగనిర్ధారణ, చికిత్సా ప్రణాళికలు మరియు మందులను పొందండి",
    consultation: "సంప్రదింపులు",
    
    // Doctors section
    ourGreatDoctors: "మా నిపుణ వైద్యులు",
    
    // FAQ section
    faqHeading: "తరచుగా అడిగే ప్రశ్నలు",
    
    // Testimonial
    testimonialHeading: "మా రోగులు ఏమంటున్నారు",
    genuineOpinions: "మాతో వారి ఆరోగ్య అనుభవం గురించి మా విలువైన రోగుల నిజమైన అభిప్రాయాలు.",
    
    // Language selection
    selectLanguage: "భాషను ఎంచుకోండి",
    languageChanged: "భాష తెలుగులోకి మార్చబడింది"
  },
  fr: {
    // Navigation and common elements
    home: "Accueil",
    about: "À Propos",
    services: "Services",
    doctors: "Médecins",
    contact: "Contact",
    login: "Connexion",
    signup: "Inscription",
    logout: "Déconnexion",
    chatbot: "Chat",
    
    navlink: [
      "Accueil",
      "Trouver un Médecin",
      "Services",
      "Contactez-nous",
      "Ou voir ici",
      "Discussions",
      "Chatbot",
      "Rapport"
    ],

    // Hero section
    heroHeading: "Votre Santé, Notre Priorité",
    heroSubHeading: "Nous fournissons les services médicaux les plus complets pour vous assurer les meilleurs soins de santé possibles.",
    requestAppointment: "Demander un Rendez-vous",
    yearsOfExperience: "Ans d'Expérience",
    clientLocation: "Emplacements de Cliniques",
    patientSatisfaction: "Satisfaction des Patients",
    
    // Service section
    bestMedicalServices: "Fournir les Meilleurs Services Médicaux",
    worldClassCare: "Des soins de classe mondiale pour tous. Notre système de santé offre des soins de santé experts inégalés.",
    findDoctor: "Trouver un Médecin",
    findDoctorDesc: "Trouvez le spécialiste parfait pour vos besoins avec notre répertoire complet de médecins.",
    findLocation: "Trouver un Emplacement",
    findLocationDesc: "Localisez nos établissements de santé près de chez vous pour un accès pratique aux services médicaux.",
    bookAppointment: "Prendre Rendez-vous",
    bookAppointmentDesc: "Planifiez facilement votre rendez-vous en ligne et obtenez rapidement une attention médicale.",
    
    // About
    aboutUsHeading: "À Propos de Nous",
    aboutUsSubHeading: "Engagés pour l'Excellence en Soins de Santé",
    aboutUsContent: "Avec des années d'expérience et une équipe de professionnels dévoués, nous nous efforçons de fournir des services de santé de la plus haute qualité à nos patients.",
    learnMore: "En Savoir Plus",
    
    // Medical services
    ourMedicalServices: "Nos Services Médicaux",
    comprehensiveCare: "Nous fournissons des services de santé complets pour répondre à tous vos besoins médicaux.",
    
    // Virtual treatment
    virtualTreatmentHeading: "Obtenez un Traitement Virtuel à Tout Moment",
    virtualStep1: "Planifiez votre rendez-vous virtuel via notre portail en ligne",
    virtualStep2: "Connectez-vous avec votre médecin via une vidéoconférence sécurisée",
    virtualStep3: "Recevez des diagnostics, des plans de traitement et des ordonnances à distance",
    consultation: "Consultation",
    
    // Doctors section
    ourGreatDoctors: "Nos Médecins Experts",
    
    // FAQ section
    faqHeading: "Questions Fréquemment Posées",
    
    // Testimonial
    testimonialHeading: "Ce Que Disent Nos Patients",
    genuineOpinions: "Opinions authentiques de nos patients précieux sur leur expérience de soins de santé avec nous.",
    
    // Language selection
    selectLanguage: "Sélectionner la Langue",
    languageChanged: "Langue changée en Français"
  }
};

const initialState = {
    language: initialLanguage,
    translations: translationData[initialLanguage],
  };
  
  export const LanguageContext = createContext(initialState);
  
  const languageReducer = (state, action) => {
    switch (action.type) {
      case 'CHANGE_LANGUAGE':
        return {
          language: action.payload,
          translations: translationData[action.payload],
        };
      default:
        return state;
    }
  };
  

  
  export const LanguageProvider = ({ children }) => {
    const [state, dispatch] = useReducer(languageReducer, initialState);
  
    useEffect(() => {
      localStorage.setItem('language', state.language);
    }, [state.language]);
  
    return (
      <LanguageContext.Provider
        value={{
          language: state.language,
          translations: state.translations,
          dispatch,
        }}
      >
        {children}
      </LanguageContext.Provider>
    );
  };
  