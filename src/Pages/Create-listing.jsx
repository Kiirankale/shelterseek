import React from 'react'
import { useState } from 'react'

export default function CreateListing() {
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
        discountedPrice: 0
    })
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
        discountedPrice
    } = formData

    function onChange() {

    }

    return (
        <main className='max-w-md px-2 mx-auto'>
            <h1 className='text-center text-3xl font-bold mt-6'>Create Listing</h1>
            <form >
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
                            {type == "rent" && <div className='whitespace-nowrap'>&#8377;/Month</div>}

                        </div>
                    </div>


                </div>

                {offer && (<div className='flex items-center mb-6 '>
                    <div className=''> <p className='text-lg font-semibold'>Discounted price </p>

                        <div className=' w-full flex items-center justify-center space-x-6 '>
                            <div><input type="number" name="" id="discountedPrice" value={discountedPrice} onChange={onChange} className='w-full px-4 py-2 text-gray-700 text-xl rounded  focus:border-slate-600 focus:border-2  focus:outline-none focus:ring-0 transition duration-150 ease-in-out ' required={offer} /></div>
                            {type == "rent" && <div className='whitespace-nowrap'>&#8377;/Month</div>}

                        </div>
                    </div>






                </div>)}
                <div className='mb-6'>
                    <p className='text-xl font-semibold'>Images</p>
                    <p className='text-gray-600'>The first image will be cover(max 6)</p>
                    <input type="file" id='images' accept='.jpg,.png,.jpeg' onChange={onChange} className="w-full px-3 py-1.5 text-gray-700 bg-white border border-gray-300  focus:border-slate-600 focus:border-2  focus:outline-none focus:ring-0 transition duration-150 ease-in-out rounded" multiple required />
                </div>
                <button type='submit' className=' w-full bg-blue-600 mb-6 px-7 py-3 text-white font-medium uppercase text-sm rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:shadow-lg transition duration-150 ease-in-out'>Create listing</button>

            </form>
        </main>
    )
}

