import React, { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { useParams } from 'react-router';
import { db } from '../firebase';
import Spinner from '../components/Spinner';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectFade, Autoplay, Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { FaBed, FaBath, FaMapMarkerAlt, FaParking, FaChair, FaShare } from 'react-icons/fa';
import { getAuth } from 'firebase/auth';
import Contact from '../components/Contact';
import 'ol/ol.css'; // Import OpenLayers styles
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';

// Component to handle OpenLayers map
function OpenLayersMap({ latitude, longitude }) {
  useEffect(() => {
    const map = new Map({
      target: 'ol-map',
      layers: [
        new TileLayer({
          source: new OSM(), // OpenStreetMap as the map source
        }),
      ],
      view: new View({
        center: fromLonLat([longitude, latitude]), // Use fromLonLat for correct projection
        zoom: 13, // Initial zoom level
      }),
    });

    // Clean up on component unmount
    return () => map.setTarget(null);
  }, [latitude, longitude]);

  return <div id="ol-map" className="w-full h-[200px] md:h-[400px] mt-6 md:mt-0 md:ml-2" />;
}

export default function Listing() {
  const auth = getAuth();
  const params = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [shareLinkCopied, setShareLinkCopied] = useState(false);
  const [contactLandlord, setContactLandlord] = useState(false);

  useEffect(() => {
    async function fetchListing() {
      const docRef = doc(db, 'listings', params.listingId);
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

  const latitude = listing?.geolocation?.lat ? parseFloat(listing.geolocation.lat) : null;
  const longitude = listing?.geolocation?.lon ? parseFloat(listing.geolocation.lon) : null;

  // Calculate final price and discount amount if offer exists
  const finalPrice = listing.offer
    ? listing.regularPrice - listing.discountedPrice
    : listing.regularPrice;
  const discountAmount = listing.offer ? listing.regularPrice - finalPrice : null;

  return (
    <main>
      <Swiper
        slidesPerView={1}
        navigation
        pagination={{ type: 'progressbar' }}
        effect="fade"
        modules={[EffectFade, Autoplay, Navigation, Pagination]}
        autoplay={{ delay: 3000 }}
      >
        {listing.imgUrls.map((url, index) => (
          <SwiperSlide key={index}>
            <div
              className="relative w-full overflow-hidden h-[300px]"
              style={{
                background: `url(${listing.imgUrls[index]}) center no-repeat`,
                backgroundSize: 'cover',
              }}
            ></div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div
        className="fixed top-[13%] right-[3%] z-10 bg-white cursor-pointer border-2 border-gray-400 rounded-full w-12 h-12 flex justify-center items-center"
        onClick={() => {
          navigator.clipboard.writeText(window.location.href);
          setShareLinkCopied(true);
          setTimeout(() => {
            setShareLinkCopied(false);
          }, 2000);
        }}
      >
        <FaShare className="text-lg text-slate-500" />
      </div>
      {shareLinkCopied && (
        <p className="fixed top-[23%] right-[5%] font-semibold border-2 border-gray-400 rounded-md bg-white z-10 p-2">
          Link Copied
        </p>
      )}

      <div className="m-4 flex flex-col md:flex-row max-w-6xl lg:mx-auto p-4 rounded-lg shadow-lg bg-white lg:space-x-5">
        <div className="w-full">
          <p className="text-2xl font-bold mb-3 text-blue-900">
            {listing.name} - ₹{' '}
            {listing.offer ? (
              <>
                {/* Regular price with line-through */}
                <span className="text-gray-500 line-through">
                  {listing.regularPrice
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                </span>{' '}
                {/* Final price after discount */}
                <span className="text-green-600">
                  ₹{' '}
                  {finalPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                </span>
              </>
            ) : (
              // Just regular price if no offer
              listing.regularPrice
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
            )}
            {listing.type === 'rent' ? ' / month' : ''}
          </p>

          {listing.offer && (
            <p className="text-green-800 font-bold">
              You will save ₹{' '}
              {discountAmount
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}!
            </p>
          )}

          <p className="flex items-center mt-6 mb-3 font-semibold">
            <FaMapMarkerAlt className="text-green-700 mr-1" />
            {listing.address}
          </p>

          <div className="flex justify-start items-center space-x-4 w-[75%]">
            <p className="bg-red-800 w-full max-w-[200px] rounded-md p-1 text-white text-center font-semibold shadow-md">
              {listing.type === 'rent' ? 'Rent' : 'Sale'}
            </p>
            {listing.offer && (
              <p className="w-full max-w-[200px] bg-green-800 rounded-md p-1 text-white text-center font-semibold shadow-md">
                ₹
                {(
                  listing.discountedPrice
                ).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')} discount
              </p>
            )}
          </div>

          <p className="mt-3 mb-3">
            <span className="font-semibold">Description - </span>
            {listing.description}
          </p>

          <ul className="flex items-center space-x-2 sm:space-x-10 text-sm font-semibold mb-6">
            <li className="flex items-center whitespace-nowrap">
              <FaBed className="text-lg mr-1" />
              {+listing.bedrooms > 1 ? `${listing.bedrooms} Beds` : '1 Bed'}
            </li>
            <li className="flex items-center whitespace-nowrap">
              <FaBath className="text-lg mr-1" />
              {+listing.bathrooms > 1 ? `${listing.bathrooms} Baths` : '1 Bath'}
            </li>
            <li className="flex items-center whitespace-nowrap">
              <FaParking className="text-lg mr-1" />
              {listing.parking ? 'Parking spot' : 'No parking'}
            </li>
            <li className="flex items-center whitespace-nowrap">
              <FaChair className="text-lg mr-1" />
              {listing.furnished ? 'Furnished' : 'Not furnished'}
            </li>
          </ul>

          {listing.userRef !== auth.currentUser?.uid && !contactLandlord && (
            <div className="mt-6">
              <button
                onClick={() => setContactLandlord(true)}
                className="px-7 py-3 bg-blue-600 text-white font-medium text-sm uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg w-full text-center transition duration-150 ease-in-out"
              >
                Contact Landlord
              </button>
            </div>
          )}

          {contactLandlord && <Contact userRef={listing.userRef} listing={listing} />}
        </div>

        {latitude && longitude && <OpenLayersMap latitude={latitude} longitude={longitude} />}
      </div>
    </main>
  );
}
