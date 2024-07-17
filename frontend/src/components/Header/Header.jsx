import React,{useContext, useEffect,useRef} from 'react'
import logo from '../../assets/images/logo.png'
import {BiMenu} from 'react-icons/bi';
import {NavLink, Link} from 'react-router-dom';
import { authContext } from '../../context/AuthContext.jsx';





const Header = () => {




  const headerRef = useRef(null)
  const menuRef = useRef(null)
  const {dispatch} = useContext(authContext);

  const {user,role,token} = useContext(authContext);

  const handleLogout =()=>{
    dispatch({
        type:'LOGOUT'
    });
}

  let status;
  if(role === 'patient')
    {
      status=true;
    }else
    {
      status=false;
    }

    console.log(!status)

  const navLinks = [
    {
      path:'/home',
      display:'Home',
      active:true
    },
    {
      path:'/doctors',
      display:'Find a Doctor',
      active:status
    },
    {
      path:'/services',
      display:'Services',
      active:true
    },
    {
      path:'/contact',
      display:'Contact',
      active:true
    },
    {
      path:"/verify",
      display:'Verify If Not',
      active:!status
    },
    {
      path:"/chats",
      display:'Chats',
      active:!status
    }
    
  ]


  const handleStickyHeader = ()=>{
    window.addEventListener('scroll',()=>{
      if(document.body.scrollTop > 80 || document.documentElement.scrollTop >80 ){
        headerRef.current.classList.add('sticky__header')
      }
      else{
        headerRef.current.classList.remove('sticky__header')
      }
    })
  }
 

    useEffect(()=>{
  handleStickyHeader();
  
  return ()=>window.removeEventListener('scroll',handleStickyHeader)

    });

  const toggleMenu = ()=> menuRef.current.classList.toggle('show__menu');

  return( 
  <header className='header flex items-center' ref={headerRef}>
    
    <div className=' container'>
      <div className=' flex items-center justify-between'>
        <div>
          <img src={logo} alt="logo" />
        </div>

      <div className='navigation' ref={menuRef} onClick={toggleMenu}>
        <ul className='menu flex items-center gap-[2.7rem]'>
        {
          navLinks.map((link,index)=>
            link.active?
            (

            <li key={index}>
              <NavLink to={link.path}
              className={navClass => navClass.isActive ? "text-primaryColor text-[16px] leading-7 font-[600] ":"text-textColor text-[16px] leading-7 font-[600] hover:text-primaryColor "}
              >
                 {link.display}
              </NavLink>
            </li>
          ):null)
        }
        </ul>
      </div>

       <div className=' flex items-center gap-4'>

        {token && user ?(
          <div className=' flex gap-3'>
          <Link to={`/${role==='patient'?'user':'doctor'}/profile/me`}>
          <figure className=' w-[35px] h-[35px] rounded-full '>
          <img src={user?.photo} alt="" className=' w-full rounded-full' />
          </figure>
          </Link>
          <button onClick={handleLogout} className=' bg-red-500 py-2 px-6 text-white font-[600] h-[44px] flex items-center justify-center rounded-[50px] '>Logout
         </button>
        </div>
        ):(
      <Link to='/login'>
        <button className=' bg-primaryColor py-2 px-6 text-white font-[600] h-[44px] flex items-center justify-center rounded-[50px] '>Login
         </button>
        </Link>
        ) }
        

        

        <span className=' md:hidden' onClick={toggleMenu}>
          <BiMenu className="w-6 h-6 cursor-pointer" />
        </span>

       </div>

      </div>
    </div>
    
  </header>)
}

export default Header