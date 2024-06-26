import React from 'react'
import Home from '../pages/Home'
import Login from '../pages/Login'
import Signup from '../pages/Signup'
import Services from '../pages/Services'
import Contact from '../pages/Contact'
import Doctors from '../pages/Doctors/Doctors'
import DoctorDetails from '../pages/Doctors/DoctorDetails'
import MyAccount from '../Dasboard/user-account/MyAccount'
import Dashboard from '../Dasboard/doctor-account/Dashboard.jsx'

import {Routes, Route} from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute.jsx'
import CheckoutSuccess from '../pages/Doctors/CheckoutSuccess.jsx'
import CheckoutReject from '../pages/Doctors/CheckoutReject.jsx'
import Verify from '../pages/Verify.jsx'
import Chat from '../pages/Chat.jsx'
import DoctorChat from '../pages/Doctors/DoctorChat.jsx'
import ChatBot from '../pages/ChatBot.jsx'
import ForgetPassword from '../components/ForgetPassword.jsx'
import ChangePassword from '../components/ChangePassword.jsx'


const Routers = () => {
  return <Routes>
    <Route  path='/' element={<Home/>} />
    <Route  path='/home' element={<Home/>} />
    <Route  path='/doctors' element={<Doctors/>} />
    <Route  path='/doctors/:id' element={<DoctorDetails/>} />
    <Route  path='/login' element={<Login/>} />
    <Route  path='/register' element={<Signup/>} />
    <Route  path='/contact' element={<Contact/>} />
    <Route  path='/services' element={<Services/>} />
    <Route  path='/checkout-success/:doctorId/:time' element={<CheckoutSuccess/>} />
    <Route  path='/checkout-reject' element={<CheckoutReject/>} />
    <Route  path='/verify' element={<Verify/>} />
    <Route  path='/chats' element={<DoctorChat/>} />
    <Route  path='/chat/:id' element={<Chat/>} />
    <Route  path='/chatbot' element={<ChatBot/>} />
    <Route  path='/forgot' element={<ForgetPassword/>} />
    <Route  path='/changePassword/:id' element={<ChangePassword/>} />
    <Route path='/user/profile/me' element={<ProtectedRoute allowedRoles={['patient']}><MyAccount/></ProtectedRoute> }/>
    <Route path='/doctor/profile/me' element={ <ProtectedRoute allowedRoles={['doctor']}><Dashboard/></ProtectedRoute>}/>
  </Routes>
}

export default Routers