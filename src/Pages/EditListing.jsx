import React, { useEffect } from 'react'
import { useState } from 'react'
import Spinner from '../components/Spinner';
import { toast } from 'react-toastify';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { getAuth } from 'firebase/auth';
import { v4 as uuidv4 } from 'uuid';
import { db } from "../firebase.js"
import { doc, getDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { useNavigate, useParams } from 'react-router';

export default function CreateListing() {


    const navigate = useNavigate();
    const auth = getAuth();



    const [geolocationEnabled, setgeolocationEnabled] = useState(true);
    const [loading, setloading] = useState(false)
    const [listing, setlisting] = useState(false)
    const [formData, setformData] = useState({
        type: "rent",
        name: "",
        bedrooms: "1",
        bathrooms: "1",
        parking: false,
        furnished: false,
        address: "",
        description: "",
        offer: false,
        regularPrice: 0,
        discountedPrice: 0,
        latitude: 0,
        longitude: 0,
        images: {}
    });
    const {
        type,
        name,
        bedrooms,
        bathrooms,
        parking,
        furnished,
        address,
        description,
        offer,
        regularPrice,
        discountedPrice,
        latitude,
        longitude,
        images
    } = formData;
    const params = useParams();

    useEffect(() => {
        if (listing && listing.userRef != auth.currentUser.uid) {
            toast.error("You can't edit this listing.")
            navigate("/")

        }


    }, [navigate,listing,auth.currentUser.uid])


    useEffect(() => {
        setloading(true);
        async function fetchListing() {
            const docRef = doc(db, "listings", params.listingId);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setlisting(docSnap.data());
                setformData({ ...docSnap.data() });
                setloading(false);
            } else {
                navigate("/");
                toast.error("Listing does not exist");
            }
        }
        fetchListing();


    }, [navigate, params.listingId])


    function onChange(e) {
        let boolean = null;
        if (e.target.value === "true") {
            boolean = true;
        }
        if (e.target.value === "false") {
            boolean = false;
        }

        // for handling images
        if (e.target.files) {
            setformData((prevState) => ({
                ...prevState,
                images: e.target.files,
            }));
        }

        if (e.target.id === "latitude" || e.target.id === "longitude") {
            setformData((prevState) => ({
                ...prevState,
                [e.target.id]: parseFloat(e.target.value)
            }));
        } // Text/Boolean/Number
        if (!e.target.files) {
            setformData((prevState) => ({
                ...prevState,
                [e.target.id]: boolean ?? e.target.value,
            }));
        }
    }

    async function onSubmit(e) {
        e.preventDefault();
        setloading(true);

        // Validate prices
        if (regularPrice <= 0) {
            setloading(false);
            toast.error("Please enter regular price");
            return;

        }
        if (+discountedPrice >= +regularPrice) {
            setloading(false);
            toast.error("Discounted price is more than regular price");
            return;
        }

        // Validate image count
        if (images instanceof FileList && images.length > 6) {
            setloading(false);
            toast.error("Images are more than required");
            return;
        }

        let geolocation = {};
        let location;

        if (geolocationEnabled) {
            // Use the API URL directly without environment variable
            const apiUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`;
            const response = await fetch(apiUrl);

            // Check if response is OK
            if (!response.ok) {
                setloading(false);
                toast.error("Failed to fetch location data");
                return;
            }

            // Parse the JSON response
            const data = await response.json();



            // Ensure the data is an array and has elements
            if (Array.isArray(data) && data.length > 0) {
                geolocation.lat = data[0].lat;
                geolocation.lon = data[0].lon;

                location = geolocation.lat || geolocation.lon ? true : undefined;



            } else {
                location = undefined;
            }

            // Check if location is undefined
            if (location === undefined) {
                setloading(false);
                toast.error("Please enter a correct address");
                return;
            }
        } else {
            // Use manually entered latitude and longitude if geolocation is disabled
            geolocation.lat = latitude;
            geolocation.lon = longitude;
        }


        async function storeImage(image) {

            return new Promise((resolve, reject) => {


                const storage = getStorage();
                const filename = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`;


                const storageRef = ref(storage, filename);
                const uploadTask = uploadBytesResumable(storageRef, image);


                uploadTask.on(
                    "state_changed",
                    (snapshot) => {
                        // Observe state change events such as progress, pause, and resume
                        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                        const progress =
                            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        console.log("Upload is " + progress + "% done");
                        switch (snapshot.state) {
                            case "paused":
                                console.log("Upload is paused");
                                break;
                            case "running":
                                console.log("Upload is running");
                                break;
                        }
                    },
                    (error) => {
                        // Handle unsuccessful uploads
                        reject(error);
                    },
                    () => {
                        // Handle successful uploads on complete
                        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
                        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                            resolve(downloadURL);
                        });
                    }
                );
            });
        }




        const imgUrls = await Promise.all(
            [...images].map((image) => storeImage(image))
        ).catch((error) => {
            setloading(false);
            toast.error("Images not uploaded");
            return;
        });






        const formDataCopy = {
            ...formData,
            imgUrls,
            geolocation,
            timestamp: serverTimestamp(),
            userRef: auth.currentUser.uid,

        };


        delete formDataCopy.images;
        !formDataCopy.offer && delete formDataCopy.discountedPrice;
        delete formDataCopy.latitude;
        delete formDataCopy.longitude;
        console.log(formDataCopy)
        const docRef = doc(db, "listings", params.listingId);
        await updateDoc(docRef, formDataCopy)

        setloading(false);
        toast.success("Listing edited succesfully");


        navigate(`/category/${formDataCopy.type}/${docRef.id}`);



    }





    if (loading) {
        return <Spinner />
    }


    return (

        <main className='max-w-md px-2 mx-auto'>
            <h1 className='text-center text-3xl font-bold mt-6'>Edit Listing</h1>
            <form onSubmit={onSubmit} >
                <p className='text-lg font-semibold mt-6'>Sell/Rent</p>
                <div className='flex'>
                    <button
                        type="button"
                        id="type"
                        value="sale"
                        onClick={onChange}
                        className={`mr-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${type === "rent"
                            ? "bg-white text-black"
                            : "bg-slate-600 text-white"
                            }`}
                    >
                        sell
                    </button>
                    <button
                        type="button"
                        id="type"
                        value="rent"
                        onClick={onChange}
                        className={`ml-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${type === "sale"
                            ? "bg-white text-black"
                            : "bg-slate-600 text-white"
                            }`}
                    >
                        rent
                    </button>

                </div>
                <p className='text-lg font-semibold mt-6'>Name</p>
                <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={onChange}
                    placeholder="Name"
                    maxLength="32"
                    minLength="10"
                    required
                    className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 focus:border-2 mb-6 focus:outline-none focus:ring-0"
                />
                <div className='flex space-x-2 mb-2 '>
                    <div>
                        <p className='text-lg font-semibold '>Beds</p>
                        <input type="number" className=' w-full text-center rounded px-4 text-lg py-2 text-gray-700 border border-gray-300  focus:border-slate-600 focus:border-2 mb-6 focus:outline-none focus:ring-0 transition duration-150 ease-in-out' id='bedrooms' value={bedrooms} min="1" max="50" required onChange={onChange} />
                    </div>
                    <div>
                        <p className='text-lg font-semibold '>Baths</p>
                        <input type="number" className=' w-full text-center rounded px-4 text-lg py-2 text-gray-700 border border-gray-300  focus:border-slate-600 focus:border-2 mb-6 focus:outline-none focus:ring-0 transition duration-150 ease-in-out' id='bathrooms' value={bathrooms} min="1" max="50" required onChange={onChange} />
                    </div>

                </div>

                <p className='text-lg font-semibold mt-6 '>Parking spot</p>
                <div className='flex'>
                    <button
                        type="button"
                        id="parking"
                        value={true}
                        onClick={onChange}
                        className={`mr-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${!parking
                            ? "bg-white text-black"
                            : "bg-slate-600 text-white"
                            }`}
                    >
                        Yes
                    </button>
                    <button
                        type="button"
                        id="parking"
                        value={false}
                        onClick={onChange}
                        className={`ml-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${parking
                            ? "bg-white text-black"
                            : "bg-slate-600 text-white"
                            }`}
                    >
                        No
                    </button>

                </div>
                <p className='text-lg font-semibold mt-6 '>Furnished</p>
                <div className='flex'>
                    <button
                        type="button"
                        id="furnished"
                        value={true}
                        onClick={onChange}
                        className={`mr-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${!furnished
                            ? "bg-white text-black"
                            : "bg-slate-600 text-white"
                            }`}
                    >
                        Yes
                    </button>
                    <button
                        type="button"
                        id="furnished"
                        value={false}
                        onClick={onChange}
                        className={`ml-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${furnished
                            ? "bg-white text-black"
                            : "bg-slate-600 text-white"
                            }`}
                    >
                        No
                    </button>

                </div>
                <p className='text-lg font-semibold mt-6'>Address</p>
                <textarea
                    type="text"
                    id="address"
                    value={address}
                    onChange={onChange}
                    placeholder="Address"

                    required
                    className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 focus:border-2 mb-6 focus:outline-none focus:ring-0"
                />
                {!geolocationEnabled && (
                    <div className='flex mb-6 space-x-6 '>
                        <div >
                            <p className='font-semibold text-lg'>Latitude</p>
                            <input type="number" id="latitude" value={latitude} onChange={onChange} required min="-90" max="90" className='w-full px-4 py-2 text-gray-700 text-xl rounded  focus:border-slate-600 focus:border-2  focus:outline-none focus:ring-0 transition duration-150 ease-in-out' />
                        </div>
                        <div>
                            <p className='font-semibold text-lg'>Longitude</p>
                            <input type="number" id="longitude" value={longitude} onChange={onChange} required min="-180" max="180" className='w-full px-4 py-2 text-gray-700 text-xl rounded  focus:border-slate-600 focus:border-2  focus:outline-none focus:ring-0 transition duration-150 ease-in-out' />
                        </div>
                    </div>
                )}
                <p className='text-lg font-semibold '>Description</p>
                <textarea
                    type="text"
                    id="description"
                    value={description}
                    onChange={onChange}
                    placeholder="description"

                    required
                    className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 focus:border-2 mb-6 focus:outline-none focus:ring-0"
                />
                <p className='text-lg font-semibold  '>Offer</p>
                <div className='flex mb-6'>
                    <button
                        type="button"
                        id="offer"
                        value={true}
                        onClick={onChange}
                        className={`mr-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${!offer
                            ? "bg-white text-black"
                            : "bg-slate-600 text-white"
                            }`}
                    >
                        Yes
                    </button>
                    <button
                        type="button"
                        id="offer"
                        value={false}
                        onClick={onChange}
                        className={`ml-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${offer
                            ? "bg-white text-black"
                            : "bg-slate-600 text-white"
                            }`}
                    >
                        No
                    </button>

                </div>

                <div className='flex items-center mb-6'>
                    <div className=''> <p className='text-lg font-semibold'>Regular price </p>

                        <div className='flex items-center space-x-7'>
                            <div><input type="number" name="" id="regularPrice" value={regularPrice} onChange={onChange} className='w-full px-4 py-2 text-gray-700 text-xl rounded  focus:border-slate-600 focus:border-2  focus:outline-none focus:ring-0 transition duration-150 ease-in-out ' required /></div>
                            {type === "rent" && <div className='whitespace-nowrap'>&#8377;/Month</div>}

                        </div>
                    </div>


                </div>

                {offer && (<div className='flex items-center mb-6 '>
                    <div className=''> <p className='text-lg font-semibold'>Discounted price </p>

                        <div className=' w-full flex items-center justify-center space-x-6 '>
                            <div><input type="number" name="" id="discountedPrice" value={discountedPrice} onChange={onChange} className='w-full px-4 py-2 text-gray-700 text-xl rounded  focus:border-slate-600 focus:border-2  focus:outline-none focus:ring-0 transition duration-150 ease-in-out ' required={offer} /></div>
                            {type === "rent" && <div className='whitespace-nowrap'>&#8377;/Month</div>}

                        </div>
                    </div>






                </div>)}
                <div className='mb-6'>
                    <p className='text-xl font-semibold'>Images</p>
                    <p className='text-gray-600'>The first image will be cover(max 6)</p>
                    <input type="file" id='images' accept='.jpg,.png,.jpeg' onChange={onChange} className="w-full px-3 py-1.5 text-gray-700 bg-white border border-gray-300  focus:border-slate-600 focus:border-2  focus:outline-none focus:ring-0 transition duration-150 ease-in-out rounded" multiple required />
                </div>
                <button type='submit' className=' w-full bg-blue-600 mb-6 px-7 py-3 text-white font-medium uppercase text-sm rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:shadow-lg transition duration-150 ease-in-out'  >Edit listing</button>

            </form>
        </main>
    )
}

