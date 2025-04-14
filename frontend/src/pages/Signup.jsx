import React, { useContext, useState } from 'react'
import signupImg from '../assets/images/signup.gif'
import { Link, useNavigate } from 'react-router-dom'
import uploadToCloudinary from '../utils/uploadToCloudinary.js'
import { toast } from 'react-toastify'
import HashLoader from 'react-spinners/HashLoader.js'
import { LanguageContext } from '../context/LanguageContext.jsx'

const Signup = () => {

  const [selectedFile,setSelectedFile] = useState(null)
  const [previewURL,setPreviewURL] =useState("")
  const [loading,setLoading] = useState(false)
  const {language} = useContext(LanguageContext)
  console.log(language)
  const translation = {
    en:{
      create:'Create an Account',
      name:'Enter your Full Name',
      email:'Enter your Email',
      password:'Password',
      role:'Role',
      patient:'Patient',
      doctor:'Doctor',
      gender:'Gender',
      male:'Male',
      female:'Female',
      others:'Others',
      upload:'Upload Photo',
      signup:'Sign Up',
      signin:'Sign-In',
      already:'Already have an account?',
    },
    hi:{
      create:'एक खाता बनाएं',
      name:'अपना पूरा नाम दर्ज करें',
      email:'अपना ईमेल दर्ज करें',
      password:'पासवर्ड',
      role:'भूमिका',
      patient:'रोगी',
      doctor:'डॉक्टर',
      gender:'लिंग',
      male:'पुरुष',
      female:'महिला',
      others:'अन्य',
      upload:'फोटो अपलोड करें',
      signup:'साइन अप करें',
      signin:'साइन इन करें',
      already:'क्या आपके पास पहले से एक खाता है?',
    },
    kn:{
      create:'ಖಾತೆ ರಚಿಸಿ',
      name:'ನಿಮ್ಮ ಸಂಪೂರ್ಣ ಹೆಸರು ನಮೂದಿಸಿ',
      email:'ನಿಮ್ಮ ಇಮೇಲ್ ನಮೂದಿಸಿ',
      password:'ಪಾಸ್ವರ್ಡ್',
      role:'ಪಾತ್ರ',
      patient:'ರೋಗಿ', 
      doctor:'ಡಾಕ್ಟರ್',
      gender:'ಲಿಂಗ',
      male:'ಪುರುಷ',
      female:'ಸ್ತ್ರೀ',
      others:'ಇತರರು',
      upload:'ಚಿತ್ರವನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ',
      signup:'ಸೈನ್ ಅಪ್ ಮಾಡಿ',
      signin:'ಸೈನ್ ಇನ್ ಮಾಡಿ',
      already:'ನಿಮ್ಮ ಬಳಿ ಈಗಾಗಲೇ ಖಾತೆ ಇದೆಯೇ?',
    },
    te:{
      create:'ఖాతా సృష్టించండి',
      name:'మీ పూర్తి పేరు నమోదు చేయండి',
      email:'మీ ఇమెయిల్ నమోదు చేయండి',
      password:'పాస్వర్డ్',
      role:'పాత్ర',
      patient:'రోగి',
      gender:'లింగం',
      male:'పురుషుడు',
      female:'స్త్రీ',
      others:'ఇతరులు',
      upload:'చిత్రాన్ని అప్‌లోడ్ చేయండి',
      signup:'సైన్ అప్ చేయండి',
      signin:'సైన్ ఇన్ చేయండి',
      already:'మీకు ఇప్పటికే ఖాతా ఉందా?',

    },
    fr:{
      create:'Créer un compte',
      name:'Entrez votre nom complet',
      email:'Entrez votre e-mail',
      password:'Mot de passe',
      role:'Rôle',
      patient:'Patient',
      doctor:'Médecin',
      gender:'Genre',
      male:'Homme',
      female:'Femme',
      others:'Autres',
      upload:'Télécharger la photo',
      signup:'S’inscrire',
      signin:'Se connecter',
      already:'Vous avez déjà un compte?',
    },


  }
  const t = translation[language]

  const navigate = useNavigate()

  const [formData,setFormData] = useState({
    name:'',
    email:'',
    password:'',
    photo:selectedFile,
    gender:'male',
    role:'patient'

  })

  const handleChange = (e) =>{
    setFormData({...formData, [e.target.name]:e.target.value})
    
  }

  const handleFileInput = async(e)=>{
    const file = e.target.files[0]
    
    const data = await uploadToCloudinary(file);

    if(!data)
      {
        console.error("Error in uploading in cloudinary")
        return
      }
console.log(data)
    setPreviewURL(data.url)
    setSelectedFile(data.url)
    setFormData({...formData,photo:data.url})

  }

  const submitHandler = async(e)=>{

    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/v1/auth/register',{
        method:'post',
        headers:{
          'Content-Type':'application/json'
        },
        body:JSON.stringify(formData)
      })
  
      const {message} = await res.json();
  
      if(!res.ok){
        throw new Error(message);
      }
  
      toast.success(message)
      navigate('/login')
    } catch (error) {
      
      toast.error(error.message)

    }finally{
      setLoading(false)
    }


  }

  

  return <section className="px-5" >
    <div className="max-w-[1170px] mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div className="hidden lg:block bg-primaryColor rounded-l-lg">
          <figure className="rounded-l-lg">
            <img src={signupImg} alt="" className="w-full rounded-l-lg" />
          </figure>
        </div>

        <div className="rounded-l-lg lg:pl-16 py-10">
          <h3 className="text-heading Color text-[22px] leading-9 font-bold mb-10">{t.create}</h3>

          <form onSubmit={submitHandler}>
          <div className=' mb-5'>
            <input type="text" placeholder={t.name}  
            name='name' 
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-3 border-b border-solid border-[#0066ff61] focus:outline-none focus:border-b-primaryColor text-[16px] leading-7 text-headingColor placeholder:text-textColor cursor-pointer"
            required
            />
          </div>
          <div className=' mb-5'>
            <input type="email"
             placeholder={t.email} 
             value={formData.email}
            onChange={handleChange}
            name='email' 
            className="w-full px-4 py-3 border-b border-solid border-[#0066ff61] focus:outline-none focus:border-b-primaryColor text-[16px] leading-7 text-headingColor placeholder:text-textColor cursor-pointer"
            required
            />
            </div>
          <div className=' mb-5'>
            <input type="password"
             placeholder={t.password} 
             value={formData.password}
            onChange={handleChange}
            name='password' 
            className="w-full px-4 py-3 border-b border-solid border-[#0066ff61] focus:outline-none focus:border-b-primaryColor text-[16px] leading-7 text-headingColor placeholder:text-textColor cursor-pointer"
            required
            />
          </div>


          <div className="mb-5 flex items-center justify-between gap-3">
            <label className="text-heading Color font-bold text-[16px] leading-7">
              {t.role}
              <select name="role" 
              value={formData.role}
              onChange={handleChange}
              className="text-textColor font-semibold text-[15px] leading-7 px-4 py-3
focus:outline-none">
                <option value="patient">{t.patient}</option>
                <option value="doctor">{t.doctor}</option>
              </select>
            </label>
            <label className="text-headingColor font-bold text-[16px] leading-7">
              {t.gender}:
              <select name="gender" 
              value={formData.gender}
              onChange={handleChange}
              className="text-textColor font-semibold text-[15px] leading-7 px-4 py-3
focus:outline-none">
                <option value="male">{t.male}</option>
                <option value="female"> {t.female} </option>
                <option value="others"> {t.others} </option>
              </select>
            </label>
          </div>

          <div className=' mb-5 flex items-center gap-3'>
           { selectedFile && ( <figure className=' w-[60px] h-[60px] rounded-full border-2 border-solid border-primaryColor flex items-center justify-center '>
              <img src={previewURL} alt=""  className=' w-full rounded-full' />
            </figure>) }

            <div className=' relative w-[130px] h-[50px] '>
              <input type="file"  
              name='photo' 
              id='customFile' 
              onChange={handleFileInput}
              accept='.jpg, .png' 
              className=' absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer '
              />

              <label htmlFor="customFile" className=' absolute top-0 left-0 w-full h-full  flex items-center px-[0.75rem] text-[15px] leading-6 overflow-hidden bg-[#0066ff46] text-headingColor font-semibold rounded-lg truncate cursor-pointer  '>{t.upload}</label>

            </div>
          </div>

          <div className=' mt-7'>
            <button type='submit'
            disabled={loading && true}
            
            className='w-full
             bg-primaryColor text-white text-[18px] leading-[30px] rounded-lg px-4 py-3 ' >{loading ?<HashLoader size={35}color='#ffffff'  /> :`${t.signup}`}</button>
          </div>

          <p className=' mt-5 text-center text-textColor'> {t.already} <Link to='/login' className=' text-primaryColor font-medium ml-1 '>{t.signin}</Link></p>

          </form>
        </div>

      </div>
    </div>
  </section>
}

export default Signup