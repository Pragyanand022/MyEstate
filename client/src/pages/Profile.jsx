import { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage'
import {app} from '../firebase.js';

export default function 
() {
  const {currentUser} = useSelector((state) => state.user);
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError,setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  
  useEffect(()=>{
    if(file){
      handleFileUpload(file);
    }
  },[file]); 
  const handleFileUpload =(file)=>{
    const storage = getStorage(app);
    const fileName = new Date().getTime + file.name;
    const storageRef = ref(storage,fileName);
    const uploadTask = uploadBytesResumable(storageRef,file);
    uploadTask.on('state_changed',
    (snapshot)=>{
      const progress = (snapshot.bytesTransferred/snapshot.totalBytes*100);
      setFilePerc(Math.round(progress));
    },
    (error) =>{
      setFileUploadError(true);
    },
    ()=>{
      getDownloadURL(uploadTask.snapshot.ref).then
      ((downloadURL)=>{
        setFormData({...formData, avatar:downloadURL});
      })
    }
    )
  }

  return (
    <div className='p-3 max-w-lg mx-auto'>
       <h1 className='font-semibold text-3xl mt-7 text-center'>Profile</h1>
       <form className='flex flex-col gap-4'>
          <input hidden type='file' 
          onChange={(e)=>setFile(e.target.files[0])}
          ref={fileRef} accept='image/*'/>
          <img onClick={()=>fileRef.current.click()} className='rounded-full h-24 w-24 object-cover self-center mt-3 cursor-pointer' src={formData.avatar||currentUser.avatar} alt='profile-img'/>
          <p className='text-sm font-semibold self-center'>
            {(fileUploadError)?
              <span className='text-red-600'>Error uploading file!</span>:(
                (filePerc>0 && filePerc<100)?<span className='text-slate-600'>Uploading {filePerc}%</span>:
                <span className='text-green-600'>Profile image successfully uploaded!</span>
              )
            }
          </p>
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
