import React from 'react'
import { FcGoogle } from "react-icons/fc";

export default function Oauth() {
  return (
   <button className='bg-red-700 flex w-full justify-center items-center gap-3 text-white py-3 rounded uppercase font-semibold shadow-sm px-7 hover:bg-red-700 hover:shadow-lg'> <FcGoogle className='bg-white rounded-full text-xl' />Continue with google</button>
  )
}
