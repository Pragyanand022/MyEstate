import { useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import { signInFailure, signInStart, signInSuccess } from '../redux/user/userSlice';

export default function SignIn() {
  const [formData, setFormData] = useState({});
  const {loading,error} = useSelector((state)=>state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleChange =(e) =>{
      setFormData({
          ...formData,
          [e.target.id]: e.target.value,
      });
    };
  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      dispatch(signInStart()) 
      const res = await fetch('/api/auth/signin',{
        method:'POST',
        headers: { 
          'Content-Type':'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log(data);
      if(data.success===false){
        dispatch(signInFailure(data.message));
        return;
      }  
      dispatch(signInSuccess(data));
      navigate('/');
    } catch (error) { 
      dispatch(signInFailure(error.message));
    }
  }; 
  return (
    <div className='p-3 max-w-lg mx-auto font-semibold'>
      <h1 className='text-center text-3xl font-semibold my-7'>Sign In</h1>
      <form className='flex flex-col gap-4' onSubmit={submitHandler}>
        <input type="email" className='rounded-lg p-3 border' placeholder='email' id='email' onChange={handleChange} />
        <input type="password" className='rounded-lg p-3 border ' placeholder='password' id='password' onChange={handleChange}/>
        <button disabled={loading} className='bg-slate-700 text-white rounded-lg p-3 hover:opacity-95 disabled:opacity-80'>{loading?'loading...':'SIGN IN'}</button>
      </form>
      <div className="flex gap-2 mt-5 opacity-85">
        <p>Do not have an account?</p>
        <Link to={"/sign-up"}><span className='text-blue-700'>Sign up</span></Link>
      </div>
      {error && <p className='text-red-600 mt-5'>{error}</p>}
    </div>
  )
}
