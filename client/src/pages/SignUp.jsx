import React from 'react'
import {Link} from 'react-router-dom'

export default function SignUp() {
  return (
    <div className='p-3 max-w-lg mx-auto font-semibold'>
      <h1 className='text-center text-3xl font-semibold my-7'>Sign Up</h1>
      <form className='flex flex-col gap-4'>
        <input type="text" className='rounded-lg p-3 border ' placeholder='username' id='username'/>
        <input type="email" className='rounded-lg p-3 border ' placeholder='email' id='email' />
        <input type="password" className='rounded-lg p-3 border ' placeholder='password' id='password'/>
        <button className='bg-slate-700 text-white rounded-lg p-3 hover:opacity-95 disabled:opacity-80'>SIGN UP</button>
      </form>
      <div className="flex gap-2 mt-5 opacity-85">
        <p>Have an account?</p>
        <Link to={"/sign-in"}></Link><span className='text-blue-700'>Sign in</span>    
      </div>
    </div>
  )
}
