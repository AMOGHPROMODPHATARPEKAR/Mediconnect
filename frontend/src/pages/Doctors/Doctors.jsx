import React, { useEffect, useState } from 'react';
import DoctorCard from '../../components/Doctors/DoctorCard';
import Testimonial from '../../components/Testimonial/Testimonial';
import useFetchData from '../../hooks/useFetchData';
import Loading from '../../components/Loader/Loading';
import Error from '../../components/Error/Error';
import { BASE_URL } from '../../config';
import { Mic, MicOff } from 'lucide-react';


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
          source: fromLang === 'en' ? 'en' : fromLang,
          target_language: toLang === 'en' ? 'en' : toLang,
          
        })
      }
    );

    if (!response.ok) throw new Error('Translation failed');

    const data = await response.json();
    console.log("dfd",data.translated_text)
    return data.translated_text;
  } catch (error) {
    console.error('Translation error:', error);
    throw error;
  }
};

const Doctors = () => {
  const [query, setQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('en');
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

  const { data: allDoctors, loading, error } = useFetchData(`${BASE_URL}/doctor`);

  // Debounced search function
  const searchDoctors = async (searchQuery, doctors) => {
    if (!doctors) return [];
    
    let filtered = [...doctors];
    setTranslationError(null);
    
    if (searchQuery.trim()) {
      try {
        setIsTranslating(true);
        // Translate search query to English for searching
        const translatedQuery = await translateText(searchQuery, selectedLanguage, 'en');
        const searchTerms = translatedQuery.toLowerCase().split(' ').filter(term => term);
        console.log("trs",translatedQuery,searchTerms )
        filtered = filtered.filter(doctor => {
          const searchableFields = [
            doctor.name,
            doctor.specialization,
            doctor.location,
            doctor.bio,
            doctor.about,
            ...(doctor.languages || [])
          ].map(field => (field || '').toString().toLowerCase());

          return searchTerms.every(term =>
            searchableFields.some(field => field.includes(term))
          );
        });
      } catch (error) {
        setTranslationError(texts.error);
        console.error('Search error:', error);
      } finally {
        setIsTranslating(false);
      }
    }

    // Apply filters with translation
    if (filters.location) {
      try {
        const translatedLocation = await translateText(filters.location, selectedLanguage, 'en');
        filtered = filtered.filter(doctor => 
          doctor.location?.toLowerCase().includes(translatedLocation.toLowerCase())
        );
      } catch (error) {
        console.error('Location translation error:', error);
      }
    }

    if (filters.specialization) {
      try {
        const translatedSpecialization = await translateText(filters.specialization, selectedLanguage, 'en');
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

  // Debounced effect for search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (allDoctors) {
        searchDoctors(query, allDoctors).then(setFilteredDoctors);
      }
    }, 500); // Debounce delay of 500ms

    return () => clearTimeout(timeoutId);
  }, [query, allDoctors, filters, selectedLanguage]);

  // Speech recognition setup
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const newRecognition = new SpeechRecognition();
        newRecognition.continuous = true;
        newRecognition.interimResults = true;
        newRecognition.lang = LANGUAGES[selectedLanguage].code;

        newRecognition.onresult = (event) => {
          const transcript = Array.from(event.results)
            .map(result => result[0].transcript)
            .join('');
          setQuery(prev => prev + ' ' + transcript);
        };

        newRecognition.onerror = (event) => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);
        };

        newRecognition.onend = () => {
          setIsListening(false);
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
      recognition.start();
      setIsListening(true);
    }
  };

  // console.log(LANGUAGES[selectedLanguage])
  const texts = LANGUAGES[selectedLanguage].translations;
  return (
    <>
      <section className='bg-[#fff9ea]'>
        <div className='container text-center'>
          <div className="mb-4">
            <select 
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="py-2 px-4 rounded-md border border-gray-300 focus:outline-none focus:border-primary"
            >
              {Object.entries(LANGUAGES).map(([code, lang]) => (
                <option key={code} value={code}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>
          
          <h2 className='heading'>{texts?.findDoctor}</h2>
          <div className="max-w-[570px] mt-[30px] mx-auto bg-[#0066ff2c] rounded-md flex items-center justify-between relative">
            <input
              type="search"
              className="py-4 pl-4 pr-2 bg-transparent w-full focus:outline-none cursor-pointer placeholder:text-textColor"
              placeholder={texts.searchPlaceholder}
              value={query}
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

      <section>
        <div className='container'>
          <div className='xl:w-[470px] mx-auto'>
            <h2 className='heading text-center'>{texts.patientSays}</h2>
            <p className='text_para text-center'>{texts.genuineOpinions}</p>
          </div>
          <Testimonial language={selectedLanguage} />
        </div>
      </section>
    </>
  );
};

export default Doctors;