import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import HashLoader from 'react-spinners/HashLoader';
import ClipLoader from "react-spinners/ClipLoader";
import { toast } from 'react-toastify';




const ForgetPassword = () => {

  
  const [loading,setLoading] = useState(false)
  const [codeLoader,setCodeLoader] = useState(false)
  const [email,setEmail] = useState(false)
  const [user,setUser] = useState([])
  const [formData,setFormData] = useState({
    email:'',
    code:''
  })
  const [verifyCode, setVerifyCode] = useState(null);
  const navigate = useNavigate()

  const handleChange = (e) =>{
    setFormData({...formData, [e.target.name]:e.target.value})
  }

  const generateVerifyCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const sendEmail = async(e) =>{
    e.preventDefault()
  
    try {
      
      setCodeLoader(true)

      const code = generateVerifyCode(); // Generate the verification code
      setVerifyCode(code); // Set the verification code in state

      const emailResponse = await fetch(`api/v1/bookings/verifyEmail`,{
        method:'post',
        headers:{
          'Content-Type': 'application/json',
        },
        body:JSON.stringify({ email: user?.email,username: user?.name,verifyCode:code })
        }
      );
      const result = await emailResponse.json();
      if(!emailResponse.ok)
        {
            throw new Error(result.message)
        }
      
        if(!emailResponse.success){
          toast.error("Verification error")
        }
        toast.success("verification code sent")   
                
    } catch (error) {
      console.log("Error in sending Email",error )
    }finally{
      setCodeLoader(false)
    }
  
  }
  
  const submitHandler = async(e)=>{
    e.preventDefault()
    if(!email){
      try {
        setLoading(true)
        const res = await fetch('/api/v1/user/emailExist',{
          method:'post',
          headers:{
            'Content-Type':'application/json'
          },
          body:JSON.stringify({email:formData.email})
        })
        const result = await res.json();
        
        if(!res.ok){
          throw new Error(result.message);
        }
        setUser(result.data)
        setEmail(true)
      } catch (error) {
        console.log("Email dont exist",error)
        toast.error("Email dont exist")
      }finally{
        setLoading(false)
      }
  
    }else{
      if (verifyCode === formData.code) {
        toast.success('Code matched');
        navigate(`/changePassword/${user?._id}`);
      } else {
        toast.error('Code does not match');
      }
    }
    
  
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Verify Your Account
          </h1>
          <p className="mb-4">Enter the verification code sent to your email</p>
        </div>

        <form className=' py-4 md:py-0' onSubmit={submitHandler} >
        <div className=' mb-5'>
            <input type="email" placeholder='Enter the Email' value={formData.email} 
            name='email'
            onChange={handleChange}
            className="w-full py-3 border-b border-solid border-[#0066ff61] focus:outline-none focus:border-b-primaryColor text-[16px] leading-7 text-headingColor placeholder:text-textColor cursor-pointer"
            required
            />
          </div>  
        {email && <div className=' mb-5'>
            <input type="text" placeholder='Enter the Code' value={formData.code} 
            name='code'
            onChange={handleChange}
            className="w-full py-3 border-b border-solid border-[#0066ff61] focus:outline-none focus:border-b-primaryColor text-[16px] leading-7 text-headingColor placeholder:text-textColor cursor-pointer"
            required
            />
          </div>  }
          <div className=' mt-7'>
            <button type='submit'
            disabled={loading && true}
            className='w-full bg-primaryColor text-white text-[18px] leading-[30px] rounded-lg px-4 py-3 ' >{loading? <HashLoader  size={35}color='#ffffff'/> :'Verify'}</button>
          </div>
        </form>
        
        {email && <div className="text-center mt-4">
          <p onClick={sendEmail} className=' cursor-pointer text-blue-600'>
            Send code {codeLoader ? <ClipLoader /> :'?'}
          </p>
        </div>}
      </div>
    </div>
  )
}

export default ForgetPassword