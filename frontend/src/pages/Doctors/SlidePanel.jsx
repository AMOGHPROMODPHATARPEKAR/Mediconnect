import React, { useState } from 'react';
import convertTime from '../../utils/convertTime';
import { BASE_URL, token } from '../../config';
import { toast } from 'react-toastify';

const SlidePanel = ({ doctorId, timeSlots, ticketPrice, bookedSlots }) => {
    const [time, setTime] = useState('');

    // Function to check if a date is in the past
    const isExpired = (date) => {
        const today = new Date();
        const slotDate = new Date(date);
        return slotDate < today;
    };

    const bookingHandler = async () => {
        if (!time) {
            toast.error("Please select a valid time slot.");
            return;
        }

        try {
            const res = await fetch(`${BASE_URL}/bookings/checkout-session/${doctorId}/${time}`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message + ' Please try again.');
            }

            if (data.session?.url) {
                window.location.href = data.session.url;
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    return (
        <div className="shadow-panelShadow p-3 lg:p-5 rounded-md">
            <div className="flex items-center justify-between">
                <p className="text_para mt-0 font-semibold">Ticket price</p>
                <span className="text-[16px] leading-7 lg:text-[22px] lg:leading-8 text-headingColor font-bold">
                    {ticketPrice} BDT
                </span>
            </div>

            <div className="mt-[30px]">
                <p className="text_para mt-0 font-semibold text-headingColor">Available Time Slots:</p>
                <ul className="mt-3">
                    {timeSlots?.map((item, index) => {
                        const isBooked = bookedSlots.includes(item.day);
                        const expired = isExpired(item.day);

                        return (
                            <li
                                key={index}
                                className={`flex items-center justify-between mb-2 ${
                                    isBooked || expired ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                            >
                                <p
                                    className={`text-[15px] leading-6 font-semibold ${
                                        isBooked
                                            ? 'line-through text-red-500'
                                            : expired
                                            ? 'line-through text-gray-400'
                                            : 'text-textColor'
                                    }`}
                                >
                                    {item.day}
                                </p>
                                <p
                                    className={`text-[15px] leading-6 font-semibold ${
                                        isBooked
                                            ? 'line-through text-red-500'
                                            : expired
                                            ? 'line-through text-gray-400'
                                            : 'text-textColor'
                                    }`}
                                >
                                    {convertTime(item.startingTime)} - {convertTime(item.endingTime)}
                                </p>
                                <input
                                    type="radio"
                                    value={item.day}
                                    name="time"
                                    disabled={isBooked || expired}
                                    onChange={(e) => setTime(e.target.value)}
                                />
                            </li>
                        );
                    })}
                </ul>
            </div>
            <button
                onClick={bookingHandler}
                className="btn px-2 w-full rounded-md"
                disabled={time === ''}
            >
                Book Appointment
            </button>
        </div>
    );
};

export default SlidePanel;
