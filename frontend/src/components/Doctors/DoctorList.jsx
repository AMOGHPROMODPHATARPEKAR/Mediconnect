import React from 'react'

import DoctorCard from './DoctorCard'
import useFetchData from '../../hooks/useFetchData'
import Loading from '../Loader/Loading'
import Error from '../Error/Error.jsx'
import { BASE_URL } from '../../config'

const DoctorList = () => {

  const {data:doctors,loading, error} = useFetchData(`${BASE_URL}/doctor`)

  return (
    <>
    {loading && !error && <Loading/>}
    {!loading && error && <Error errMessage={error.message} />}
    { !loading && !error &&  (<div className=' grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-[30px] mt-[30px] lg:mt-[55px] '>
    {doctors.map((doctor)=><DoctorCard doctor={doctor} key={doctor._id}  />)}
  </div>)}
    </>
  )
}

export default DoctorList