import React from 'react'
import Moment from 'react-moment';
import { Link } from 'react-router-dom';
import { MdLocationOn } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { MdEdit } from "react-icons/md";

function ListingItem({ listing, id ,onDelete,onEdit}) {
    return (
        <li className='flex flex-col relative bg-white justify-between items-center shadow-md hover:shadow-xl rounded-md overflow-hidden m-[10px] transition-shadow duration-150 ease-in-out'>
            <Link className='contents' to={`/category/${listing.type}/${id}`}>
                <img className='h-[170px] w-full object-cover hover:scale-105 transition-scale duration-200 ease-in' loading='lazy' src={listing.imgUrls[0]} alt="" />
                <Moment className='absolute top-2 left-2 bg-blue-500 text-white rounded-sm text-xs uppercase px-2 py-1 font-semibold shadow-lg' fromNow>
                    {listing.timestamp?.toDate()}
                </Moment>
                <div className="w-full p-[10px]">
                    <div className="flex items-center space-x-1">
                        <MdLocationOn className='h-4 w-4 text-green-600' />
                        <p className='font-semibold text-sm mb-[2px] text-gray-600 truncate '>{listing.address}</p>
                    </div>
                    <p className='font-semibold m-0 text-xl truncate'>{listing.name}</p>
                    <p className='text-[#457b9d] mt-2 font-semibold'> &#8377;{listing.offer ? listing.discountedPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : listing.regularPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                        {listing.type === "rent" && " / month"}
                    </p>
                    <div className='flex items-center mt-[10px] space-x-3'>
                        <div className="flex items-center space-x-1">
                            <p className='font-bold text-xs'>{listing.bedrooms > 1 ? `${listing.bedrooms} beds` : "1 bed"}</p>
                        </div>
                        <div className='flex items-center space-x-1'>
                            <p className='font-bold text-xs'>{listing.bathrooms > 1 ? `${listing.bathrooms} baths` : "1 bath"}</p>
                        </div>
                    </div>
                </div>
            </Link>
            {onEdit && (<MdEdit className='absolute right-7 bottom-2 cursor-pointer h-4' onClick={()=>{onEdit(listing.id)}} />)}


            {onDelete && <MdDelete className='absolute right-2 bottom-2 cursor-pointer h-[14px]  text-red-600' onClick={()=>{onDelete(listing.id)}} /> }
        </li>
    );
}

export default ListingItem
