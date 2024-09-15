import { getAuth, updateProfile } from 'firebase/auth';
import { collection, doc, query, updateDoc, orderBy, where, getDocs, deleteDoc } from 'firebase/firestore';
import React from 'react'
import { useState, useEffect } from 'react'
import { FcHome } from "react-icons/fc";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { db } from "../firebase";
import { Link } from 'react-router-dom';
import ListingItem from '../components/ListingItem';



export default function Profile() {
  const navigate = useNavigate()
  const [changeDetails, setchangeDetails] = useState(false)
  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);

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
      if (auth.currentUser.displayName !== name) {
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

  useEffect(() => {
    async function fetchUserListing() {
      const listingRef = collection(db, "listings");
      const q = query(
        listingRef,
        where("userRef", "==", auth.currentUser.uid),
        orderBy("timestamp", "desc")
      );
      const querySnap = await getDocs(q);
      let listing = [];
      querySnap.forEach((doc) => {
        return listing.push({
          id: doc.id,
          data: doc.data()
        });
      })


      setListings(listing);
      setLoading(false);

    }
    fetchUserListing();

  }, [auth.currentUser.uid])

  async function onDelete(listingID) {
    if (window.confirm("Are you sure you want to delete?")) {
      await deleteDoc(doc(db, "listings", listingID));
      const updatedListings = listings.filter(
        (listing) => listing.id !== listingID
      );
      setListings(updatedListings);
      toast.success("Successfully deleted the listing");
    }
  }
  function onEdit(listingID){
    navigate(`/edit-listing/${listingID}`)
    
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


      <div className='max-w-6xl mt-6 px-3 mx-auto '>
        {
          !loading && listings.length > 0 && (
            <>
              <h1 className='text-2xl font-semibold text-center mt-6'> My Listing</h1>
              <ul className='sm:grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 mt-6 mb-6'>
               {listings.map((listing)=>{
                return (
                  <ListingItem key={listing.id} id={listing.id} listing={listing.data} onDelete={()=>{
                    onDelete(listing.id)
                  }}
                  onEdit={()=>{
                    onEdit(listing.id)
                  }}
                  />
                );

               })}
                  
                
            </ul>

            </>
          )
        }

      </div>


    </>
  )
}
