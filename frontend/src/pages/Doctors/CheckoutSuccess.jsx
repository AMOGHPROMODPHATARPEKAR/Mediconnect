import React, { useEffect, useState } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { toast } from 'react-toastify';
import { BASE_URL, token } from '../../config.js';
import HashLoader from 'react-spinners/HashLoader.js';

const CheckoutSuccess = () => {
  const { doctorId, time } = useParams();
  const [loader, setLoader] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

console.log(time, "time")

  const checkCalendarAvailability = async () => {
    try {
      const calendarResponse = await fetch(`http://localhost:8000/schedule_event`, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          time: time,
          start: new Date(time).toISOString(),
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          duration: 60,
          doctorId,
          checkOnly: true // Add this flag to your backend to only check availability
        }),
      });
      const calendarRes = await calendarResponse.json();

      if (calendarRes.redirectUrl) {
        window.location.href = calendarRes.redirectUrl;
        return;
      }

      // If no redirect needed (user already authenticated), proceed with booking
      await createBookingAndSchedule();
    } catch (error) {
      toast.error('Failed to check calendar availability: ' + error.message);
      setLoader(false);
    }
  };

  const createBookingAndSchedule = async () => {
    try {
      // Create booking
      const bookingRes = await fetch(`/api/v1/bookings/create/${doctorId}`, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ date: time }),
      });
      const bookingResult = await bookingRes.json();

      if (!bookingRes.ok) {
        throw new Error(bookingResult.message);
      }

      // Schedule calendar event
      const calendarResponse = await fetch(`http://localhost:8000/schedule_event`, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          summary: `Appointment with Dr. ${bookingResult?.data?.doctor?.name}`,
          location: bookingResult?.data?.doctor?.location,
          description: `Your appointment is scheduled with Dr. ${bookingResult?.data?.doctor?.name}.`,
          time:time,
          start: new Date(time).toISOString(),
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          duration: 60,
          userEmail: bookingResult?.data?.user?.email,
          doctorId,
        
        }),
      });
      const calendarResult = await calendarResponse.json();

      if (!calendarResponse.ok) {
        // If calendar fails, delete the booking
        await fetch(`/api/v1/bookings/${bookingResult.data._id}`, {
          method: 'delete',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        throw new Error(calendarResult.message);
      }

      // Send email
      await fetch(`${BASE_URL}/bookings/sendEmail`, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          email: bookingResult?.data?.user?.email,
          username: bookingResult?.data?.user?.name,
          date: time,
          doctorName: bookingResult?.data?.doctor?.name,
        }),
      });

      toast.success('Booking confirmed successfully!');
      navigate('/home');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoader(false);
    }
  };

  const handleSuccessfulAuthentication = async () => {
    setLoader(true);
    try {
      await createBookingAndSchedule();
    } catch (error) {
      toast.error(error.message);
      setLoader(false);
    }
  };

  const initiateBooking = async () => {
    setLoader(true);
    try {
      await checkCalendarAvailability();
    } catch (error) {
      toast.error(error.message);
      setLoader(false);
    }
  };

  return (
    <div className="bg-gray-100 h-screen">
      <div className="bg-white p-6 md:mx-auto">
        <svg viewBox="0 0 24 24" className="text-green-600 w-16 h-16 mx-auto my-6">
          <path
            fill="currentColor"
            d="M12,0A12,12,0,1,0,24,12,12.014,12.014,0,0,0,12,0Zm6.927,8.2-6.845,9.289a1.011,1.011,0,0,1-1.43.188L5.764,13.769a1,1,0,1,1,1.25-1.562l4.076,3.261,6.227-8.451A1,1,0,1,1,18.927,8.2Z"
          ></path>
        </svg>

        <div className="text-center">
          <h3 className="md:text-2xl text-base text-gray-900 font-semibold text-center">Payment Done</h3>
          <p className="text-gray-600 my-2">Thank you for completing your secure online payment.</p>
          <p>Have a great day</p>
          <div className="py-10 text-center">
            <button onClick={initiateBooking} className="btn">
              {loader ? <HashLoader color="#0067FF" /> : "Confirm Booking and Go back to home"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSuccess;