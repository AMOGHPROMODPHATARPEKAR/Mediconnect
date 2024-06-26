import React, { useState, useContext} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import { authContext } from '../context/AuthContext.jsx'
import { toast } from 'react-toastify'
import HashLoader from 'react-spinners/HashLoader.js'
const Login = () => {

  const [formData,setFormData] = useState({
    email:'',
    password:''
  })

  const [loading,setLoading] = useState(false)

  const navigate = useNavigate();
 const {dispatch} = useContext(authContext)

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
        <h3 className=' text-headingColor text-[27px] leading-9 font-bold mb-10  '>Hello <span className=' text-primaryColor'>Welcome</span>Back</h3>
        <form className=' py-4 md:py-0' onSubmit={submitHandler} >
          <div className=' mb-5'>
            <input type="email" placeholder='Enter your Email' value={formData.email} 
            name='email'
            onChange={handleChange}
            className="w-full py-3 border-b border-solid border-[#0066ff61] focus:outline-none focus:border-b-primaryColor text-[16px] leading-7 text-headingColor placeholder:text-textColor cursor-pointer"
            required
            />
          </div>
          <div className=' mb-5'>
            <input type="password" placeholder='Password' value={formData.password} 
            name='password'
            onChange={handleChange}
            className="w-full py-3 border-b border-solid border-[#0066ff61] focus:outline-none focus:border-b-primaryColor text-[16px] leading-7 text-headingColor placeholder:text-textColor cursor-pointer"
            required
            />
          </div>

          <div className=' mt-7'>
            <button type='submit'
            disabled={loading && true}
            className='w-full bg-primaryColor text-white text-[18px] leading-[30px] rounded-lg px-4 py-3 ' >{loading? <HashLoader  size={35}color='#ffffff'/> :'Login'}</button>
          </div>

          <p className=' mt-5 text-center text-textColor'> Don&apos;t have an account? <Link to='/register' className=' text-primaryColor font-medium ml-1 '>Register</Link></p>
          <p className=' mt-5 text-center text-textColor'> Forgot Password? <Link to='/forgot' className=' text-primaryColor font-medium ml-1 '>Forgot</Link></p>

        </form>
      </div>
    </section>
  )
}

export default Login