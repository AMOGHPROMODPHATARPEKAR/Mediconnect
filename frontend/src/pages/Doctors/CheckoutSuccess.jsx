import React, { useEffect, useState } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { toast } from 'react-toastify';
import { BASE_URL, token } from '../../config.js';
import HashLoader from 'react-spinners/HashLoader.js';

const CheckoutSuccess = () => {
  const { doctorId, time } = useParams();
  const [loader, setLoader] = useState(false);
  const [bookingData, setBookingData] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const status = searchParams.get('status');
    
    // Only proceed if we have booking data and authentication was successful
    if (status === 'success' && bookingData) {
      completeBooking(bookingData);
    } else if (status === 'error') {
      toast.error('Google Calendar authentication failed');
      setLoader(false);
    }
  }, [location, bookingData]);

  const initiateBooking = async () => {
    setLoader(true);
    try {
      // Create booking
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
  
      // Send email
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
  
      // Schedule calendar event
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
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          duration: 60,
          userEmail: result?.data?.user?.email,
          doctorId,
          time
        }),
      });
      const calendarRes = await calendarResponse.json();
  
      // Handle potential redirect for OAuth
      if (calendarRes.redirectUrl) {
        // Store booking data for later use
        setBookingData({
          result,
          emailRes,
          userEmail: result?.data?.user?.email,
          doctorName: result?.data?.doctor?.name,
          location: result?.data?.doctor?.location
        });
        
        // Redirect to Google OAuth
        window.location.href = calendarRes.redirectUrl;
        return;
      }
  
      // Complete booking if no redirect needed
      await completeBooking({
        result,
        emailRes,
        userEmail: result?.data?.user?.email,
        doctorName: result?.data?.doctor?.name,
        location: result?.data?.doctor?.location
      });
    } catch (error) {
      toast.error(error.message);
      setLoader(false);
    }
  };

  const completeBooking = async (bookingData) => {
    try {
      // Final calendar event creation
      const finalCalendarResponse = await fetch(`http://localhost:8000/schedule_event`, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          summary: `Appointment with Dr. ${bookingData.doctorName}`,
          location: bookingData.location,
          description: `Your appointment is scheduled with Dr. ${bookingData.doctorName}.`,
          start: new Date(time).toISOString(),
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          duration: 60,
          userEmail: bookingData.userEmail,
          doctorId,
          time
        }),
      });

      const finalCalendarRes = await finalCalendarResponse.json();

      if (!finalCalendarResponse.ok) {
        throw new Error(finalCalendarRes.message);
      }

      toast.success(finalCalendarRes.message);
      toast.success(bookingData.result.message);

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
          className="text-green-600 w-16 h-16 mx-auto my-6"
        >
          <path
            fill="currentColor"
            d="M12,0A12,12,0,1,0,24, 12, 12.014,12.014,0,0,0,12,0Zm6.927,8.2-6.845,9.289a1.011,1.011,0,0,1-1. 43.188L5.764,13.769a1,1,0,1,1,1.25-1.56214.076,3.261,6.227-8.451A1,1,0,1,1,18.927,8.2Z"
          ></path>
        </svg>

        <div className="text-center">
            <h3 className="md:text-2xl text-base text-gray-900 font-semibold text-center">Payment Done</h3>
            <p className="text-gray-600 my-2">Thank you for completing your secure online payment.</p>
            <p>Have a great day</p>
            <div className="py-10 text-center">
                <button onClick={initiateBooking} className='btn'>
                  {loader ? <HashLoader color='#0067FF' /> : 'Confirm Booking and Go back to home'}
                </button>
            </div>
        </div>
        </div>
    </div>
  )
}

export default CheckoutSuccess