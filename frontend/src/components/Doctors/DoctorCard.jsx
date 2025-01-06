import React, { useState, useEffect } from 'react';
import starIcon from '../../assets/images/Star.png';
import { Link, useNavigate } from 'react-router-dom';
import { BsArrowRight } from 'react-icons/bs';
import { AiOutlineDelete } from 'react-icons/ai';
import { BsChatDots } from 'react-icons/bs';
import { token } from '../../config';
import { toast } from 'react-toastify';

const TRANSLATIONS = {
  'en': {
    at: 'At',
    location: 'Location',
    languages: 'Languages',
    deleteSuccess: 'Booking deleted successfully',
    deleteEmailSent: 'Booking delete email sent',
    chat: 'Chat with doctor',
    viewProfile: 'View doctor profile',
    delete: 'Delete booking',
    ratings: 'ratings',
  },
  'hi': {
    at: 'में',
    location: 'स्थान',
    languages: 'भाषाएं',
    deleteSuccess: 'बुकिंग सफलतापूर्वक हटा दी गई',
    deleteEmailSent: 'बुकिंग हटाने की ईमेल भेज दी गई',
    chat: 'डॉक्टर से चैट करें',
    viewProfile: 'डॉक्टर की प्रोफाइल देखें',
    delete: 'बुकिंग हटाएं',
    ratings: 'रेटिंग',
  },
  'kn': {
    at: 'ನಲ್ಲಿ',
    location: 'ಸ್ಥಳ',
    languages: 'ಭಾಷೆಗಳು',
    deleteSuccess: 'ಬುಕ್ಕಿಂಗ್ ಯಶಸ್ವಿಯಾಗಿ ಅಳಿಸಲಾಗಿದೆ',
    deleteEmailSent: 'ಬುಕ್ಕಿಂಗ್ ಅಳಿಸುವ ಇಮೇಲ್ ಕಳುಹಿಸಲಾಗಿದೆ',
    chat: 'ವೈದ್ಯರೊಂದಿಗೆ ಚಾಟ್ ಮಾಡಿ',
    viewProfile: 'ವೈದ್ಯರ ಪ್ರೊಫೈಲ್ ವೀಕ್ಷಿಸಿ',
    delete: 'ಬುಕ್ಕಿಂಗ್ ಅಳಿಸಿ',
    ratings: 'ರೇಟಿಂಗ್‌ಗಳು',
  }
};

const DoctorCard = ({ doctor, booking, bookingId, language = 'en' }) => {
  const {
    _id,
    name,
    specialization,
    averageRating,
    totalRating,
    photo,
    experiences,
    location,
    languages: doctorLanguages
  } = doctor;
  
  const [translatedName, setTranslatedName] = useState(name);
  const [translatedSpecialization, setTranslatedSpecialization] = useState(specialization);
  const navigate = useNavigate();
  const texts = TRANSLATIONS[language] || TRANSLATIONS.en;

  const translate = async (text) => {
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
            target_language: language,
          })
        }
      );

      if (!response.ok) throw new Error('Translation failed');

      const data = await response.json();
      console.log("tt",data.translated_text)
      return data.translated_text;

    } catch (error) {
      console.error('Translation error:', error);
      throw error;
    }
  };

  useEffect(() => {
    const translateFields = async () => {
      try {
        const [translatedNameResult, translatedSpecResult] = await Promise.all([
          translate(name),
          translate(specialization)
        ]);
        setTranslatedName(translatedNameResult);
        setTranslatedSpecialization(translatedSpecResult);
      } catch (error) {
        console.error('Translation error:', error);
      }
    };

    if (language !== 'en') {
      translateFields();
    }
  }, [name, specialization, language]);

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/v1/bookings/${bookingId}`, {
        method: 'delete',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message);
      }

      toast.success(texts.deleteSuccess);
      toast.success(texts.deleteEmailSent);
      navigate('/home');
    } catch (error) {
      toast.error(error.message);
    }
  };



  return (
    <div className='p-3 lg:p-5'>
      <div>
        <img src={photo} alt={translatedName} className="w-full rounded-lg" />
      </div>

      <h2 className='text-[18px] leading-[30px] text-headingColor lg:text-[26px] lg:leading-9 font-[700] left-3 lg:mt-5'>
        {translatedName}
      </h2>

      <div className='mt-2 lg:mt-4 flex items-center justify-between'>
        <span className='bg-[#CCF0F3] text-irisBlueColor py-1 px-2 lg:py-2 lg:px-6 text-[12px] leading-4 lg:text-[16px] lg:leading-7 font-semibold rounded'>
          {translatedSpecialization}
        </span>

        <div className='flex items-center gap-[6px]'>
          <span className='flex items-center gap-[6px] text-[14px] leading-6 lg:text-[16px] lg:leading-7 font-semibold text-headingColor'>
            <img src={starIcon} alt="rating" /> {averageRating?.toFixed(2)}
          </span>
          <span className='text-[14px] leading-6 lg:text-[16px] lg:leading-7 font-[400] text-textColor'>
            ({totalRating})
          </span>
        </div>
      </div>

      <div className='mt-[18px] lg:mt-5 flex items-center justify-between'>
        <div>
          <p className='text-[14px] leading-6 font-[400] text-textColor'>
            {texts.at} {experiences && experiences[0]?.hospital}
          </p>
          <p className='text-[14px] leading-6 font-[400] text-textColor'>
            {texts.location} - {location}
          </p>
          <p className='text-[14px] leading-6 font-[400] text-textColor'>
            {texts.languages} - {doctorLanguages?.map(lang => lang.name).join(', ')}
          </p>
        </div>

        {!booking && (
          <Link 
            to={`/doctors/${doctor._id}`}
            className='w-[44px] h-[44px] rounded-full border border-solid border-[#181A1E] flex items-center justify-center group hover:bg-primaryColor hover:border-none'
            title={texts.viewProfile}
          >
            <BsArrowRight className='group-hover:text-white w-6 h-5' />
          </Link>
        )}
      </div>

      {booking && (
        <div className='flex items-center justify-around mt-4'>
          <div 
            onClick={() => navigate(`/chat/${_id}`)}
            className="cursor-pointer"
            title={texts.chat}
          >
            <BsChatDots size={25} fill='green' />
          </div>

          <div 
            onClick={handleDelete}
            className="cursor-pointer"
            title={texts.delete}
          >
            <AiOutlineDelete size={30} fill='red' />
          </div>

          <Link 
            to={`/doctors/${doctor._id}`}
            className='w-[44px] h-[44px] rounded-full border border-solid border-[#181A1E] flex items-center justify-center group hover:bg-primaryColor hover:border-none'
            title={texts.viewProfile}
          >
            <BsArrowRight className='group-hover:text-white w-6 h-5' />
          </Link>
        </div>
      )}
    </div>
  );
};

export default DoctorCard;