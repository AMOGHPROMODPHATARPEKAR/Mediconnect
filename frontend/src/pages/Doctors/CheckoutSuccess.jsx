import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify';
import { BASE_URL, token } from '../../config.js';
import HashLoader from 'react-spinners/HashLoader.js';


const CheckoutSuccess = () => {

  const {doctorId,time} = useParams();
  const [loader,setLoader] = useState(false)
  

  const [isBooked, setIsBooked] = useState(false)
  const navigate = useNavigate()

  const booking = async () => {
    if (isBooked) {
      toast.info('Booking already processed');
      return;
    }

    setLoader(true);
    try {
      // Existing booking logic remains the same
      const res = await fetch(`/api/v1/bookings/create/${doctorId}`, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ date: time }),
      });
      const result = await res.json();
  
      if (!res.ok) {
        throw new Error(result.message);
      }

     
      // Step 2: Send email
      const emailResponse = await fetch(`${BASE_URL}/bookings/sendEmail`, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          email: result?.data?.user?.email,
          username: result?.data?.user?.name,
          date: time,
          doctorName: result?.data?.doctor?.name,
        }),
      });
      const emailRes = await emailResponse.json();
      if (!emailResponse.ok) {
        throw new Error(emailRes.message);
      }
  
      toast.success(emailRes.message);
  
      // Step 3: Schedule calendar event
    const calendarResponse = await fetch(`http://localhost:8000/schedule_event`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        summary: `Appointment with Dr. ${result?.data?.doctor?.name}`,
        location: result?.data?.doctor?.location,
        description: `Your appointment is scheduled with Dr. ${result?.data?.doctor?.name}.`,
        start: new Date(time).toISOString(),
        timeZone: "Asia/Kolkata",
        duration: 60,
        userEmail: result?.data?.user?.email,
        doctorId, // Pass doctorId
        time // Pass time
      }),
    });

    const calendarRes = await calendarResponse.json();

    // Handle potential redirect for OAuth
    if (calendarRes.redirectUrl) {
      window.location.href = calendarRes.redirectUrl;
      return;
    }

    if (!calendarResponse.ok) {
      throw new Error(calendarRes.message);
    }

    toast.success(calendarRes.message);

     
    setIsBooked(true);
    navigate('/home');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoader(false);
    }
  };
  

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