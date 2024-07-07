import { getAuth, onAuthStateChanged } from 'firebase/auth';
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useState,useEffect } from 'react';


export default function Header() {
  const [pageState, setpageState] = useState("Sign-In")
  const location = useLocation();
  const navigate = useNavigate();
  const auth = getAuth();
  useEffect(() => {
    onAuthStateChanged( auth,(user)=>{
    if(user){
      setpageState("Profile")

    }
    else{
      setpageState("Sign-In")
    }
    
    })
   
   
  }, [])
  
  

  function pathMatchRoute(route) {
    if(route === location.pathname){
      return true;
    }
    
  }

  return (
    <div className='bg-white border-b shadow-sm sticky top-0 z-40'>
      <header className='flex justify-between items-center px-3 max-w-6xl mx-auto'>
        <div>
          <span className='h-5 cursor-pointer uppercase font-bold text text-red-600 text-3xl '
            
            alt="logo"
            onClick={() => {
              navigate("/");
            }}>
              shelter<span className='text-black underline text-2xl'>seek</span>

          </span>
            
         
        </div>
        <div>
          <ul className='flex space-x-10'>
            <li
             className={` cursor-pointer py-3 text-sm font-semibold   ${pathMatchRoute("/") ?   "border-b-red-600 border-b-[3px] text-black":" text-gray-400 "}`}
              onClick={() => {
                navigate("/");
              }}
            >
              Home
            </li>
            <li
              className={` cursor-pointer py-3 text-sm font-semibold   ${pathMatchRoute("/Offers") ?   "border-b-red-600 border-b-[3px] text-black":" text-gray-400 "}`}
              onClick={() => {
                navigate("/Offers");
              }}
            >
              Offers
            </li>
            <li
              className={`cursor-pointer py-3 text-sm font-semibold text-gray-400 border-b-[3px] border-transparent  ${
                (pathMatchRoute("/sign-in") || pathMatchRoute("/profile")) &&
                "text-black border-b-red-500"
              }`}
              onClick={() => navigate("/profile")}
            >
              {pageState}
            </li>

          </ul>
        </div>
      </header>
    </div>
  );
}

