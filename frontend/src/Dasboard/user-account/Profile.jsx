import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import uploadToCloudinary from '../../utils/uploadToCloudinary.js'
import { toast } from 'react-toastify'
import HashLoader from 'react-spinners/HashLoader.js'
import {token} from '../../config.js'




const Profile = ({user}) => {

  console.log(token)
  const [loading,setLoading] = useState(false)
 
  const navigate = useNavigate();

   

  const [formData,setFormData] = useState({
    name:'',
    email:'',
    photo:null,
    gender:'male',
    bloodType:''

  })

  useEffect(()=>{

    setFormData({name:user.name, email:user.email, photo:user.photo, gender:user.gender, bloodType:user.bloodType})

  },[user])

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
    
    
    setFormData({...formData,photo:data.url})

  }

  const submitHandler = async(e)=>{

    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`/api/v1/user/${user._id}`,{
        method:'put',
        headers:{
          'Content-Type':'application/json',
          Authorization:`Bearer ${token}`
        },
        body:JSON.stringify(formData)
      })
  
      const {message} = await res.json();
  
      if(!res.ok){
        throw new Error(message);
      }
  
      toast.success(message)
      navigate('/')
    } catch (error) {
      
      toast.error(error.message)
      console.log(error)

    }finally{
      setLoading(false)
    }
  }

  return (
    <div className=' mt-10'>
      <form onSubmit={submitHandler}>
          <div className=' mb-5'>
            <input type="text" placeholder='Enter your Full Name'  
            name='name' 
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-3 border-b border-solid border-[#0066ff61] focus:outline-none focus:border-b-primaryColor text-[16px] leading-7 text-headingColor placeholder:text-textColor cursor-pointer"
            
            />
          </div>
          <div className=' mb-5'>
            <input type="email"
             placeholder='Enter your Email' 
             value={formData.email}
            onChange={handleChange}
            name='email' 
            className="w-full px-4 py-3 border-b border-solid border-[#0066ff61] focus:outline-none focus:border-b-primaryColor text-[16px] leading-7 text-headingColor placeholder:text-textColor cursor-pointer"
            
            />
            </div>

          

          <div className=' mb-5'>
            <input type="text"
             placeholder='Blood type' 
             value={formData.bloodType}
            onChange={handleChange}
            name='bloodType' 
            className="w-full px-4 py-3 border-b border-solid border-[#0066ff61] focus:outline-none focus:border-b-primaryColor text-[16px] leading-7 text-headingColor placeholder:text-textColor cursor-pointer"
            
            />
          </div>


          <div className="mb-5 flex items-center justify-between gap-3">
            
            <label className="text-headingColor font-bold text-[16px] leading-7">
              Gender:
              <select name="gender" 
              value={formData.gender}
              onChange={handleChange}
              className="text-textColor font-semibold text-[15px] leading-7 px-4 py-3 rounded-md ml-2
focus:outline-none">
                <option value="male" >Male</option>
                <option value="female">Female</option>
                <option value="others">Others</option>
              </select>
            </label>
          </div>

          <div className=' mb-5 flex items-center gap-3'>
           { formData.photo && ( <figure className=' w-[60px] h-[60px] rounded-full border-2 border-solid border-primaryColor flex items-center justify-center '>
              <img src={formData.photo} alt=""  className=' w-full rounded-full' />
            </figure>) }

            <div className=' relative w-[130px] h-[50px] '>
              <input type="file"  
              name='photo' 
              id='customFile' 
              onChange={handleFileInput}
              accept='.jpg, .png' 
              className=' absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer '
              />

              <label htmlFor="customFile" className=' absolute top-0 left-0 w-full h-full  flex items-center px-[0.75rem] text-[15px] leading-6 overflow-hidden bg-[#0066ff46] text-headingColor font-semibold rounded-lg truncate cursor-pointer  '>Upload Photo</label>

            </div>
          </div>

          <div className=' mt-7'>
            <button type='submit'
            disabled={loading && true}
            className='w-full
             bg-primaryColor text-white text-[18px] leading-[30px] rounded-lg px-4 py-3 ' >{loading ?<HashLoader size={25}color='#ffffff'  /> :'Update'}</button>
          </div>

          

          </form>
    </div>
  )
}

export default Profile