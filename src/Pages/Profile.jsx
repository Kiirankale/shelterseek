import { getAuth, updateProfile } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import React from 'react'
import { useState } from 'react'
import { FcHome } from "react-icons/fc";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { db } from "../firebase";
import { Link } from 'react-router-dom';


export default function Profile() {
  const navigate = useNavigate()
  const [changeDetails, setchangeDetails] = useState(false)
  const auth = getAuth();
  const [formData, setformData] = useState({ name: auth.currentUser.displayName, email: auth.currentUser.email });
  const { name, email } = formData;
  function handleLogOut() {
    auth.signOut();
    navigate("/")

  }
  function onChange(e) {
    setformData((prevState) => (
      { ...prevState, [e.target.id]: e.target.value }
    ))

  }
  async function onSubmit() {
    try {
      if (auth.currentUser.displayName != name) {
        //update display name in firebase
        await updateProfile(auth.currentUser, {
          displayName: name,

        });

        // update name in firestore
        const docRef = doc(db, "users", auth.currentUser.uid)


        await updateDoc(docRef, {
          name,
        })


      }

      toast.success("Profile details updated succesfully.")

    } catch (error) {
      toast.error("could not update the profile details.")

    }

  }


  return (
    <>
      <section className='max-w-6xl flex justify-center items-center flex-col mx-auto'>
        <h1 className='text-center text-3xl font-bold mt-6'>My Profile</h1>
        <div className='w-full md:w-[50%] px-4 mt-6  items-center '>
          <form >
            <input className={`w-full mb-6 px-4 py-3 text-xl text-gray-700 bg-white border border-gray-300 rounded transition ease-in-out ${changeDetails && "bg-red-200 focus:bg-red-200"}`}
              onChange={onChange} type="text" name="" id="name" value={name} disabled={!changeDetails} />
            <input className={`w-full mb-6 px-4 py-3 text-xl text-gray-700 bg-white border border-gray-300 rounded transition ease-in-out `} type="text" name="" id="email" value={email} disabled={!changeDetails} />

            <div className='flex justify-between whitespace-nowrap sm:text-lg text-sm'>
              <p>Do you want to change your name?<span onClick={() => {
                changeDetails && onSubmit();
                setchangeDetails((prevState) => !prevState)

              }} className='text-red-600 cursor-pointer hover:text-red-700'>{changeDetails ? "Apply changes" : "Edit"}</span></p>
              <p onClick={handleLogOut} className='text-blue-500 cursor-pointer hover:to-blue-700'>Sign out</p>
            </div>


          </form>
          <button className='w-full  bg-blue-600 mt-4 py-3 px-7 rounded-sm text-white uppercase'><Link to={"/create-listing"} className='flex justify-center items-center'><FcHome className=' bg-red-200 mr-2 rounded-full text-3xl p-1 border-2' /> Sell your property</Link></button>

        </div>
      </section>

    </>
  )
}
