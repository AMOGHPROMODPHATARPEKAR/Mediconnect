import React from 'react'
import {BASE_URL} from '../../config'
import useFetchData from '../../hooks/useFetchData'
import Loading from '../../components/Loader/Loading'
import Error from '../../components/Error/Error.jsx'
import DoctorCard from '../../components/Doctors/DoctorCard.jsx'

const MyBookings = () => {

  const {
    data:appointments,
    loading,
    error
   } = useFetchData(`${BASE_URL}/user/appointement/my-appointements`)
  // console.log(appointments)
  return (

    <div>
      {loading && !error && <Loading/>}
      {!loading && error && <Error errMessage={error}/>}

      {!loading && !error && (
        <div className=' grid grid-cols-1 lg:grid-cols-2 gap-5 '>
          {appointments.map(item => (
            <DoctorCard doctor={item?.doctorInfo} bookingId={item._id} key={item._id} booking={true} />
          ))}
        </div>
      )}

      {!loading && !error && appointments.length === 0 && (
      <h2 className=' mt-5 text-center text-primaryColor leading-7 text-[20px] font-semibold   '>You did no book any Doctor yet!</h2>
      )}

    </div>
  )
}

export default MyBookings