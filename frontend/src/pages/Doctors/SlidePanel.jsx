import React, { useState } from 'react';
import convertTime from '../../utils/convertTime';
import { BASE_URL, token } from '../../config';
import { toast } from 'react-toastify';

const SlidePanel = ({ doctorId, timeSlots, ticketPrice, bookedSlots,language }) => {
    const [time, setTime] = useState('');

    const translation = {
        'en': {
            ticketPrice: 'Ticket price',
            availableTimeSlots: 'Available Time Slots:',
            bookAppointment: 'Book Appointment',
            pleaseSelect: 'Please select a valid time slot.',
        },
        'kn': {
            ticketPrice: 'ಟಿಕೆಟ್ ಬೆಲೆ',
            availableTimeSlots: 'ಲಭ್ಯವಿರುವ ಸಮಯದ ತಾಣಗಳು:',
            bookAppointment: 'ನಿಯೋಜನೆ ಬುಕ್ಕಿಂಗ್',
            pleaseSelect: 'ದಯವಿಟ್ಟು ಮಾನ್ಯವಾದ ಸಮಯದ ತಾಣವನ್ನು ಆಯ್ಕೆ ಮಾಡಿ.',
        },
        'hi': {
            ticketPrice: 'टिकट मूल्य',
            availableTimeSlots: 'उपलब्ध समय स्लॉट:',
            bookAppointment: 'अपॉइंटमेंट बुक करें',
            pleaseSelect: 'कृपया एक मान्य समय स्लॉट चुनें।',
        },
        'te': {
            ticketPrice: 'టికెట్ ధర',
            availableTimeSlots: 'అందుబాటులో ఉన్న సమయ స్లాట్లు:',
            bookAppointment: 'అపాయింట్‌మెంట్ బుక్ చేయండి',
            pleaseSelect: 'దయచేసి చెల్లుబాటు అయ్యే సమయ స్లాట్‌ను ఎంచుకోండి.',
        },
        'fr': {
            ticketPrice: 'Prix du billet',
            availableTimeSlots: 'Créneaux horaires disponibles :',
            bookAppointment: 'Réserver un rendez-vous',
            pleaseSelect: 'Veuillez sélectionner un créneau horaire valide.',
        },
    };
    const t = translation[language];
    const ticketPriceText = t.ticketPrice;
    const availableTimeSlotsText = t.availableTimeSlots;
    const bookAppointmentText = t.bookAppointment;
    const pleaseSelectText = t.pleaseSelect;

    // Function to check if a time slot is expired based on ending time
    const isExpired = (date, endTime) => {
        const now = new Date();
        const [hours, minutes] = endTime.split(':');
        const slotDateTime = new Date(date);
        slotDateTime.setHours(parseInt(hours), parseInt(minutes), 0);
        
        return slotDateTime < now;
    };

    const bookingHandler = async () => {
        if (!time) {
            toast.error(pleaseSelectText);
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
                <p className="text_para mt-0 font-semibold">{ticketPriceText}</p>
                <span className="text-[16px] leading-7 lg:text-[22px] lg:leading-8 text-headingColor font-bold">
                    {ticketPrice} RS
                </span>
            </div>

            <div className="mt-[30px]">
                <p className="text_para mt-0 font-semibold text-headingColor">{availableTimeSlotsText}</p>
                <ul className="mt-3">
                    {timeSlots?.map((item, index) => {
                        const isBooked = bookedSlots.includes(item.day);
                        const expired = isExpired(item.day, item.endingTime);

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
                {bookAppointmentText}
            </button>
        </div>
    );
};

export default SlidePanel;