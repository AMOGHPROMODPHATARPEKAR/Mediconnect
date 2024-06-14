import React, { useEffect, useState } from 'react'
import {AiOutlineDelete} from 'react-icons/ai'
import uploadToCloudinary from '../../utils/uploadToCloudinary'
import { toast } from 'react-toastify'
import {token} from '../../config.js'
import { useNavigate } from 'react-router-dom'
import HashLoader from 'react-spinners/HashLoader.js'

const Profile = ({doctorData}) => {

    const [formData, setFormData] = useState({
        name:'',
        email:'',
        location:'',
        phone:0,
        bio:'',
        gender:'',
        specialization:'',
        ticketPrice:0,
        about:'',
        qualifications:[],
        experiences:[],
        timeSlots:[],
        photo:null

    });
    const today = new Date();
    const todayString = today.toISOString().split('T')[0]; // Get YYYY-MM-DD format

    const oneWeekFromToday = new Date();
    oneWeekFromToday.setDate(today.getDate() + 20);
    const oneWeekFromTodayString = oneWeekFromToday.toISOString().split('T')[0];

    useEffect(()=>{
        setFormData({
            name:doctorData?.name,
            email:doctorData?.email,
            location:doctorData?.location,
            phone:doctorData?.phone,
            bio:doctorData?.bio,
            gender:doctorData?.bio,
            specialization:doctorData?.specialization,
            ticketPrice:doctorData?.ticketPrice,
            qualifications:doctorData?.qualifications,
            experiences:doctorData?.experiences,
            timeSlots:doctorData?.timeSlots,
            about:doctorData?.about,
            photo:doctorData?.photo
        })
    },[doctorData])

    const [loading,setLoading] = useState(false)
    const navigate = useNavigate()
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

      const updateProfileHandler = async(e)=>{
        e.preventDefault();

        try {
            setLoading(true);

            const res = await fetch(`/api/v1/doctor/${doctorData._id}`,{
               method:'put',
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
            
                console.log(message);

                toast.success(message)
            navigate('/home')
            
        } catch (error) {
            toast.error(error.message)
        }finally{
            setLoading(false)
        }

      }

      //reuseable func for adding item
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
             university:""})
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
            hospital:""
         })
      }

      const handleExperienceChange = (event,index)=>{
        handleReusableInputChange('experiences',index,event);
      }

      const deleteExperience = (e,index)=>{
        e.preventDefault();
        deleteItem('experiences',index);
      }

      const addTimeSlot = e =>{
        e.preventDefault();

        addItem('timeSlots',
        {
            day:'',
            startingTime:"",
            endingTime:""
        })
      }

      const handleTimeSlotChange = (event,index)=>{
        handleReusableInputChange('timeSlots',index,event);
      }

      const deleteTimeSlot = (e,index)=>{
        e.preventDefault();
        deleteItem('timeSlots',index);
      }

  return (
    <div>
    <h2>Profile Information</h2>

    <form >
        <div className='mb-5'>
            <p className='form__label'>Name</p>
            <input 
            type="text"
            name='name'
            value={formData.name}
            onChange={handleChange}
            placeholder='Full Name'
            className='form__input'
            />
        </div>
        <div className='mb-5'>
            <p className='form__label'>Email</p>
            <input 
            type="email"
            name='email'
            value={formData.email}
            onChange={handleChange}
            placeholder='Email'
            className='form__input'
            aria-readonly
            readOnly
            
            />
        </div>
        <div className='mb-5'>
            <p className='form__label'>Location</p>
            <input 
            type="text"
            name='location'
            value={formData.location}
            onChange={handleChange}
            placeholder='Location'
            className='form__input'
            
            />
        </div>
        <div className='mb-5'>
            <p className='form__label'>Phone*</p>
            <input 
            type="number"
            name='phone'
            value={formData.phone}
            onChange={handleChange}
            placeholder='Phone Number'
            className='form__input'
            maxLength={10}
            />
        </div>
        <div className=' mb-5'>
            <p className='form__label'>Bio*</p>
            <input 
            type="text"
            name='bio'
            value={formData.bio}
            onChange={handleChange}
            placeholder='Bio'
            className='form__input'
            maxLength={100}
            
            />
        </div>

        <div className="mb-5">
            <div className=' grid grid-cols-3 gap-5 mb-[30px] '>
                <div>
                    <p className='form__label'>Gender</p>
                    <select name="gender" value={formData.gender} onChange={handleChange}
                    className=' form__input py-3.5'>
                        <option value="">Select</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                    </select>
                </div>
                <div>
                    <p className='form__label'>Specialization</p>
                    <select name="specialization" value={formData.specialization} onChange={handleChange}
                    className=' form__input py-3.5'>
                        <option value="">Select</option>
                        <option value="surgeon">Surgeon</option>
                        <option value="neurologist">Neurologist</option>
                        <option value="dermatologist">Dermatologist</option>
                    </select>
                </div>

                <div>
                    <p className='form__label'>Ticket Price*</p>
                    <input 
            type="number"
            name='ticketPrice'
            value={formData.ticketPrice}
            onChange={handleChange}
            placeholder='100'
            className='form__input'
            
            />
                </div>

            </div>
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
        <div className='mb-5'>
            <p className='form__label'>Time Slots</p>
            {formData.timeSlots?.map((item,index)=>(
                <div key={index}>
                    <div>
                        <div className=' grid grid-cols-2 md:grid-cols-4 mb-[30px] gap-5 '>
                        <div>
                            <p className=' form__label '>Day*</p>
                            <input type="date"
                            name='day'
                            value={item.day}
                            onChange={e =>handleTimeSlotChange(e,index)}
                            min={ todayString}
                            max={oneWeekFromTodayString}
                            className=' form__input' />
                        </div>
                        <div>
                            <p className=' form__label '>Starting Time*</p>
                            <input type="time"
                            name='startingTime'
                            value={item.startingTime}
                            onChange={e=> handleTimeSlotChange(e,index)}
                            className=' form__input' />
                        </div>
                        <div>
                            <p className=' form__label '>Ending Time*</p>
                            <input type="time"
                            name='endingTime'
                            value={item.endingTime}
                            onChange={e=> handleTimeSlotChange(e,index)}
                            className=' form__input' />
                        </div>
                        <div className=' flex items-center '>
                      <button className=' bg-red-600 p-2 rounded-full text-white text-[18px] mb-[30px] mt-7 cursor-pointer '
                      onClick={e=>deleteTimeSlot(e,index)}
                      >
                        <AiOutlineDelete/>
                    </button>
                        </div> 
                        </div>
                       

                    

                    </div>
                </div>
            ))}

            <button onClick={addTimeSlot} className='bg-[#000] py-2 px-5 rounded text-white h-fit cursor-pointer'>Add TimeSlot</button>

        </div>

        <div className='mb-5'>
            <p className='form__label w-full'>About*</p>
            <textarea name="about" 
            rows={5}
            cols={75}
            value={formData.about}
            placeholder='Write about you'
            onChange={handleChange}
            ></textarea>
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
            <button type='submit' onClick={updateProfileHandler} className=' bg-primaryColor text-white text-[18px] leading-[30px] w-full py-3 rounded-lg '>{loading?<HashLoader size={25}/> : 'Update Profile'}</button>
        </div>


    </form>

    </div>
  )
}

export default Profile