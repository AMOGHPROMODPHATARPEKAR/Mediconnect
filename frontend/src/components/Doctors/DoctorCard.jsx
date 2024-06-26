import React from 'react'
import starIcon from '../../assets/images/Star.png'
import { Link, useNavigate } from 'react-router-dom';
import { BsArrowRight } from 'react-icons/bs';
import { AiOutlineDelete } from 'react-icons/ai';
import { BsChatDots } from 'react-icons/bs';
import { token } from '../../config';
import { toast } from 'react-toastify';


const DoctorCard = ({doctor,booking,bookingId}) => {

    const {_id,name,specialization,
     averageRating,
    totalRating,
    photo,
    experiences,
location} = doctor;

    const navigate = useNavigate()

    const handleDelete = async() =>{

        try {
            const res = await fetch(`/api/v1/bookings/${bookingId}`,{
                method:'delete',
                headers:{
                 'Content-Type':'application/json',
                 Authorization : `Bearer ${token}`
                }     
             })
        
             const result = await res.json();
        
             if(!res.ok)
                 {
                  throw new Error(result.message)
                 }
             
                
                toast.success(result.message)
                toast.success("Booking delete email sent")
                navigate('/home')
        
        } catch (error) {
            toast.error(error.message)
        }

    }


  return (
    <div className='p-3 lg:p-5 ' >
        <div>
            <img src={photo} alt="" />
        </div>

      <h2 className=' text-[18px] leading-[30px] text-headingColor lg:text-[26px] lg:leading-9 font-[700] left-3 lg:mt-5 '>{name}</h2> 

        <div className=' mt-2 lg:mt-4 flex items-center justify-between ' > 
            <span className=' bg-[#CCF0F3] text-irisBlueColor  py-1 px-2 lg:py-2 lg:px-6  text-[12px] leading-4 lg:text-[16px] lg:leading-7 font-semibold  rounded '>{specialization}</span>

            <div className=' flex items-center gap-[6px] '>
                <span className=' flex items-center gap-[6px] text-[14px] leading-6 lg:text-[16px] lg:leading-7 font-semibold text-headingColor '>
                    <img src={starIcon} alt="" /> {averageRating?.toFixed(2)}
                </span>
                <span className=' text-[14px] leading-6 lg:text-[16px] lg:leading-7 font-[400] text-textColor '>
                    ({totalRating})
                </span>
            </div>
        </div>

        <div className=' mt-[18px] lg:mt-5 flex items-center justify-between '>
            <div>
                {/* <h3 className=' text-[16px] leading-7 lg:text-[18px] lg:leading-[30px] font-semibold text-headingColor '>+{totalPatients} patients</h3> */}
                <p className=' text-[14px] leading-6 font-[400] text-textColor  '>At {experiences && experiences[0]?.hospital}</p>
                <p className=' text-[14px] leading-6 font-[400] text-textColor  '>Location - {location}</p>
            </div>

            
        {!booking && <Link to={`/doctors/${doctor._id} `}className='w-[44px] h-[44px]  rounded-full border border-solid border-[#181A1E]  flex items-center justify-center group hover:bg-primaryColor hover:border-none '>
            <BsArrowRight className=' group-hover:text-white w-6 h-5 '/>
        </Link>}

        </div>
        {booking && <> <div className=' flex items-center justify-around mt-4'>
            
                <div onClick={()=>navigate(`/chat/${_id}`)}>
                    <BsChatDots size={25} fill='green' className=' cursor-pointer ' />
                </div>
            <div onClick={handleDelete}>
                <AiOutlineDelete size={30} fill='red' className=' cursor-pointer '/>
                </div>

            <Link to={`/doctors/${doctor._id} `}className='w-[44px] h-[44px]  rounded-full border border-solid border-[#181A1E]  flex items-center justify-center group hover:bg-primaryColor hover:border-none '>
            <BsArrowRight className=' group-hover:text-white w-6 h-5 '/>
        </Link>

        </div>
                
            
            </>
            }

    </div>
  )
}

export default DoctorCard