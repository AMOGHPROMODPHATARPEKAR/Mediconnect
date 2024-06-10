import React, { useState } from 'react'
import uploadToCloudinary from '../utils/uploadToCloudinary.js';
import HashLoader from 'react-spinners/HashLoader.js';
import { AiOutlineDelete } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import { BASE_URL, token } from '../config.js';
import useFetchData from '../hooks/useFetchData.jsx';
import { toast } from 'react-toastify';



const Verify = () => {

  const {data:doctorData} = useFetchData(`${BASE_URL}/doctor/profile/me`)

  const [formData,setFormData] = useState({
    name:'',
    specialization:'',
    qualifications:[],
    experiences:[],
  })
  const [loading,setLoading] = useState(false)
  const navigate = useNavigate()

  const handleFile = async(key,index,e)=>{
    const file = e.target.files[0]
    const {name} = e.target  
    const data = await uploadToCloudinary(file);
    if(!data)
      {
        console.error("Error in uploading in cloudinary")
        return
      }

      setFormData(prevFormData=> {
        const updateItems = [...prevFormData[key]];

        updateItems[index][name] =data?.url;
        return {
            ...prevFormData,
            [key]:updateItems
        }
    })
  }

  const handleChange = (e) =>{
    setFormData({...formData, [e.target.name]:e.target.value})
    
  }

  const addItem =(key,item)=>{
    setFormData(prevFormData => ({...prevFormData, [key]:[ ...prevFormData[key],item]}))
  }

  //reuseable func for deleting item
  const deleteItem =(key,index)=>{
    setFormData(prevFormData=>(
        {...prevFormData,[key]:[...prevFormData[key].filter((_,i)=> i!==index)]}
    ));
  }

  //reuseable func for input change
  const handleReusableInputChange =(key,index,event)=>{
    const {name,value} = event.target;

    setFormData(prevFormData=> {
        const updateItems = [...prevFormData[key]];

        updateItems[index][name] =value;
        return {
            ...prevFormData,
            [key]:updateItems
        }
    })

  }

  const addQualification = e =>{
    e.preventDefault();

    addItem('qualifications',{
        startingDate:"",
         endingDate:"",
         degree:"",
         university:"",
        certificate:"",
        })
  }

  const handleQualificationChange = (event,index)=>{
    handleReusableInputChange('qualifications',index,event);
  }

  const deleteQualification = (e,index)=>{
    e.preventDefault();
    deleteItem('qualifications',index);
  }


  const addExperience = e =>{
    e.preventDefault();

    addItem('experiences',
    {
        startingDate:"", 
        endingDate:"",
        position:"",
        hospital:"",
        certificate:"",
     })
  }

  const handleExperienceChange = (event,index)=>{
    handleReusableInputChange('experiences',index,event);
  }

  const deleteExperience = (e,index)=>{
    e.preventDefault();
    deleteItem('experiences',index);
  }
  
  const submitHandler = async(e)=>{
    e.preventDefault();

    try {
      setLoading(true)
      
      const res = await fetch(`/api/v1/doctor/profile/verify`,{
        method:'post',
        headers:{
         'Content-Type':'application/json',
         Authorization : `Bearer ${token}`
        } ,
        body:JSON.stringify(formData)
     })

     const {message} = await res.json();

     if(!res.ok)
         {
          throw new Error(message)
         }
     
         toast.success(message)
          navigate('/home')


    } catch (error) {
      toast.error(error.message)
      console.log(error)
      
    }finally{
      setLoading(false)
    }
  }
  if(doctorData?.isApproved === 'pending')
    {
      return (
        <section className=' px-5 lg:px-0 '>
          <div className='w-full max-w-[750px] mx-auto rounded-lg shadow-md md:p-10 '>
            <h3 className=' text-headingColor text-[27px] leading-9 font-bold mb-10  '>Verify  <span className=' text-primaryColor'>Yourself</span></h3>
            <form className=' py-4 md:py-0' onSubmit={submitHandler} >
              <div className=' mb-5'>
                <input type="text" placeholder='Enter your Name' value={formData.name} 
                name='name'
                onChange={handleChange}
                className="w-full py-3 border-b border-solid border-[#0066ff61] focus:outline-none focus:border-b-primaryColor text-[16px] leading-7 text-headingColor placeholder:text-textColor cursor-pointer"
                required
                />
              </div>
              <div className=' mb-5'>
                <input type="text" placeholder='Enter your Specialization' value={formData.specialization} 
                name='specialization'
                onChange={handleChange}
                className="w-full py-3 border-b border-solid border-[#0066ff61] focus:outline-none focus:border-b-primaryColor text-[16px] leading-7 text-headingColor placeholder:text-textColor cursor-pointer"
                required
                />
              </div>
    
              <div className='mb-5'>
                <p className='form__label'>Qualification</p>
                {formData.qualifications?.map((item,index)=>(
                    <div key={index}>
                        <div>
                            <div className=' grid grid-cols-2 gap-5 '>
                            <div>
                                <p className=' form__label '>Starting Date*</p>
                                <input type="date"
                                name='startingDate'
                                value={item.startingDate}
                                onChange={e =>handleQualificationChange(e,index)}
                                className=' form__input' />
                            </div>
                            <div>
                                <p className=' form__label '>Ending Date*</p>
                                <input type="date"
                                name='endingDate'
                                value={item.endingDate}
                                onChange={e =>handleQualificationChange(e,index)}
                                className=' form__input' />
                            </div>
                            </div>
                            <div className=' grid grid-cols-2 gap-5 mt-5 '>
                            <div>
                                <p className=' form__label '>Degree*</p>
                                <input type="text"
                                name='degree'
                                value={item.degree}
                                onChange={e =>handleQualificationChange(e,index)}
                                className=' form__input' />
                            </div>
                            <div>
                                <p className=' form__label '>University*</p>
                                <input type="text"
                                name='university'
                                value={item.university}
                                onChange={e =>handleQualificationChange(e,index)}
                                className=' form__input' />
                            </div>
                            <div>
                                <p className=' form__label '>Certificate*</p>
                                <input type="file"
                                name='certificate'
                                onChange={e =>handleFile('qualifications',index,e)}
                                accept='.jpg, .png'
                                className=' form__input' />
                            </div>
                            </div>
    
                        <button className=' bg-red-600 p-2 rounded-full text-white text-[18px] mt-2 mb-[30px] cursor-pointer '
                        onClick={e=>deleteQualification(e,index)}
                        >
                            <AiOutlineDelete/>
                        </button>
    
                        </div>
                    </div>
                ))}
    
                <button onClick={addQualification} className='bg-[#000] py-2 px-5 rounded text-white h-fit cursor-pointer'>Add qualification</button>
    
            </div>
    
            <div className='mb-5'>
                <p className='form__label'>Experiences</p>
                {formData.experiences?.map((item,index)=>(
                    <div key={index}>
                        <div>
                            <div className=' grid grid-cols-2 gap-5 '>
                            <div>
                                <p className=' form__label '>Starting Date*</p>
                                <input type="date"
                                name='startingDate'
                                value={item.startingDate}
                                onChange={e=>handleExperienceChange(e,index)}
                                className=' form__input' />
                            </div>
                            <div>
                                <p className=' form__label '>Ending Date*</p>
                                <input type="date"
                                name='endingDate'
                                value={item.endingDate}
                                onChange={e=>handleExperienceChange(e,index)}
                                className=' form__input' />
                            </div>
                            </div>
                            <div className=' grid grid-cols-2 gap-5 mt-5 '>
                            <div>
                                <p className=' form__label '>Position*</p>
                                <input type="text"
                                name='position'
                                value={item.position}
                                onChange={e=>handleExperienceChange(e,index)}
                                className=' form__input' />
                            </div>
                            <div>
                                <p className=' form__label '>Hospital*</p>
                                <input type="text"
                                name='hospital'
                                value={item.hospital}
                                onChange={e=>handleExperienceChange(e,index)}
                                className=' form__input' />
                            </div>
                            <div>
                                <p className=' form__label '>Certificate*</p>
                                <input type="file"
                                name='certificate'
                                onChange={e =>handleFile('experiences',index,e)}
                                accept='.jpg, .png'
                                className=' form__input' />
                            </div>
                            </div>
    
                        <button className=' bg-red-600 p-2 rounded-full text-white text-[18px] mt-2 mb-[30px] cursor-pointer '
                        onClick={e=>deleteExperience(e,index)}
                        >
                            <AiOutlineDelete/>
                        </button>
    
                        </div>
                    </div>
                ))}
    
                <button onClick={addExperience} className='bg-[#000] py-2 px-5 rounded text-white h-fit cursor-pointer'>Add Experience</button>
    
            </div>
    
    
              
    
              <div className=' mt-7'>
                <button type='submit'
                // disabled={loading && true}
                className='w-full bg-primaryColor text-white text-[18px] leading-[30px] rounded-lg px-4 py-3 ' >{loading? <HashLoader  size={35}color='#ffffff'/> :'Submit'}</button>
              </div>
    
            
    
            </form>
          </div>
        </section>
      )
    }
    else if(doctorData?.isApproved === 'approved'){
      return (
        <div className=' font-semibold text-[40px] flex items-center justify-center h-[500px]  '>
          <h1>All ready Verified 👍</h1>
        </div>
      )
    }
    else if(doctorData?.isApproved === 'processing') {
      return (
        <div className=' font-semibold text-[40px] flex items-center justify-center h-[500px]  '>
          <h1>In Processing will shortly be updated 😉</h1>
        </div>
      )
    }
    else {
      return (
        <div className=' font-semibold text-[40px] flex items-center justify-center h-[500px]  '>
          <h1>Cancelled due to some reason</h1>
        </div>
      )
    }
  
}

export default Verify