import React, { useState } from 'react';
import { BASE_URL } from '../../config';
import useFetchData from '../../hooks/useFetchData';
import Loading from '../../components/Loader/Loading';
import Error from '../../components/Error/Error.jsx';
import DoctorCard from '../../components/Doctors/DoctorCard.jsx';

const MyBookings = () => {
  const [activeTab, setActiveTab] = useState('active');
  const {
    data: appointments,
    loading,
    error
  } = useFetchData(`${BASE_URL}/user/appointement/my-appointements`);

  // Separate active and completed appointments
  const activeAppointments = appointments?.filter(item => item.status !== 'completed') || [];
  const completedAppointments = appointments?.filter(item => item.status === 'completed') || [];

  const TabButton = ({ name, value }) => (
    <button
      onClick={() => setActiveTab(value)}
      className={`py-2 px-4 rounded-lg ${
        activeTab === value
          ? 'bg-primaryColor text-white'
          : 'bg-gray-100 text-gray-500'
      }`}
    >
      {name}
    </button>
  );

  const CompletedAppointmentCard = ({ appointment }) => (
    <div className="p-4 border rounded-lg shadow-sm bg-white">
      <div className="flex items-start justify-between">
        <div className="flex gap-4">
          <img
            src={appointment.doctorInfo.photo}
            alt="doctor"
            className="w-24 h-24 rounded-lg object-cover"
          />
          <div>
            <h3 className="text-lg font-semibold">
              Dr. {appointment.doctorInfo.name}
            </h3>
            <p className="text-gray-500">{appointment.date}</p>
            <p className="text-primaryColor">₹{appointment.doctorInfo?.ticketPrice}</p>
          </div>
        </div>
        {appointment.reportUrl && (
          <a
            href={appointment.reportUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-primaryColor text-white rounded-lg hover:bg-primaryColor/90"
          >
            View Report
          </a>
        )}
      </div>
      {appointment.remarks && (
        <div className="mt-4">
          <h4 className="font-medium text-gray-700">Doctor's Remarks:</h4>
          <p className="mt-1 text-gray-600">{appointment.remarks}</p>
        </div>
      )}
    </div>
  );

  return (
    <div>
      {loading && !error && <Loading />}
      {!loading && error && <Error errMessage={error} />}

      {!loading && !error && (
        <div className="space-y-6 mt-4">
          <div className="flex gap-4">
            <TabButton name="Active Appointments" value="active" />
            <TabButton name="Previous Appointments" value="completed" />
          </div>

          {activeTab === 'active' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {activeAppointments.map(item => (
                <DoctorCard 
                  doctor={item?.doctorInfo} 
                  bookingId={item._id} 
                  key={item._id} 
                  booking={true}
                />
              ))}
              {activeAppointments.length === 0 && (
                <h2 className="col-span-full text-center text-primaryColor leading-7 text-[20px] font-semibold">
                  You have no active appointments!
                </h2>
              )}
            </div>
          )}

          {activeTab === 'completed' && (
            <div className="space-y-4">
              {completedAppointments.map(appointment => (
                <CompletedAppointmentCard 
                  key={appointment._id} 
                  appointment={appointment}
                />
              ))}
              {completedAppointments.length === 0 && (
                <h2 className="text-center text-primaryColor leading-7 text-[20px] font-semibold">
                  No previous appointments found!
                </h2>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MyBookings;