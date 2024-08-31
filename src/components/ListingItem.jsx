import React from 'react'

function ListingItem({ listing, id }) {
    return (
        <div>
                <h1>{listing.name}</h1>           
        </div>
    );
}

export default ListingItem
