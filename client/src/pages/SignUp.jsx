import { useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import OAuth from '../components/OAuth';

export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [loading ,setLoading] = useState(false);
  const navigate = useNavigate();
  const handleChange =(e) =>{
      setFormData({
          ...formData,
          [e.target.id]: e.target.value,
      });
    };
  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const res = await fetch('/api/auth/signup',{
        method:'POST',
        headers: {
          'Content-Type':'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if(data.success===false){
        setError(data.message);
        setLoading(false);
        return;
      }  
      setLoading(false);
      setError(null);
      navigate('/sign-in');
    } catch (error) { 
      setLoading(false);
      setError(error.message);
    }
  }; 
  return (
    <div className='p-3 max-w-lg mx-auto font-semibold'>
      <h1 className='text-center text-3xl font-semibold my-7'>Sign Up</h1>
      <form className='flex flex-col gap-4' onSubmit={submitHandler}>
        <input type="text" className='rounded-lg p-3 border ' placeholder='username' id='username' onChange={handleChange}/>
        <input type="email" className='rounded-lg p-3 border' placeholder='email' id='email' onChange={handleChange} />
        <input type="password" className='rounded-lg p-3 border ' placeholder='password' id='password' onChange={handleChange}/>
        <button disabled={loading} className='bg-slate-700 text-white rounded-lg p-3 hover:opacity-95 disabled:opacity-80'>{loading?'loading...':'SIGN UP'}</button>
        <OAuth/>
      </form>
      <div className="flex gap-2 mt-5 opacity-85">
        <p>Have an account?</p>
        <Link to={"/sign-in"}><span className='text-blue-700'>Sign in</span></Link>
      </div>
      {error && <p className='text-red-600 mt-5'>{error}</p>}
    </div>
  )
}
