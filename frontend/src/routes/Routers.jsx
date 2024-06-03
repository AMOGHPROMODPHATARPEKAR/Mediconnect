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
import Verify from '../pages/Verify.jsx'


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
    <Route  path='/checkout-success' element={<CheckoutSuccess/>} />
    <Route  path='/verify' element={<Verify/>} />
    <Route path='/user/profile/me' element={<ProtectedRoute allowedRoles={['patient']}><MyAccount/></ProtectedRoute> }/>
    <Route path='/doctor/profile/me' element={ <ProtectedRoute allowedRoles={['doctor']}><Dashboard/></ProtectedRoute>}/>
  </Routes>
}

export default Routers