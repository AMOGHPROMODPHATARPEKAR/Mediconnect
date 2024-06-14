import React, { useEffect, useState } from 'react'

import DoctorCard from '../../components/Doctors/DoctorCard'
import Testimonial from '../../components/Testimonial/Testimonial'
import useFetchData from '../../hooks/useFetchData.jsx'
import Loading from '../../components/Loader/Loading.jsx'
import Error from '../../components/Error/Error.jsx'
import { BASE_URL } from '../../config.js'

const Doctors = () => {
const [query,setQuery] =useState('')
  const [debounceQuery,setDebounceQuery] = useState('')

  const handleSearch = ()=>{
    setQuery(query.trim())

    console.log('handle search')
  }

  useEffect(()=>{
 const timeout = setTimeout(()=>{
  setDebounceQuery(query)
 },700)
  },[query])

  const {data:doctors,loading, error} = useFetchData(`${BASE_URL}/doctor?query=${debounceQuery}`)

  return (
    <>
    <section className=' bg-[#fff9ea] ' >
      <div className=' container text-center '>
        <h2 className=' heading ' >Find a Doctor</h2>
        <div className="max-w-[570px] mt-[30px] mx-auto bg-[#0066ff2c] rounded-md flex items-center justify-between">
          <input type="search"
          className="py-4 pl-4 pr-2 bg-transparent w-full focus: outline-none cursor-pointer
          placeholder: text-textColor"
          placeholder="Search doctor by name or specialization or location"
          value={query}
          onChange={e=>setQuery(e.target.value)}
          />
          <button className="btn mt-0 rounded-[0px] rounded-r-md" onClick={handleSearch}>Search</button>
        </div>
      </div>
    </section>

    <section>
      <div className="container">
      {loading && !error && <Loading/>}
    {!loading && error && <Error errMessage={error.message} />}
    {!loading && !error && (
      <div className=' grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-[30px] '>
    {doctors.map((doctor)=><DoctorCard doctor={doctor} key={doctor._id}  />)}
  </div>
    )}
      
      </div>
    </section>

    <section>
    <div className=' container'>
    <div className=' xl:w-[470px] mx-auto '>
        <h2 className=' heading text-center '>What our patient says</h2>
        <p className='text_para text-center'>Genuine opinions </p>
      </div>

    <Testimonial/>

    </div>
    
  </section>

    </>
  )
}

export default Doctors