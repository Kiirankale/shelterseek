import { getAuth, onAuthStateChanged } from 'firebase/auth';
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function Header() {
  const [pageState, setpageState] = useState("Sign-In");
  const location = useLocation();
  const navigate = useNavigate();
  const auth = getAuth();
  
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setpageState("Profile");
      } else {
        setpageState("Sign-In");
      }
    });
  }, [auth]);

  function pathMatchRoute(route) {
    if (route === location.pathname) {
      return true;
    }
  }

  return (
    <div className="bg-white border-b shadow-sm sticky top-0 z-40 w-full">
      <header className="flex justify-between items-center px-3 lg:px-6 max-w-6xl mx-auto">
        
        <div className="flex-shrink-0">
          <span
            className="h-5 cursor-pointer uppercase font-bold text-red-600 text-2xl lg:text-4xl"
            alt="logo"
            onClick={() => navigate("/")}
          >
            shelter<span className="text-black underline text-xl lg:text-3xl">seek</span>
          </span>
        </div>

        
        <div className="flex-grow"></div>

        
        <div>
          <ul className="flex space-x-4 lg:space-x-10">
            <li
              className={`cursor-pointer py-2 text-sm lg:text-lg font-semibold ${
                pathMatchRoute("/") ? "border-b-red-600 border-b-[3px] text-black" : "text-gray-400"
              }`}
              onClick={() => navigate("/")}
            >
              Home
            </li>
            <li
              className={`cursor-pointer py-2 text-sm lg:text-lg font-semibold ${
                pathMatchRoute("/Offers") ? "border-b-red-600 border-b-[3px] text-black" : "text-gray-400"
              }`}
              onClick={() => navigate("/Offers")}
            >
              Offers
            </li>
            <li
              className={`cursor-pointer py-2 text-sm lg:text-lg font-semibold text-gray-400 border-b-[3px] border-transparent ${
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
