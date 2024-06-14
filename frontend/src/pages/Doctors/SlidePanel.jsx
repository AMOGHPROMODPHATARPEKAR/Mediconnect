import React, { useState } from 'react'
import convertTime from '../../utils/convertTime'
import {BASE_URL, token } from '../../config'
import { toast } from 'react-toastify'

const SlidePanel = ({doctorId,timeSlots,ticketPrice}) => {
    const [time,setTime] = useState('')
    const bookingHandler = async()=>{
         
        try {
            const res = await fetch(`${BASE_URL}/bookings/checkout-session/${doctorId}/${time}`,{
                method:'post',
                headers:{
                    Authorization:`Bearer ${token}`
                }
            })
            
            const data = await res.json();

            if(!res.ok){
                throw new Error(data.message + 'please try again')
            }

            if(data.session.url){
                window.location.href = data.session.url
            }



        } catch (error) {
            toast.error(error.message)
        }
    }

  return (
    <div className="shadow-panelShadow p-3 lg:p-5 rounded-md">
        <div className="flex items-center justify-between">
            <p className="text_para mt-0 font-semibold">Ticket price</p>
            <span className="text-[16px] leading-7 lg:text-[22px] lg:leading-8 text-headingColor font-bold">{ticketPrice} BDT</span>
        </div>

        <div className="mt-[30px]">
            <p className="text_para mt-0 font-semibold text-headingColor">Available Time Slot:</p>
            <ul className="mt-3">

            {timeSlots?.map((item,index)=>(
                <li className="flex items-center justify-between mb-2">
                    <p className="text-[15px] leading-6 text-textColor font-semibold">{item.day}</p>
                    <p className="text-[15px] leading-6 text-textColor font-semibold"> {convertTime(item.startingTime)} - {convertTime(item.endingTime)}</p>
                    <input type="radio" value={item.day} name='time' onChange={(e)=>setTime(e.target.value)} />
                </li>
            ))}

            </ul>
        </div>
        <button onClick={bookingHandler} className=' btn px-2 w-full rounded-md ' disabled={time === ''} >Book Appointment</button>

    </div>
  )
}

export default SlidePanel