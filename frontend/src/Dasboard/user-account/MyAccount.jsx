import React, { useContext, useState } from 'react'
import userImg from '../../assets/images/doctor-img01.png'
import {authContext} from '../../context/AuthContext.jsx'
import MyBookings from './MyBookings.jsx';
import Profile from './Profile.jsx';
import useFetchData from '../../hooks/useFetchData.jsx';
import Loading from '../../components/Loader/Loading.jsx';
import Error from '../../components/Error/Error.jsx';
import { toast } from 'react-toastify';
import { token } from '../../config.js';



const MyAccount = () => {

    const {dispatch} = useContext(authContext);

    const [tab,setTab] = useState('bookings');
    
    const {data:userData, loading, error} = useFetchData('http://localhost:8000/api/v1/user/profile/me')

    

    const handleLogout =()=>{
        dispatch({
            type:'LOGOUT'
        });
    }

    const handleDelete = () => {
        toast(
          ({ closeToast }) => (
            <div className=' p-1 mt-3 '>
              <p className=' text-black font-semibold text-[20px]   '>Are you sure you want to delete this account?</p>
              <div className=' gap-3 flex items-center justify-around mt-2 text-[15px] font-[600] '>
              <button onClick={() => confirmDelete(closeToast)}  >Yes</button>
              <button onClick={closeToast}>No</button>
              </div>
              
            </div>
          ),
          {
            position: "top-center",
            autoClose: false,
          }
        );
      };
    
      const confirmDelete = async(closeToast) => {
        // Perform the delete action here
        
        try {
            // console.log(userData._id)
            const res = await fetch(`/api/v1/user/${userData._id}`,{
                method:'delete',
                headers:{
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
                }
            }) 

            const result = await res.json();

            if(!res.ok){
                throw new Error(result.message)
            }

            closeToast();

            dispatch({
                type:'LOGOUT'
            });

        toast.success("Item deleted successfully!");
        } catch (error) {

            toast.error(error.message)
        }

        
      };

  return (
    <section>
        <div className="max-w-[1170px] px-5 mx-auto">
        
        {loading && !error && <Loading/>}

        {error && !loading && <Error errMessage={error}/>}


        {
            !loading && !error &&(
                <div className="grid md:grid-cols-3 gap-10">

            <div className="pb-[50px] px-[30px] rounded-md">
                <div className="flex items-center justify-center">
                    <figure className="w-[100px] h-[100px] rounded-full border-2 border-solid border-primaryColor">
                        <img src={userData.photo} alt="" className= "w-full h-full rounded-full" />
                    </figure>
                </div>

                <div className="text-center mt-4" >
                    <h3 className="text-[18px] leading-[30px] text-headingColor font-bold ">{userData.name}</h3>
                    <p className="text-textColor text-[15px] leading-6 font-medium">{userData.email}</p>
                    <p className=' text-textColor text-[15px] leading-6 font-medium '>Blood Type: <span className=' ml-2 text-headingColor text-[22px] leading-8 ' >{userData.bloodType}</span></p>
                </div>

                <div className=' mt-[50px] md:mt-[100px] text-white '>
                    <button onClick={handleLogout} className=' w-full bg-[#181A1E] p-3 leading-7 text-[16px] rounded-md  '>Logout</button>
                    <button onClick={handleDelete} className=' w-full bg-red-600 p-3 leading-7 text-[16px] rounded-md mt-4 '>Delete Account</button>
                </div>

            </div>

            <div className="md:col-span-2 md:px-[30px]" >
               <div>
                <button onClick={()=>setTab('bookings')}
                className={`${tab === "bookings" &&"bg-primaryColor text-white font-normal"}
                p-2 mr-5 px-5 rounded-md text-headingColor font-semibold text-[16px] leading-7 border
                border-solid border-primaryColor`}
                >My Bookings</button>
                <button onClick={()=>setTab('setting')}
                className={`${tab === "setting" &&"bg-primaryColor text-white font-normal"}
                p-2 mr-5 px-5 rounded-md text-headingColor font-semibold text-[16px] leading-7 border
                border-solid border-primaryColor`}
                >Profile Settings</button>
                </div> 

            {tab === 'bookings' && <MyBookings/>}
            {tab === 'setting' && <Profile user={userData}/>}

            </div>

        </div>
            )
        }
        
    </div>
    </section>
  )
}

export default MyAccount