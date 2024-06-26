import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify';
import { BASE_URL, token } from '../../config.js';
import HashLoader from 'react-spinners/HashLoader.js';


const CheckoutSuccess = () => {

  const {doctorId,time} = useParams();
  const [loader,setLoader] = useState(false)
  const navigate = useNavigate()
    const booking = async()=>{
      setLoader(true)
      try {
        const res = await fetch(`/api/v1/bookings/create/${doctorId}`,{
  
          method:'post',
          headers:{
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body:JSON.stringify({date:time})
        });
        const result = await res.json();
        
  
        if(!res.ok){
          throw new Error(result.message)
        }

        const emailResponse = await fetch(`${BASE_URL}/bookings/sendEmail`,{
          method:'post',
          headers:{
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body:JSON.stringify({ email: result?.data?.user?.email,username: result?.data?.user?.name,date:time,doctorName: result?.data?.doctor?.name })
          }
        );
        const emailRes = await emailResponse.json();
        if(!emailResponse.ok)
          {
              throw new Error(emailRes.message)
          }
        
          toast.success(emailRes.message)
        toast.success(result.message)
        navigate('/home')

      } catch (error) {
        
        toast.error(error.message)
      }
      finally{
        setLoader(false)
      }

    }

  return (
    <div className="bg-gray-100 h-screen">
        <div className="bg-white p-6 md:mx-auto">
        <svg
viewBox="0 0 24 24"
className="text-green-600 w-16 h-16 mx-auto my-6">
<path
fill="currentColor"
d="M12,0A12,12,0,1,0,24, 12, 12.014,12.014,0,0,0,12,0Zm6.927,8.2-6.845,9.289a1.011,1.011,0,0,1-1. 43.188L5.764,13.769a1,1,0,1,1,1.25-1.56214.076,3.261,6.227-8.451A1,1,0,1,1,18.927,8.2Z"
></path>
</svg>

        <div className="text-center">
            <h3 className="md:text-2xl text-base text-gray-900 font-semibold text-center">Payment Done</h3>
            <p className="text-gray-600 my-2">Thankyou for completing your secure online payment.</p>
            <p>Have a great day</p>
            <div className="py-10 text-center">
                
            <button onClick={booking} className='btn' >{loader?<HashLoader color='#0067FF' />:'Confirm Booking and Go back to home'}</button>
            </div>
        </div>

        </div>
    </div>
  )
}

export default CheckoutSuccess