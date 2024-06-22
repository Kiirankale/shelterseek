import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  

  function pathMatchRoute(route) {
    if(route === location.pathname){
      return true;
    }
    
  }

  return (
    <div className='bg-white border-b shadow-sm sticky top-0 z-50'>
      <header className='flex justify-between items-center px-3 max-w-6xl mx-auto'>
        <div>
          <img
            className='h-5 cursor-pointer'
            src=""
            alt="logo"
            onClick={() => {
              navigate("/");
            }}
          />
        </div>
        <div>
          <ul className='flex space-x-10'>
            <li
              className={` py-3 text-sm font-semibold border-b-[3px] border-b-transparent ${pathMatchRoute("/") ?"border-b-red-600 text-black":" text-gray-400"}`}
              onClick={() => {
                navigate("/");
              }}
            >
              Home
            </li>
            <li
              className={` py-3 text-sm font-semibold border-b-[3px] border-b-transparent ${pathMatchRoute("/Offers") ?"border-b-red-600 text-black":" text-gray-400"}`}
              onClick={() => {
                navigate("/Offers");
              }}
            >
              Offers
            </li>
            <li
              className={` py-3 text-sm font-semibold border-b-[3px] border-b-transparent ${pathMatchRoute("/sign-In") ?"border-b-red-600 text-black":" text-gray-400"}`}
              onClick={() => {
                navigate("/sign-In");
              }}
            >
              Sign-In
            </li>

          </ul>
        </div>
      </header>
    </div>
  );
}

