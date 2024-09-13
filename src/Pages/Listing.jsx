import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { db } from '../firebase';
import Spinner from "../components/Spinner";
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectFade, Autoplay, Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { FaShare, FaBath, FaMapMarkerAlt, FaParking, FaChair } from "react-icons/fa";
import { LuBed } from "react-icons/lu";


export default function Listings() {
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [shareLinkCopied, setshareLinkCopied] = useState(false)
  const handleShareLink = () => {
    navigator.clipboard.writeText(window.location.href)
    setshareLinkCopied(true)
    setTimeout(() => {
      setshareLinkCopied(false)
    }, 2000);

  }



  const params = useParams();

  useEffect(() => {
    async function fetchListing() {
      const docRef = doc(db, "listings", params.listingId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setListing(docSnap.data());
        setLoading(false);

      }
    }

    fetchListing();
  }, [params.listingId]);

  if (loading) {
    return <Spinner />;
  }

  return (
    <main >
      <Swiper
        slidesPerView={1}
        navigation
        pagination={{ type: "progressbar" }}
        effect="fade"
        autoplay={{ delay: 3000 }}
        modules={[EffectFade, Navigation, Pagination, Autoplay]}
      >
        {listing.imgUrls.map((url, index) => (
          <SwiperSlide key={index}>
            <div
              className=" relative w-full overflow-hidden h-[300px]"
              style={{
                background: `url(${listing.imgUrls[index]}) center no-repeat`,
                backgroundSize: "cover",
              }}
            >
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <div className='fixed top-[13%] right-[3%] bg-white z-10 cursor-pointer border-gray-400 rounded-full w-12 h-12 flex justify-center items-center'
        onClick={handleShareLink}>
        <FaShare className='text-lg text-slate-500' />

      </div>
      {shareLinkCopied && (<p className="fixed top-[23%] right-[4%] font-semibold border-2 border-gray-400 rounded-md bg-white z-10 p-2">Link copied</p>)}
      <div className='max-w-6xl flex flex-col p-4 lg:mx-auto md:flex-row  m-4 rounded-lg shadow-lg bg-white lg:space-x-5 '>
        <div className='w-full'>
          <p className="text-2xl font-bold mb-3 text-blue-900">{listing.name} -&#8377;{listing.offer ? listing.discountedPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : listing.regularPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            {listing.type === "rent" && " / month"}</p>
          <p className='flex items-center mt-6 mb-2 space-x-2 font-semibold '><FaMapMarkerAlt className='text-green-700 mr-1' /> {listing.address}</p>
          <div className="flex justify-start items-center space-x-4 w-[75%]">
            <p className="bg-red-800 w-full max-w-[200px] rounded-md p-1 text-white text-center font-semibold shadow-md">
              {listing.type === "rent" ? "Rent" : "Sale"}
            </p>
            {listing.offer && (
              <p className="w-full max-w-[200px] bg-green-800 rounded-md p-1 text-white text-center font-semibold shadow-md">
                ₹ {+listing.regularPrice - +listing.discountedPrice} discount
              </p>
            )}
          </div>
          <p className='mt-3 mb-3'>
            <span className='font-semibold'>Description</span> - {listing.description}
          </p>
          <ul className="flex items-center space-x-2 sm:space-x-10 text-sm font-semibold mb-6">
            <li className='flex items-center whitespace-nowrap'>
              <LuBed className='mr-1 text-lg text-black' />{listing.bedrooms > 1 ? `${listing.bedrooms} Beds` : "1 Bed"}
            </li>
            <li className='flex items-center whitespace-nowrap'>
              <FaBath className='mr-1 text-lg' />{listing.bathrooms > 1 ? `${listing.bathrooms} Baths` : "1 Bath"}
            </li>

            <li className="flex items-center whitespace-nowrap">
              <FaParking className="text-lg mr-1" />
              {listing.parking ? "Parking spot" : "No parking"}
            </li>
            <li className="flex items-center whitespace-nowrap">
              <FaChair className="text-lg mr-1" />
              {listing.furnished ? "Furnished" : "Not furnished"}
            </li>

          </ul>

        </div>
        <div className='h-[200px] w-full'></div>
      </div>

    </main>
  );
}
