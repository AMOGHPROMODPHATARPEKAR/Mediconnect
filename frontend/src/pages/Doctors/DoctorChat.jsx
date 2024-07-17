import React from 'react'
import { useNavigate } from 'react-router-dom'
import { BASE_URL } from '../../config'
import useFetchData from '../../hooks/useFetchData'
import Loader from '../../components/Loader/Loading.jsx'
import Error from '../../components/Error/Error.jsx'

const DoctorChat = () => {
    const {data,loading,error} = useFetchData(`${BASE_URL}/doctor/profile/me`)
    const navigate = useNavigate();
    const appointments = data?.appointements;
    console.log("dsd",appointments,data)
    return <section>
    <div className=' max-w-[1170px] px-5 mx-auto '>
      {loading && !error && <Loader/>}
      {error && !loading && <Error errMessage={error}/>} 

      {!loading && !error && (
        <div className=' flex items-center justify-center mt-6  '>
            <div >
                {appointments?.map((item)=>(
                    <div key={item._id} className='flex justify-center items-center p-2 m-1  border border-solid border-[#ccc] rounded-md w-[500px] cursor-pointer' onClick={()=>navigate(`/chat/${item.user?._id}`)} >
                        <img src={item.user?.photo} className="w-[40px] h-[40px] rounded-full"/>
                        <div className="pl-5 ">
                            <div className="text-base font-semibold">{item.user?.name}</div>
                        </div>  
                    </div>
                )) }
            </div>
        </div>
      )}

      {appointments?.length==0 && 
      <h1 className=' text-center font-[600] text-[50px] text-blue-700 '>No Booking</h1>
      }
      
    </div>
  </section>
  
}

export default DoctorChat