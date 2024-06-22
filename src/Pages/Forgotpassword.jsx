import React from 'react'
import { useState } from 'react';


import { Link } from 'react-router-dom';
import Oauth from '../components/Oauth';

export default function Forgotpassword() {



  const [email, setemail] = useState("")
 

  function onChange(e) {
    setemail(e.target.value)
   


  }
  return (
    <>
      <section>
        <h1 className='text-center mt-6 text-3xl font-bold'>Forgot Password</h1>
        <div className='flex justify-center flex-wrap items-center px-6 py-12 max-w-6xl  mx-auto'>
          <div className='md:w-[67%] lg:w-[50%] md:mb-6 mb-12 '>
            <img className='w-full rounded-2xl' src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=773&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="key" />
          </div>
          <div className='w-full md:w-[67%] lg:w-[40%] lg:ml-14' >
            <form  >
              <input className='w-full mb-6 px-4 py-2 text-2xl text-gray-400 bg-white border-gray-300 rounded transition ease-in-out' type="email" name="email" id="email" value={email} onChange={onChange} placeholder='Email address' />

              <div className='flex justify-between whitespace-nowrap text-sm sm:text-lg mb-3'>
                <p>Don't have account? <Link to={"/sign-Up"} className='text-red-600 cursor-pointer hover:text-red-700 ml-1'>Register</Link></p>
                <p className='text-blue-600 cursor-pointer hover:text-blue-700 ml-1'><Link to={"/sign-in"}>Sign In instead</Link></p>
              </div>
              <button className='w-full bg-blue-600 text-white px-7 py-3 rounded text-sm font-medium shadow-sm uppercase hover:bg-blue-700 transition duration-150 ease-in-out hover:shadow-lg active:bg-blue-800' type='submit'>Send reset password</button>
              <div className='my-4 before:border-t flex before:flex-1 items-center before:border-gray-300 after:border-t after:flex-1  after:border-gray-300 '>
                <p className='text-center font-semibold mx-4'>OR</p>
              </div>
              <Oauth />
            </form>



          </div>
        </div>
      </section>
    </>
  )
}
