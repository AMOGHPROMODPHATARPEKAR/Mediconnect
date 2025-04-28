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
  },
  'te': {
    at: 'లో',
    location: 'ప్రదేశం',
    languages: 'భాషలు',
    deleteSuccess: 'బుకింగ్ విజయవంతంగా తొలగించబడింది',
    deleteEmailSent: 'బుకింగ్ తొలగింపు ఇమెయిల్ పంపబడింది',
    chat: 'డాక్టర్‌తో చాట్ చేయండి',
    viewProfile: 'డాక్టర్ ప్రొఫైల్ చూడండి',
    delete: 'బుకింగ్ తొలగించు',
    ratings: 'రేటింగ్స్',
  },
  'fr': {
    at: 'À',
    location: 'Emplacement',
    languages: 'Langues',
    deleteSuccess: 'Réservation supprimée avec succès',
    deleteEmailSent: 'E-mail de suppression de réservation envoyé',
    chat: 'Discuter avec le médecin',
    viewProfile: 'Voir le profil du médecin',
    delete: 'Supprimer la réservation',
    ratings: 'évaluations',
  },  

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
  
  
  const navigate = useNavigate();
  const texts = TRANSLATIONS[language] || TRANSLATIONS.en;


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
        <img src={photo} alt={name} className="w-full rounded-lg" />
      </div>

      <h2 className='text-[18px] leading-[30px] text-headingColor lg:text-[26px] lg:leading-9 font-[700] left-3 lg:mt-5'>
        {name}
      </h2>

      <div className='mt-2 lg:mt-4 flex items-center justify-between'>
        <span className='bg-[#CCF0F3] text-irisBlueColor py-1 px-2 lg:py-2 lg:px-6 text-[12px] leading-4 lg:text-[16px] lg:leading-7 font-semibold rounded'>
          {specialization}
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