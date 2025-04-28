import React, { useEffect, useState, useRef, useContext } from 'react';
import DoctorCard from '../../components/Doctors/DoctorCard';
import Testimonial from '../../components/Testimonial/Testimonial';
import useFetchData from '../../hooks/useFetchData';
import Loading from '../../components/Loader/Loading';
import Error from '../../components/Error/Error';
import { BASE_URL } from '../../config';
import { Mic, MicOff } from 'lucide-react';
import { LanguageContext } from '../../context/LanguageContext';

const LANGUAGES = {
  'en': {
    name: 'English',
    code: 'en-US',
    translations: {
      findDoctor: 'Find a Doctor',
      searchPlaceholder: 'Search by name, specialization, or location',
      searchButton: 'Search',
      patientSays: 'What our patient says',
      genuineOpinions: 'Genuine opinions',
      selectLanguage: 'Select Language',
      startVoice: 'Start Voice Search',
      stopVoice: 'Stop Voice Search',
      listening: 'Listening...',
      noResults: 'No doctors found',
      translating: 'Translating...',
      error: 'Translation error',
      filters: {
        location: 'Location',
        specialization: 'Specialization',
        languages: 'Languages'
      }
    }
  },
  'hi': {
    name: 'हिंदी',
    code: 'hi-IN',
    translations: {
      findDoctor: 'डॉक्टर खोजें',
      searchPlaceholder: 'नाम, विशेषज्ञता या स्थान से खोजें',
      searchButton: 'खोजें',
      patientSays: 'हमारे मरीज क्या कहते हैं',
      genuineOpinions: 'वास्तविक राय',
      selectLanguage: 'भाषा चुनें',
      startVoice: 'आवाज से खोजें',
      stopVoice: 'आवाज खोज बंद करें',
      listening: 'सुन रहा हूं...',
      noResults: 'कोई डॉक्टर नहीं मिला',
      filters: {
        location: 'स्थान',
        specialization: 'विशेषज्ञता',
        languages: 'भाषाएं'
      }
    }
  },
  'kn': {
    name: 'ಕನ್ನಡ',
    code: 'kn-IN',
    translations: {
      findDoctor: 'ವೈದ್ಯರನ್ನು ಹುಡುಕಿ',
      searchPlaceholder: 'ಹೆಸರು, ವಿಶೇಷತೆ ಅಥವಾ ಸ್ಥಳದಿಂದ ಹುಡುಕಿ',
      searchButton: 'ಹುಡುಕಿ',
      patientSays: 'ನಮ್ಮ ರೋಗಿಗಳು ಏನು ಹೇಳುತ್ತಾರೆ',
      genuineOpinions: 'ನೈಜ ಅಭಿಪ್ರಾಯಗಳು',
      selectLanguage: 'ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ',
      startVoice: 'ಧ್ವನಿ ಹುಡುಕಾಟ',
      stopVoice: 'ಧ್ವನಿ ಹುಡುಕಾಟ ನಿಲ್ಲಿಸಿ',
      listening: 'ಆಲಿಸುತ್ತಿದೆ...',
      noResults: 'ಯಾವುದೇ ವೈದ್ಯರು ಕಂಡುಬಂದಿಲ್ಲ',
      filters: {
        location: 'ಸ್ಥಳ',
        specialization: 'ವಿಶೇಷತೆ',
        languages: 'ಭಾಷೆಗಳು'
      }
    }
  },
  'te': {
    name: 'తెలుగు',
    code: 'te-IN',
    translations: {
      findDoctor: 'వైద్యుడిని కనుగొనండి',
      searchPlaceholder: 'పేరు, స్పెషలైజేషన్ లేదా స్థానం ద్వారా శోధించండి',
      searchButton: 'శోధించు',
      patientSays: 'మా రోగి ఏమి చెబుతున్నారు',
      genuineOpinions: 'నిజమైన అభిప్రాయాలు',
      selectLanguage: 'భాష ఎంచుకోండి',
      startVoice: 'వాయిస్ శోధన ప్రారంభించండి',
      stopVoice: 'వాయిస్ శోధన ఆపండి',
      listening: 'వింటున్నాము...',
      noResults: 'వైద్యులు ఎవరూ కనుగొనబడలేదు',
      translating: 'అనువదిస్తోంది...',
      error: 'అనువాద లోపం',
      filters: {
        location: 'స్థానం',
        specialization: 'స్పెషలైజేషన్',
        languages: 'భాషలు'
      }
    }
  },
  'ta': {
    name: 'தமிழ்',
    code: 'ta-IN',
    translations: {
      findDoctor: 'மருத்துவரைக் கண்டுபிடி',
      searchPlaceholder: 'பெயர், சிறப்பு அல்லது இடத்தால் தேடுங்கள்',
      searchButton: 'தேடு',
      patientSays: 'எங்கள் நோயாளி என்ன சொல்கிறார்',
      genuineOpinions: 'உண்மையான கருத்துக்கள்',
      selectLanguage: 'மொழியை தேர்ந்தெடுக்கவும்',
      startVoice: 'குரல் தேடலைத் தொடங்கு',
      stopVoice: 'குரல் தேடலை நிறுத்து',
      listening: 'கேட்கிறேன்...',
      noResults: 'மருத்துவர்கள் யாரும் காணப்படவில்லை',
      translating: 'மொழிபெயர்க்கிறது...',
      error: 'மொழிபெயர்ப்பு பிழை',
      filters: {
        location: 'இடம்',
        specialization: 'சிறப்பு',
        languages: 'மொழிகள்'
      }
    }
  },
  'fr': {
    name: 'Français',
    code: 'fr-FR',
    translations: {
      findDoctor: 'Trouver un médecin',
      searchPlaceholder: 'Rechercher par nom, spécialisation ou lieu',
      searchButton: 'Rechercher',
      patientSays: 'Ce que disent nos patients',
      genuineOpinions: 'Avis authentiques',
      selectLanguage: 'Sélectionner la langue',
      startVoice: 'Démarrer la recherche vocale',
      stopVoice: 'Arrêter la recherche vocale',
      listening: 'Écoute en cours...',
      noResults: 'Aucun médecin trouvé',
      translating: 'Traduction en cours...',
      error: 'Erreur de traduction',
      filters: {
        location: 'Lieu',
        specialization: 'Spécialisation',
        languages: 'Langues'
      }
    }
  }
};

// Google Translate API function
const translateText = async (text, fromLang, toLang) => {
  if (!text?.trim() || fromLang === toLang) return text;
  
  try {
    const response = await fetch(
      `http://127.0.0.1:5000/translate`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          source: fromLang,
          target_language: toLang
        })
      }
    );

    if (!response.ok) throw new Error('Translation failed');
    
    const data = await response.json();

    console.log("Translated text:", data.translated_text);
    return data.translated_text;

  } catch (error) {
    console.error('Translation error:', error);
    throw error;
  }
};

const Doctors = () => {
  const [query, setQuery] = useState('');
  // const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [isListening, setIsListening] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [translationError, setTranslationError] = useState(null);
  const [filters, setFilters] = useState({
    location: '',
    specialization: '',
    languages: []
  });

  const {language:selectedLanguage} = useContext(LanguageContext);
  
  // Store the current transcript in progress
  const [currentTranscript, setCurrentTranscript] = useState('');
  
  // Create a ref to track if recognition is restarting
  const isRestartingRef = useRef(false);
  
  // Keep track of last search query to prevent unnecessary translations
  const lastSearchRef = useRef('');

  const { data: allDoctors, loading, error } = useFetchData(`${BASE_URL}/doctor`);

  // Debounced search function
  const searchDoctors = async (searchQuery, doctors) => {
    if (!doctors) return [];
    console.log("Seacr",searchQuery)
    let filtered = [...doctors];
    setTranslationError(null);
    
    if (searchQuery.trim()) {
      try {
        setIsTranslating(true);
        
        // Skip unnecessary translation if query hasn't changed
        if (searchQuery.trim() === lastSearchRef.current) {
          setIsTranslating(false);
          return filtered.filter(doctor => doctor.isApproved === "approved");
        }
        
        lastSearchRef.current = searchQuery.trim();
        console.log('in the searchDoctors function:', searchQuery,selectedLanguage);
        // Translate search query to English for searching if not already in English
        let translatedData= searchQuery;
        if (selectedLanguage !== 'en') {
          console.log('Translating query:', searchQuery, selectedLanguage);
          const data = await translateText(searchQuery, selectedLanguage, 'en');
          console.log('Translated query:', data);
          translatedData = data;
          // console.log(`Translated query from ${selectedLanguage} to English:`, translatedQuery);
        }
        
        const searchTerms = translatedData?.toLowerCase().split(' ').filter(term => term);
        console.log('Search terms:', searchTerms);
        filtered = filtered.filter(doctor => {
          const searchableFields = [
            doctor.name,
            doctor.specialization,
            doctor.location,
            doctor.bio,
            doctor.about,
            ...(doctor.languages || [])
          ].map(field => (field || '').toString().toLowerCase());

          return searchTerms.some(term =>
            searchableFields.some(field => field.includes(term))
          );
        });
      } catch (error) {
        // setTranslationError(texts.error);
        console.error('Search error:', error);
      } finally {
        setIsTranslating(false);
      }
    }

    // Apply filters with translation
    if (filters.location) {
      try {
        let translatedLocation = filters.location;
        if (selectedLanguage !== 'en') {
          translatedLocation = await translateText(filters.location, selectedLanguage, 'en');
        }
        filtered = filtered.filter(doctor => 
          doctor.location?.toLowerCase().includes(translatedLocation.toLowerCase())
        );
      } catch (error) {
        console.error('Location translation error:', error);
      }
    }

    if (filters.specialization) {
      try {
        let translatedSpecialization = filters.specialization;
        if (selectedLanguage !== 'en') {
          translatedSpecialization = await translateText(filters.specialization, selectedLanguage, 'en');
        }
        filtered = filtered.filter(doctor => 
          doctor.specialization?.toLowerCase().includes(translatedSpecialization.toLowerCase())
        );
      } catch (error) {
        console.error('Specialization translation error:', error);
      }
    }

    if (filters.languages.length > 0) {
      filtered = filtered.filter(doctor => 
        doctor.languages?.some(lang => 
          filters.languages.includes(lang.toLowerCase())
        )
      );
    }

    return filtered.filter(doctor => doctor.isApproved === "approved");
  };

  // Reset query when language changes
  useEffect(() => {
    setQuery('');
    lastSearchRef.current = '';
    
    // Reset filtered doctors to show all approved doctors
    if (allDoctors) {
      setFilteredDoctors(allDoctors.filter(doctor => doctor.isApproved === "approved"));
    }
  }, [selectedLanguage]);

  // Debounced effect for search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (allDoctors) {
        searchDoctors(query, allDoctors).then(setFilteredDoctors);
      }
    }, 500); // Debounce delay of 500ms

    return () => clearTimeout(timeoutId);
  }, [query, allDoctors, filters, selectedLanguage]);

  // Clean up recognition on unmount
  useEffect(() => {
    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, [recognition]);

  // Speech recognition setup
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        // Stop any existing recognition
        if (recognition) {
          recognition.stop();
          setIsListening(false);
        }

        const newRecognition = new SpeechRecognition();
        newRecognition.continuous = false; // Change to false to get complete phrases
        newRecognition.interimResults = true;
        newRecognition.lang = LANGUAGES[selectedLanguage].code;

        newRecognition.onstart = () => {
          setIsListening(true);
          setCurrentTranscript(''); // Reset transcript on start
        };

        newRecognition.onresult = (event) => {
          // Get latest transcript
          const transcript = Array.from(event.results)
            .map(result => result[0].transcript)
            .join(' ');
            
          // Update the current transcript
          setCurrentTranscript(transcript);
          
          // If it's final, update the query
          if (event.results[0].isFinal) {
            setQuery(prevQuery => {
              // If query is empty, just use the transcript
              // Otherwise, append with a space
              return prevQuery.trim() ? `${prevQuery.trim()} ${transcript.trim()}` : transcript.trim();
            });
            setCurrentTranscript('');
          }
        };

        newRecognition.onerror = (event) => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);
        };

        newRecognition.onend = () => {
          setIsListening(false);
          
          // If we need to restart, do it now
          if (isRestartingRef.current && !isListening) {
            isRestartingRef.current = false;
            
            // Small delay to prevent rapid restarts
            setTimeout(() => {
              newRecognition.start();
            }, 100);
          }
        };

        setRecognition(newRecognition);
      }
    }
  }, [selectedLanguage]);

  const toggleVoiceSearch = () => {
    if (!recognition) return;

    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      // Clear current transcript when starting new session
      setCurrentTranscript('');
      recognition.start();
    }
  };

  const texts = LANGUAGES[selectedLanguage].translations;
  
  return (
    <>
      <section className='bg-[#fff9ea]'>
        <div className='container text-center'>
         
          
          <h2 className='heading'>{texts?.findDoctor}</h2>
          <div className="max-w-[570px] mt-[30px] mx-auto bg-[#0066ff2c] rounded-md flex items-center justify-between relative">
            <input
              type="search"
              className="py-4 pl-4 pr-2 bg-transparent w-full focus:outline-none cursor-pointer placeholder:text-textColor"
              placeholder={texts.searchPlaceholder}
              value={isListening ? `${query} ${currentTranscript}` : query}
              onChange={e => setQuery(e.target.value)}
            />
            {isTranslating && (
              <span className="absolute right-16 text-sm text-gray-500">
                {texts.translating}
              </span>
            )}
            {translationError && (
              <span className="absolute right-16 text-sm text-red-500">
                {translationError}
              </span>
            )}
            <button
              className={`btn mt-0 rounded-[0px] rounded-r-md flex items-center justify-center gap-2 ${
                isListening ? 'bg-red-500 hover:bg-red-600' : ''
              }`}
              onClick={toggleVoiceSearch}
              title={isListening ? texts.stopVoice : texts.startVoice}
            >
              {isListening ? (
                <>
                  <MicOff size={20} />
                  <span className="hidden md:inline">{texts.listening}</span>
                </>
              ) : (
                <Mic size={20} />
              )}
            </button>
          </div>
        </div>
      </section>

      <section>
        <div className="container">
          {loading && !error && <Loading />}
          {!loading && error && <Error errMessage={error.message} />}
          {!loading && !error && (
            <>
              {filteredDoctors.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-lg text-gray-600">{texts.noResults}</p>
                </div>
              ) : (
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-[30px]'>
                  {filteredDoctors.map((doctor) => (
                    <DoctorCard 
                      doctor={doctor} 
                      key={doctor._id}
                      language={selectedLanguage}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      
    </>
  );
};

export default Doctors;