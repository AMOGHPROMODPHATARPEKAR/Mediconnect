import React from 'react'
import aboutImg from '../../assets/images/about.png';
import aboutCardImg from '../../assets/images/about-card.png';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { LanguageContext } from '../../context/LanguageContext';

const About = () => {
    const {language } = useContext(LanguageContext);
    const translations= {
        en: {
        
            heading: "Proud to be one of the nation's best",
            description1: "At our health system, we are dedicated to delivering world-class care for everyone. Our team of expert healthcare professionals ensures unmatched treatment and personalized service, from advanced laboratory research to comprehensive clinical care.",
            description2: "We are committed to improving the health and well-being of our community with cutting-edge technology and compassionate care. Trust us to be your partner in health, providing exceptional services every step of the way.",
            learnMore: "Learn more"
          
        },
        kn: {
          
            heading: "ದೇಶದ ಶ್ರೇಷ್ಠರಲ್ಲಿ ಒಬ್ಬರಾಗಿರುವುದರಲ್ಲಿ ನಮಗೆ ಹೆಮ್ಮೆ",
            description1: "ನಮ್ಮ ಆರೋಗ್ಯ ವ್ಯವಸ್ಥೆಯಲ್ಲಿ, ನಾವು ಪ್ರತಿಯೊಬ್ಬರಿಗೂ ಪ್ರಪಂಚದ ಮಟ್ಟದ ಆರೈಕೆ ನೀಡಲು ಬದ್ಧರಾಗಿದ್ದೇವೆ. ನಮ್ಮ ತಜ್ಞ ವೈದ್ಯಕೀಯ ವೃತ್ತಿಪರರ ತಂಡವು ಉನ್ನತ ಪ್ರಯೋಗಶಾಲಾ ಸಂಶೋಧನೆಯಿಂದ ಆರಂಭಿಸಿ ಸಂಪೂರ್ಣ ಕ್ಲಿನಿಕಲ್ ಆರೈಕೆವರೆಗೆ ವಿಶಿಷ್ಟ ಚಿಕಿತ್ಸೆ ಮತ್ತು ವೈಯಕ್ತಿಕ ಸೇವೆಯನ್ನು ಖಚಿತಪಡಿಸುತ್ತದೆ.",
            description2: "ಉನ್ನತ ತಂತ್ರಜ್ಞಾನ ಮತ್ತು ಸಾನ್ನಿಧ್ಯಪೂರ್ಣ ಆರೈಕೆಯೊಂದಿಗೆ ನಮ್ಮ ಸಮುದಾಯದ ಆರೋಗ್ಯ ಮತ್ತು ಕಲ್ಯಾಣವನ್ನು ಹೆಚ್ಚಿಸಲು ನಾವು ಬದ್ಧರಾಗಿದ್ದೇವೆ. ಆರೋಗ್ಯದಲ್ಲಿ ನಿಮ್ಮ ಪಾಲುದಾರರಾಗಲು ನಮ್ಮ ಮೇಲೆ ನಂಬಿಕೆ ಇಡಿ.",
            learnMore: "ಇನ್ನಷ್ಟು ತಿಳಿಯಿರಿ"
          
        },
        hi: {
      
            heading: "देश के सर्वश्रेष्ठ में से एक होने पर गर्व है",
            description1: "हमारी स्वास्थ्य प्रणाली में, हम सभी के लिए विश्व स्तरीय देखभाल प्रदान करने के लिए समर्पित हैं। हमारे विशेषज्ञ स्वास्थ्य पेशेवरों की टीम उन्नत प्रयोगशाला अनुसंधान से लेकर व्यापक नैदानिक देखभाल तक सर्वोत्तम उपचार और व्यक्तिगत सेवा सुनिश्चित करती है।",
            description2: "हम अत्याधुनिक तकनीक और सहानुभूतिपूर्ण देखभाल के साथ अपने समुदाय के स्वास्थ्य और कल्याण को बेहतर बनाने के लिए प्रतिबद्ध हैं। स्वास्थ्य में आपके साथी बनने के लिए हम पर विश्वास करें।",
            learnMore: "और जानें"
          
        },
        fr: {
         
            heading: "Fiers d'être parmi les meilleurs du pays",
            description1: "Dans notre système de santé, nous nous engageons à fournir des soins de classe mondiale à tous. Notre équipe de professionnels de santé experts garantit un traitement inégalé et un service personnalisé, allant de la recherche avancée en laboratoire aux soins cliniques complets.",
            description2: "Nous nous engageons à améliorer la santé et le bien-être de notre communauté grâce à une technologie de pointe et à des soins empreints de compassion. Faites-nous confiance pour être votre partenaire santé à chaque étape.",
            learnMore: "En savoir plus"
          
        },
        te: {
   
            heading: "దేశంలోని ఉత్తములలో ఒకరమయ్యామని గర్వపడుతున్నాము",
            description1: "మా ఆరోగ్య వ్యవస్థలో, ప్రతి ఒక్కరికి ప్రపంచ స్థాయి సేవలు అందించేందుకు మేము కట్టుబడి ఉన్నాము. మా నిపుణుల వైద్య బృందం ఆధునిక ప్రయోగశాలా పరిశోధన నుండి సంపూర్ణ క్లినికల్ సేవల వరకు అత్యుత్తమ చికిత్సను మరియు వ్యక్తిగత సేవను అందిస్తుంది.",
            description2: "కట్‌టింగ్ ఎడ్జ్ టెక్నాలజీ మరియు సానుభూతితో కూడిన సేవల ద్వారా మా సమాజ ఆరోగ్యాన్ని మెరుగుపరచడానికి మేము కట్టుబడి ఉన్నాము. ఆరోగ్య పరిరక్షణలో మీ భాగస్వామిగా మమ్మల్ని నమ్మండి.",
            learnMore: "మరింత తెలుసుకోండి"
          
        }
      }
      
const t = translations[language];

  return <section>
    <div className=' container '>
        <div className=' flex justify-between  gap-[50px] lg:gap-[130px] xl:gap-0 flex-col lg:flex-row  '>
            <div className=' relative w-3/4 lg:w-1/2 xl:w-[770px] z-10 order-2 lg:order-1 '>
                <img src={aboutImg} alt="" />
                <div className=' absolute z-20 bottom-4 w-[200px] md:w-[300px] right-[-30%] md:right-[-7%] lg:right-[22%] '>
                    <img src={aboutCardImg} alt="" />
                </div>
            </div>
        
        <div className=' w-full lg:w-1/2 xl:w-[670px] order-1 lg:order-2 '>
            <h2 className=' heading  '>{t.heading}</h2>
            <p className='text_para '>{t.description1}</p>

            <p className=' text_para '>{t.description2}</p>

        <Link to='/'>
        <button className=' btn'>{t.learnMore}</button>
        </Link>

        </div>


        </div>
    </div>
  </section>
}

export default About