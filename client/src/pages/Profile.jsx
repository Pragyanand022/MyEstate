import React from 'react'
import { useSelector } from 'react-redux'

export default function 
() {
  const {currentUser} = useSelector((state) => state.user);
  return (
    <div className='p-3 max-w-lg mx-auto'>
       <h1 className='font-semibold text-3xl mt-7 text-center'>Profile</h1>
       <form className='flex flex-col gap-4'>
          <img className='rounded-full h-24 w-24 object-cover self-center my-3 cursor-pointer' src={currentUser.avatar} alt='profile-img'/>
          <input type="text" placeholder='username' className='border rounded-lg p-3 ' id='username'/>
          <input type="email" placeholder='email' className='border rounded-lg p-3 ' id='email'/>
          <input type="password" placeholder='password' className='border rounded-lg p-3 ' id='password'/>
          <button className='uppercase bg-slate-700 p-3 rounded-lg text-white hover:opacity-95 disabled:opacity-80'>Update</button>
        </form>
        <div className='flex justify-between mt-5'>
          <span className='text-red-700 cursor-pointer'>Delete account</span>
          <span className='text-red-700 cursor-pointer'>Sign out</span>
        </div>
    </div>
  )
}
