import React, { useContext } from 'react';

import { LanguageContext } from '../context/LanguageContext';
import ServiceCard from '../components/Services/ServiceCard';
import { services } from '../assets/data/services';



const Services = () => {
  const { language } = useContext(LanguageContext);
console.log(language,"language")

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-[30px] mt-[30px] lg:mt-[55px]'>
      {services.map((item, index) => {
        const { name, desc } = item.translations[language] || item.translations["en"]; // fallback to English
        console.log("w",item.translations[language])  
        return (
          <ServiceCard
            key={index}
            item={{
              ...item,
              name,
              desc,
            }}
            index={index}
          />
        );
      })}
    </div>
  );
};

export default Services;
