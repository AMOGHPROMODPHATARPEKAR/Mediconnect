import React, { useEffect, useState } from 'react'
import { Swiper,SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/pagination'
import {Pagination} from 'swiper/modules'
import patientAvatar from '../../assets/images/patient-avatar.png'
import {HiStar} from 'react-icons/hi'
import { BASE_URL } from '../../config'
import { toast } from 'react-toastify'

const Testimonial = () => {
  const [reviews,setReviews] = useState([])
  useEffect(()=>{
    const getReviews = async()=>{
      try {
        const  res = await fetch('/api/v1/review/',{
          method: 'GET',
          headers:{
            'Content-Type': 'application/json'
          }
        })
  
        const result = await res.json();
  
        if(!res.ok){
          throw new Error(result.message)
        }

        setReviews(result?.data)

      } catch (error) {
        toast.error(error.message)
      }

    }
    getReviews()
  },[reviews])

  return (
    <div>
        <Swiper 
        modules={[Pagination]}
        pagination={{ clickable: true }}
        spaceBetween={30}
        slidesPerView={1}
        breakpoints={{
        640: {
        slidesPerView: 1,
        spaceBetween: 0,
        },
        768: {
        slidesPerView: 2,
        spaceBetween: 20,
        },
        1024: {
        slidesPerView: 3,
        spaceBetween: 30,
        },
        }}
        >
          {reviews?.map((item,index)=>(
          <SwiperSlide>
          <div className="py-[30px] px-5 rounded-3">
          <div className="flex items-center gap-[13px]">
              <img src={item?.user?.photo} alt="" height={40} width={40} />
              <div><h4 className="text-[18px] leading-[30px] font-semibold">{item.user?.name}</h4>
              <div className='flex items-center gap-[2px] '>
                  <HiStar className=' text-yellowColor w-[18px] h-5'/>
                  <HiStar className=' text-yellowColor w-[18px] h-5'/>
                  <HiStar className=' text-yellowColor w-[18px] h-5'/>
                  <HiStar className=' text-yellowColor w-[18px] h-5'/>
                  <HiStar className=' text-yellowColor w-[18px] h-5'/>
              </div>
              </div>
          </div>
          <p className=' text-[16px] leading-7 mt-4 text-textColor font-[400] '>{item.reviewText}</p>
          </div>
          </SwiperSlide>  
          ))}
         
       
          
        </Swiper>
    </div>
  )
}

export default Testimonial