import { useState,useEffect } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import {useSelector} from 'react-redux'
import { useNavigate, useParams } from "react-router-dom";

export default function CreateListing() {
  const {currentUser} = useSelector(state => state.user);
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name:'',
    description:'',
    address:'',
    regularPrice:0,
    discountPrice:0,
    bathrooms:0,
    bedrooms:0,
    furnished:false,
    parking:false,
    offer:false,
    type:'rent',
    userRef:'',
  });
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false) ;
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const params = useParams();

  useEffect(()=>{
    const fetchListing = async ()=>{
        const listingId = params.listingId;
        const res = await fetch(`/api/listing/get/${listingId}`);
        const data =await res.json();
        if(data.success===false){
            console.log(data.message);
            return;
        } 
        setFormData(data); 
    }
    fetchListing();
  },[]);

  const handleImageSubmit = (e) => {
    if (files.length > 0 && files.length+formData.imageUrls.length   < 7) {
      const promises = [];
      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
      setUploading(true);
      Promise.all(promises).then((urls) => {
        setFormData({
          ...formData,
          imageUrls: formData.imageUrls.concat(urls),
        });
        setImageUploadError(false);
        setUploading(false);
      }).catch((err)=>{
        setImageUploadError('Error in uploading the image (2MB max per image or 6 images at max)!');
        setUploading(false);
      })
    }
    else{
      setImageUploadError('You can only upload 6 images!');
      setUploading(false);
    }
    
  };

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };
  const handleRemoveImage = (index)=>{
    setFormData({
      ...formData, imageUrls : formData.imageUrls.filter((_,i)=> i!==index),
    })
  };

  const handleChange = (e)=>{
    if(e.target.id==='sale' || e.target.id==='rent'){
        setFormData({
          ...formData, type:e.target.id,
        })
    }
    if(e.target.id==='offer' || e.target.id==='parkingSpot' || e.target.id==='furnished'){
      setFormData({
        ...formData, [e.target.id] : e.target.checked,
      })
    }
    if(e.target.type==='number' || e.target.type==='text' || e.target.type==='textarea'){
      setFormData({
        ...formData, [e.target.id]: e.target.value,
      })
    }
  };

  const handleSubmit = async(e)=>{
    e.preventDefault();
    try {
      if(formData.imageUrls.length<1) return ('you must upload atleast one image!'); 
      if(+formData.regularPrice<+formData.discountPrice) return setError('Discounted Price must be less than the regular price!');
      setLoading(true);
      setError(false);
      const res = await fetch(`/api/listing/update/${params.listingId}`,{
        method :'POST',
        headers:{
          'Content-Type':'application/json',
        },
        body:JSON.stringify(
          {
            ...formData,
            userRef: currentUser._id,
          }),
      })
      
      const data =await res.json();
      setLoading(false);
      if(data.success===false){
        setError(data.message);
      }
      navigate(`/listing/${params.listingId}`);

    } catch (error) {
        setError(error.message);
        setLoading(false);
    }
  }

  return (
    <main className="p-3 max-w-4xl mx-auto font-semibold gap-4">
      <h1 className="text-3xl font-semibold text-center my-7">
        Update listing 
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
        <div className="flex flex-col gap-3 flex-1">
          <input
            type="text"
            className="border p-3 rounded-lg "
            maxLength="100"
            minLength="10"
            placeholder="Name"
            id="name"
            required
            onChange={handleChange}
            value={formData.name}
          />
          <textarea
            className="border p-3 rounded-lg "
            placeholder="Description"
            id="description"
            required
            onChange={handleChange}
            value={formData.description}
          />
          <input
            type="text"
            className="border p-3 rounded-lg "
            maxLength="100"
            minLength="10"
            placeholder="Address"
            id="address"
            required
            onChange={handleChange}
            value={formData.address}
          />
          <div className="flex gap-5 mt-4 flex-wrap">
            <div className="flex gap-2">
              <input type="checkbox" id="sale" className="w-5" onChange={handleChange} checked={formData.type==='sale'}
            />
              <span>Sale</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="rent" className="w-5" onChange={handleChange} checked={formData.type==='rent'}/>
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="parkingSpot" className="w-5" onChange={handleChange} checked={formData.parkingSpot}/>
              <span>Parking Spot</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="furnished" className="w-5" onChange={handleChange} checked={formData.furnished}/>
              <span>Furnished</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="offer" className="w-5" onChange={handleChange} checked={formData.offer}/>
              <span>Offer</span>
            </div>
          </div>
          <div className="flex gap-5 flex-wrap">
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bedrooms"
                min="1"
                max="10"
                required
                className="rounded-lg border border-gray-300 p-3"
                onChange={handleChange} value={formData.bedrooms}
              />
              <p>Beds</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bathrooms"
                min="1"
                max="10"
                required
                className="rounded-lg border border-gray-300 p-3"
                onChange={handleChange} value={formData.bathrooms}
              />
              <p>Bathrooms</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="regularPrice"
                required
                className="rounded-lg border border-gray-300 p-3"
                onChange={handleChange} value={formData.regularPrice}
              />
              <div className="flex flex-col text-center">
                <p>Regular Price</p>
                {formData.type==='rent' && (
                  <p className="text-xs">($ / Month)</p>
                )}
              </div>
            </div>
            {formData.offer && (
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="discountPrice"
                required
                className="rounded-lg border border-gray-300 p-3"
                onChange={handleChange} value={formData.discountPrice}
              />
              <div className="flex flex-col text-center">
                <p>Discounted Price</p>
                {formData.type==='rent' && (
                  <p className="text-xs">($ / Month)</p>
                )}
              </div>
            </div>
            )}
          </div>
        </div>
        <div className="flex flex-col flex-1 gap-4 mb-4">
          <p>
            Images:
            <span className="font-normal text-gray-600 ml-2">
              The first image will be the cover (max 6)
            </span>
          </p>
          <div className="flex gap-4">
            <input
              onChange={(e) => setFiles(e.target.files)}
              type="file"
              id="images"
              accept="image/*"
              multiple
              className=" border p-3 rounded-lg w-full border-gray-300"
            />
            <button
              type="button"
              onClick={handleImageSubmit}
              className="border p-3 text-green-700 border-green-700 rounded uppercase"
            >
              {uploading ? 'Uplaoding...': 'Upload'}
            </button>
          </div>
          <p className="text-red-700 text-xs">{imageUploadError } </p>
          {
            formData.imageUrls.length>0 && formData.imageUrls.map((url,index)=>(
              <div key={url} className="flex items-center justify-between border rounded p-3">
                <img src={url} alt="listing-image" className="w-20 h-20 object-contain rounded-lg"/>
                <button className="text-red-700 hover:opacity-80 uppercase rounded-lg" onClick={()=>handleRemoveImage(index)}>Delete</button>
              </div>
            ))
          }
          <button disabled={loading || uploading} className="border bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-90 disabled:opacity-80">
            {loading ? 'updating...': 'update listing'}
          </button>
          <p className="text-red-700 text-sm ">{error}</p>
        </div>
      </form>
    </main>
  );
}
