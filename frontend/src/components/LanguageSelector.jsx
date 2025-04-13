import { useState, useContext, useRef, useEffect } from 'react';
import { LanguageContext } from '../context/LanguageContext';

const LanguageSelector = () => {
  const { language, dispatch, translations } = useContext(LanguageContext);
  const [isOpen, setIsOpen] = useState(false);
  const [notification, setNotification] = useState('');
  const dropdownRef = useRef(null);
  const availableLanguages = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'Hindi' },
    { code: 'kn', name: 'Kannada' },
    { code: 'te', name: 'Telugu' },
    { code: 'fr', name: 'French' },
  ];

  const languageChangedMsg = {
    'en': 'Language changed successfully',
    'hi': 'भाषा सफलतापूर्वक बदल दी गई',
    'kn': 'ಭಾಷೆ ಯಶಸ್ವಿಯಾಗಿ ಬದಲಾಯಿಸಲಾಗಿದೆ',
    'te': 'భాష విజయవంతంగా మార్చబడింది',
    'fr': 'Langue changée avec succès',
  };

  const t = translations;

  const handleLanguageChange = (langCode) => {
    console.log('Language changed to:', langCode);
    dispatch({ type: 'CHANGE_LANGUAGE', payload: langCode });
    setIsOpen(false);

    localStorage.setItem('selectedLanguage', langCode);
    setNotification(languageChangedMsg[langCode] || 'Language changed successfully');

    setTimeout(() => {
      setNotification('');
    }, 3000);
  };



  const getLanguageName = (code) => {
    const lang = availableLanguages?.find((l) => l.code === code);
    return lang ? lang.name : code;
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="language-selector relative" ref={dropdownRef}>
      <button
        className="bg-primaryColor text-white rounded-full px-4 py-2 flex items-center gap-2"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="material-icons text-lg">language</span>
        <span>{getLanguageName(language)}</span>
        <span className="material-icons text-lg">{isOpen ? 'expand_less' : 'expand_more'}</span>
      </button>

      {isOpen && (
        <div className="absolute bottom-14 left-0 z-50 bg-white rounded-lg shadow-lg py-2 min-w-[160px]">
          <h3 className="px-4 py-2 text-gray-500 text-sm font-medium border-b">
            {t.selectLanguage || 'Select Language'}
          </h3>
          <div className="max-h-60 overflow-y-auto">
            {availableLanguages.map((lang) => (
              <button
                key={lang.code}
                className={`px-4 py-2 text-left w-full hover:bg-gray-100 flex items-center gap-2 ${
                  language === lang.code ? 'bg-gray-100 font-medium text-primaryColor' : ''
                }`}
                onClick={() => handleLanguageChange(lang.code)}
              >
                {lang.name}
                {language === lang.code && (
                  <span className="material-icons text-primaryColor ml-auto text-lg">check</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {notification && (
        <div className="absolute bottom-14 right-0 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg transition-all">
          {notification}
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
