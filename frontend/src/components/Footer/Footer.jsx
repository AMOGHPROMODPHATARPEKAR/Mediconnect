import React from 'react'
import { Link } from 'react-router-dom'
import logo from '../../assets/images/logo.png'
import {RiLinkedinFill} from 'react-icons/ri'
import { AiFillGithub, AiFillInstagram } from 'react-icons/ai'

const socialLinks = [
{
path:
"https://github.com/AMOGHPROMODPHATARPEKAR",
icon:
<AiFillGithub className="group-hover: text-white w-4 h-5"/>
},
{
path:
"https://www.linkedin.com/in/amogh-phaterpekar-a36082238/",
icon:
<RiLinkedinFill className="group-hover: text-white w-4 h-5"/>
},
];

const quickLinks01 =[
  {
    path:"/home",
    display:"Home"
  },
  {
    path:"/",
    display:"About Us"
  },
  {
    path:"/services",
    display:"Services"
  },
  
]
const quickLinks02 =[
  {
    path:"/doctors",
    display:"FInd a doctor"
  },
  {
    path:"/doctors",
    display:"Request Appointment"
  },
  {
    path:"/doctors",
    display:"FInd location"
  },
  {
    path:"/doctors",
    display:"Get Opinion"
  },
]
const quickLinks03 =[
  {
    path:"/",
    display:"Donate"
  },
  {
    path:"/contact",
    display:"Contact Us"
  },
  
]

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className='pb-16 pt-10'> 
      <div className=' container'>
        <div className=' flex justify-between flex-col md:flex-row flex-wrap gap-4'>
          <div>
            <img src={logo} alt="" />
            <p className=' text-[16px] leading-7 font-[300] '>CopyRight &copy; {year} developed by Amogh p  all rigts reserved </p>

          <div className='flex  items-center mt-4 gap-3'>
            {socialLinks.map((link,index)=>(
              <Link to={link.path}
              target='_blank'
              key={index}
              className=' w-9 h-9 border border-solid border-[#181A1E] rounded-full flex items-center justify-center group  hover:bg-primaryColor hover:border-none '>
              {link.icon}</Link>
            ))}
          </div>

          </div>

          <div>
            <h2 className=' text-[20px] leading-7 font-[700] mb-6 text-headingColor '>Quick links</h2>

            <ul>
              {quickLinks01.map((item,index)=>(
                <li key={index} className=' mb-4'>
                  <Link to={item.path}
                  className=' text-[16px] leading-7 font-[400] text-textColor '>
                  {item.display}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className=' text-[20px] leading-7 font-[700] mb-6 text-headingColor '>I want to:</h2>

            <ul>
              {quickLinks02.map((item,index)=>(
                <li key={index} className=' mb-4'>
                  <Link to={item.path}
                  className=' text-[16px] leading-7 font-[400] text-textColor '>
                  {item.display}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className=' text-[20px] leading-7 font-[700] mb-6 text-headingColor '>Support</h2>

            <ul>
              {quickLinks03.map((item,index)=>(
                <li key={index} className=' mb-4'>
                  <Link to={item.path}
                  className=' text-[16px] leading-7 font-[400] text-textColor '>
                  {item.display}</Link>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>
    </footer>
  )
}

export default Footer