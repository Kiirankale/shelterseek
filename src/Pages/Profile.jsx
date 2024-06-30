import { getAuth } from 'firebase/auth';
import React from 'react'
import { useState } from 'react'
import { FcHome } from "react-icons/fc";
import { useNavigate } from 'react-router';


export default function Profile() {
  const navigate =useNavigate()
  const auth = getAuth();
  const [formData, setformData] = useState({ name: auth.currentUser.displayName, email: auth.currentUser.email });
  const { name, email } = formData;
  function handleLogOut(){
    auth.signOut();
    navigate("/")

  }


  return (
    <>
      <section className='max-w-6xl flex justify-center items-center flex-col mx-auto'>
        <h1 className='text-center text-3xl font-bold mt-6'>My Profile</h1>
        <div className='w-full md:w-[50%] px-4 mt-6  items-center '>
          <form >
            <input className='w-full mb-6 px-4 py-3 text-xl text-gray-700 bg-white border border-gray-300 rounded transition ease-in-out ' type="text" name="" id="name" value={name} disabled />
            <input className='w-full mb-6 px-4 py-3 text-xl text-gray-700 bg-white border border-gray-300 rounded transition ease-in-out' type="text" name="" id="email" value={email} disabled />

            <div className='flex justify-between whitespace-nowrap sm:text-lg text-sm'>
              <p>Do you want to change your name?<span className='text-red-600 cursor-pointer hover:text-red-700'>Edit</span></p>
              <p onClick={handleLogOut} className='text-blue-500 cursor-pointer hover:to-blue-700'>Sign out</p>
            </div>
            <button className='w-full flex justify-center items-center gap-3 bg-blue-600 mt-4 py-3 text-white uppercase'><FcHome className='block bg-white rounded-full text-2xl' /> Sell your property</button>

          </form>

        </div>
      </section>
    </>
  )
}
