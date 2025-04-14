import React, { useState, useContext} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import { authContext } from '../context/AuthContext.jsx'
import { toast } from 'react-toastify'
import HashLoader from 'react-spinners/HashLoader.js'
import { LanguageContext } from '../context/LanguageContext.jsx'
const Login = () => {

  const [formData,setFormData] = useState({
    email:'',
    password:''
  })

  const [loading,setLoading] = useState(false)

  const navigate = useNavigate();
 const {dispatch} = useContext(authContext)
const {language } = useContext(LanguageContext);

  const translation = {
    en:{
      login:'Login',
      email:'Email',
      password:'Password',
      forgot:'Forgot Password?',
      register:'Register',
      welcome:'Hello Welcome  Back',
      msg1:'Don&apos;t have an account?',
   
    },
    hi:{
      login:'लॉगिन करें',
      email:'ईमेल',
      password:'पासवर्ड',
      forgot:'पासवर्ड भूल गए?',
      register:'रजिस्टर करें',
      welcome:'नमस्ते, वापस स्वागत है',
      msg1:'क्या आपके पास खाता नहीं है?',
    },
    kn:{
      login:'ಲಾಗಿನ್',
      email:'ಇಮೇಲ್',
      password:'ಪಾಸ್ವರ್ಡ್',
      forgot:'ಪಾಸ್ವರ್ಡ್ ಮರೆತಿದ್ದೀರಾ?',
      register:'ನೋಂದಣಿ',
      welcome:'ನಮಸ್ಕಾರ, ಪುನಃ ಸ್ವಾಗತ',
      msg1:'ನಿಮ್ಮ ಬಳಿ ಖಾತೆ ಇಲ್ಲವೇ?',
    },
    te:{
      login:'లాగిన్',
      email:'ఇమెయిల్',
      password:'పాస్వర్డ్',
      forgot:'పాస్వర్డ్ మర్చిపోయారా?',
      register:'నమోదు',
      welcome:'హలో, తిరిగి స్వాగతం',
      msg1:'మీకు ఖాతా లేదు?',
    },
    fr:{
      login:'Connexion',
      email:'E-mail',
      password:'Mot de passe',
      forgot:'Mot de passe oublié?',
      register:'S’inscrire',
      welcome:'Bonjour, bienvenue à nouveau',
      msg1:'Vous n’avez pas de compte?',
   }

  }


  const t = translation[language]

  const handleChange = (e) =>{
    setFormData({...formData, [e.target.name]:e.target.value})
  }

  const submitHandler = async(e)=>{

    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/v1/auth/login',{
        method:'post',
        headers:{
          'Content-Type':'application/json'
        },
        body:JSON.stringify(formData)
      })
  
      const result = await res.json();
  
      if(!res.ok){
        throw new Error(result.message);
      }

      console.log(result)
  
      dispatch({
        type:'LOGIN_SUCCESS',
        payload:{
          user:result.data,
          token:result.token,
          role:result.role
        }
      });

      console.log("result data",result)

      toast.success(result.message)
      navigate('/home')
    } catch (error) {
      
      toast.error(error.message)

    }finally{
      setLoading(false)
    }


  }

  return (
    <section className=' px-5 lg:px-0 '>
      <div className='w-full max-w-[570px] mx-auto rounded-lg shadow-md md:p-10 '>
        <h3 className=' text-headingColor text-[27px] leading-9 font-bold mb-10  '>{t.welcome}</h3>
        <form className=' py-4 md:py-0' onSubmit={submitHandler} >
          <div className=' mb-5'>
            <input type="email" placeholder={t.email} value={formData.email} 
            name='email'
            onChange={handleChange}
            className="w-full py-3 border-b border-solid border-[#0066ff61] focus:outline-none focus:border-b-primaryColor text-[16px] leading-7 text-headingColor placeholder:text-textColor cursor-pointer"
            required
            />
          </div>
          <div className=' mb-5'>
            <input type="password" placeholder={t.password} value={formData.password} 
            name='password'
            onChange={handleChange}
            className="w-full py-3 border-b border-solid border-[#0066ff61] focus:outline-none focus:border-b-primaryColor text-[16px] leading-7 text-headingColor placeholder:text-textColor cursor-pointer"
            required
            />
          </div>

          <div className=' mt-7'>
            <button type='submit'
            disabled={loading && true}
            className='w-full bg-primaryColor text-white text-[18px] leading-[30px] rounded-lg px-4 py-3 ' >{loading? <HashLoader  size={35}color='#ffffff'/> :`${t.login}`}</button>
          </div>

          <p className=' mt-5 text-center text-textColor'> {t.msg1} <Link to='/register' className=' text-primaryColor font-medium ml-1 '>{t.register}</Link></p>
          <p className=' mt-5 text-center text-textColor'> {t.forgot}<Link to='/forgot' className=' text-primaryColor font-medium ml-1 '>Forgot</Link></p>

        </form>
      </div>
    </section>
  )
}

export default Login