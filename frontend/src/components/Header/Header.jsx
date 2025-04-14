import React,{useContext, useEffect,useRef} from 'react'
import logo from '../../assets/images/logoh.png'
import {BiMenu} from 'react-icons/bi';
import {NavLink, Link, useNavigate} from 'react-router-dom';
import { authContext } from '../../context/AuthContext.jsx';
import { LanguageContext } from '../../context/LanguageContext.jsx';



const Header = () => {


  const headerRef = useRef(null)
  const menuRef = useRef(null)
  const {dispatch} = useContext(authContext);
 const {translations} = useContext(LanguageContext);
  const {user,role,token} = useContext(authContext);
  const navigate = useNavigate();

  const handleLogout =()=>{
    dispatch({
        type:'LOGOUT'
    });
    navigate('/login')
}

  let status;
  if(role === 'patient')
    {
      status=true;
    }else
    {
      status=false;
    }



  const navLinks = [
    {
      path:'/home',
      display:translations.navlink[0],
      active:true
    },
    {
      path:'/doctors',
      display:translations.navlink[1],
      active:status
    },
    {
      path:'/services',
      display:translations.navlink[2],
      active:true
    },
    {
      path:'/contact',
      display:translations.navlink[3],
      active:true
    },
    {
      path:"/verify",
      display:'Verify If Not',
      active:!status
    },
    {
      path:"/chats",
      display:translations.navlink[5],
      active:!status
    }
    ,
    {
      path:"/chatbot",
      display:translations.navlink[6],
      active:status
    }
    
    ,
    {
      path:"/report",
      display:'Report',
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
        <Link to='/'>
        <div className='cursor-pointer' >
          <img className=' w-[250px] h-[250px]' src={logo} alt="logo" />
        </div>
        </Link>
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
          <button onClick={handleLogout} className=' bg-red-500 py-2 px-6 text-white font-[600] h-[44px] flex items-center justify-center rounded-[50px] '>{translations.logout}
         </button>
        </div>
        ):(
      <Link to='/login'>
        <button className=' bg-primaryColor py-2 px-6 text-white font-[600] h-[44px] flex items-center justify-center rounded-[50px] '>{translations.login}
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