import React from 'react'
import { useState } from 'react';
import { IoEyeOff } from "react-icons/io5";
import { IoEye } from "react-icons/io5";
import { Link, useNavigate } from 'react-router-dom';
import Oauth from '../components/Oauth';
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { db } from "../firebase";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { toast } from 'react-toastify';



export default function SignUp() {
  const [showPassword, setshowPassword] = useState(false)
  const navigate = useNavigate()
  function handleShowPassword() {
    setshowPassword(!showPassword)
  }

  const [formData, setformData] = useState({ name:"", email: "", password: "" })
  const { name,  email, password } = formData

  function onChange(e) {
    setformData((prevState) => ({
      ...prevState, [e.target.id]: e.target.value

    }))
    
  }

  async function onSubmit(e){
     e.preventDefault()
  

  try {
    const auth =getAuth();
    const userCredentials = await createUserWithEmailAndPassword(auth,email,password)
     const user = userCredentials.user;
     updateProfile(auth.currentUser,{
      displayName:name
     })
      const formDataCopy ={...formData};
      delete formDataCopy.password;
      formDataCopy.timestamp = serverTimestamp();
      await setDoc(doc(db, "users", user.uid), formDataCopy);
      navigate("/")
      toast.success("Signed up succesfully")

     
  } catch (error) {
     toast.error("something went wrong in registration")
  }
}
  return (
    <>
      <section>
        <h1 className='text-center mt-6 text-3xl font-bold'>Sign Up</h1>
        <div className='flex justify-center flex-wrap items-center px-6 py-12 max-w-6xl  mx-auto'>
          <div className='md:w-[67%] lg:w-[50%] md:mb-6 mb-12 '>
            <img className='w-full rounded-2xl' src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=773&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="key" />
          </div>
          <div className='w-full md:w-[67%] lg:w-[40%] lg:ml-14' >
            <form  onSubmit={onSubmit} >
              <input className='w-full mb-6 px-4 py-2 text-2xl text-gray-400 bg-white border-gray-300 rounded transition ease-in-out' type="text" name="name" id="name" value={name} onChange={onChange} placeholder='Full Name' />
              <input className='w-full mb-6 px-4 py-2 text-2xl text-gray-400 bg-white border-gray-300 rounded transition ease-in-out' type="email" name="email" id="email" value={email} onChange={onChange} placeholder='Email address' />
              <div className='relative mb-6'>
                <input className='w-full px-4 py-2 text-2xl text-gray-400 bg-white border-gray-300 rounded transition ease-in-out' type={showPassword ? "text" : "password"} name="password" id="password" value={password} onChange={onChange} placeholder='password' />
                {showPassword ? <IoEye className='absolute top-3 right-3 text-xl cursor-pointer ' onClick={handleShowPassword} /> : <IoEyeOff className='absolute top-3 right-3 text-xl cursor-pointer ' onClick={handleShowPassword} />}
              </div>
              <div className='flex justify-between whitespace-nowrap text-sm sm:text-lg mb-3'>
                <p>have a account? <Link to={"/sign-in"} className='text-red-600 cursor-pointer hover:text-red-700 ml-1'>Sign in</Link></p>
                <p className='text-blue-600 cursor-pointer hover:text-blue-700 ml-1'><Link to={"/Forgot-password"}>Forgot password?</Link></p>
              </div>
              <button className='w-full bg-blue-600 text-white px-7 py-3 rounded text-sm font-medium shadow-sm uppercase hover:bg-blue-700 transition duration-150 ease-in-out hover:shadow-lg active:bg-blue-800' type='submit'>Sign UP</button>
              <div className='my-4 before:border-t flex before:flex-1 items-center before:border-gray-300 after:border-t after:flex-1  after:border-gray-300 '>
                <p className='text-center font-semibold mx-4'>OR</p>
              </div>
            <Oauth/>
            </form>



          </div>
        </div>
      </section>
    </>
  )
}
