import React, { useContext } from 'react'
import { formateDate } from '../../utils/formateDate'
import { LanguageContext } from '../../context/LanguageContext'

const DoctorAbout = ({name,about,qualifications,experiences,languages}) => {

  const {language} = useContext(LanguageContext)
  const translation = {
    'en':{
      about:'About of',
      education:'Education',
      experience:'Experience',
      languages:'Languages',
    },
    'kn':{
      about:'ಬಗ್ಗೆ',
      education:'ಶಿಕ್ಷಣ',
      experience:'ಅನುಭವ',
      languages:'ಭಾಷೆಗಳು',
    },
    'hi':{
      about:'के बारे में',
      education:'शिक्षा',
      experience:'अनुभव',
      languages:'भाषाएँ',
    },
    'te':{
      about:'గురించి',
      education:'విద్య',
      experience:'అనుభవం',
      languages:'భాషలు',
    },
    'fr':{
      about:'À propos de',
      education:'Éducation',
      experience:'Expérience',
      languages:'Langues',
    },

  }
console.log(translation, "translation")
console.log(language, "language")
  const t = translation[language]
  console.log(t, "t")
  const aboutText = t.about
  const educationText = t.education
  const experienceText = t.experience
  const languagesText = t.languages

  return (
    <div>
      <div>
        <h3 className="text-[20px] leading-[30px) ☐ text-headingColor font-semibold flex items-center gap-2">{aboutText}
          <span>{name}</span>
        </h3>
        <p className='text_para'>{about}</p>
      </div>

      <div className='mt-12'>
        <h3 className="text-[20px] leading-[30px) ☐ text-headingColor font-semibold flex items-center gap-2">{experienceText}</h3>

        <ul className=' pt-4 md:p-5'>
          {qualifications?.map((item,index)=>(<li key={index} className=' flex flex-col sm:flex-row sm:justify-between sm:items-end md:gap-5 mb-[30px] '>
            <div>
              <span className=' text-irisBlueColor text-[15px] leading-6 font-semibold '>{formateDate(item.startingDate)} - {formateDate(item.endingDate)}</span>
              <p className=' text-[16px] leading-6 font-medium text-textColor '>{item.degree}</p>
            </div>
            <p className=' text-[14px] leading-5 font-medium text-textColor'>{item.university}</p>
          </li>))}
          
        </ul>
      </div>

      <div className=' mt-12'>
      <h3 className="text-[20px] leading-[30px) ☐ text-headingColor font-semibold ">{educationText}
        </h3>

        <ul className="grid sm:grid-cols-2 gap-[30px] pt-4 md:p-5">
          {experiences?.map((item,index)=>(
            <li key={index} className='p-4 rounded bg-[#fff9ea]'  >
            <span className="text-yellowColor text-[15px] leading-6 font-semibold">{formateDate(item.startingDate)} - {formateDate(item.endingDate)}</span>
            <p className=' text-[15px] leading-6 font-medium text-textColor '>{item.position}</p>
            <p className=' text-[14px] leading-5 font-medium text-textColor'>{item.hospital}</p>
          </li>
          ))}
 
        </ul>

      </div>

      <div className=' mt-12'>
      <h3 className="text-[20px] leading-[30px) ☐ text-headingColor font-semibold ">{languagesText}
        </h3>

        <ul className="grid sm:grid-cols-2 gap-[30px] pt-4 md:p-5">
          {languages?.map((item,index)=>(
            <li key={index} className='p-4 rounded bg-[#cad7ff]'  >
            {item?.name}
          </li>
          ))}
 
        </ul>

      </div>
      

    </div>
  )
}

export default DoctorAbout