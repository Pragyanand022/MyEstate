import React from 'react'

export default function CreateListing() {
  return (
    <main className='p-3 max-w-4xl mx-auto font-semibold gap-4'>
        <h1 className='text-3xl font-semibold text-center my-7'>Create a listing</h1>
        <form className='flex flex-col sm:flex-row gap-4'>
          <div className='flex flex-col gap-3 flex-1'>
            <input type="text" className='border p-3 rounded-lg ' maxLength='30' minLength='10' placeholder='Name' id='name' required/>
            <textarea className='border p-3 rounded-lg ' placeholder='Description' id='description' required/>
            <input type="text" className='border p-3 rounded-lg ' maxLength='30' minLength='10' placeholder='Address' id='address' required/>
            <div className='flex gap-5 mt-4 flex-wrap'>
              <div className='flex gap-2'>
                <input type="checkbox" id="sell" className='w-5'/>
                <span>Sell</span>
              </div>
              <div className='flex gap-2'>
                <input type="checkbox" id="rent" className='w-5'/>
                <span>Rent</span>
              </div>
              <div className='flex gap-2'>
                <input type="checkbox" id="parkingSpot" className='w-5'/>
                <span>Parking Spot</span>
              </div>
              <div className='flex gap-2'>
                <input type="checkbox" id="furnished" className='w-5'/>
                <span>Furnished</span>
              </div>
              <div className='flex gap-2'>
                <input type="checkbox" id="offer" className='w-5'/>
                <span>Offer</span>
              </div>
            </div>
            <div className='flex gap-5 flex-wrap'>
            <div className='flex items-center gap-2'>
              <input type="number" id='bedrooms' min='1' max='10' defaultValue='1' required className='rounded-lg border border-gray-300 p-3'/>
              <p>Beds</p>
            </div>
            <div className='flex items-center gap-2'>
              <input type="number" id='bathrooms' min='1' max='10' defaultValue='1' required className='rounded-lg border border-gray-300 p-3'/>
              <p>Bathrooms</p>
            </div>
            <div className='flex items-center gap-2'>
              <input type="number" id='regularPrice' defaultValue='0' required className='rounded-lg border border-gray-300 p-3'/>
              <div className='flex flex-col text-center'>
                <p>Regular Price</p>
                <p className='text-xs'>($ / Month)</p>
              </div>
            </div>
            <div className='flex items-center gap-2'>
              <input type="number" id='regularPrice' defaultValue='0' required className='rounded-lg border border-gray-300 p-3'/>
              <div className='flex flex-col text-center'>
                <p>Regular Price</p>
                <p className='text-xs'>($ / Month)</p>
              </div>
            </div>
            </div>
          </div>
          <div className='flex flex-col flex-1 gap-4 mb-4'>
            <p>Images:
              <span className='font-normal text-gray-600 ml-2'>The first image will be the cover (max 6)</span>
            </p>
            <div className='flex gap-4'>
              <input type='file' id='images' accept='image/*' multiple className=' border p-3 rounded-lg w-full border-gray-300'/>
              <button className='border p-3 text-green-700 border-green-700 rounded uppercase'>upload</button>
            </div>
            <button className='border bg-slate-700 text-white p-3 rounded-lg uppercase'>Create Listing</button>
          </div> 
        </form>
    </main>
  )
}
