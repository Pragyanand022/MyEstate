import { useState } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";

export default function CreateListing() {
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
  });
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);

  console.log(formData);
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
          console.log(`file is ${progress}% uploaded`);
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
  }
  return (
    <main className="p-3 max-w-4xl mx-auto font-semibold gap-4">
      <h1 className="text-3xl font-semibold text-center my-7">
        Create a listing
      </h1>
      <form className="flex flex-col sm:flex-row gap-4">
        <div className="flex flex-col gap-3 flex-1">
          <input
            type="text"
            className="border p-3 rounded-lg "
            maxLength="30"
            minLength="10"
            placeholder="Name"
            id="name"
            required
          />
          <textarea
            className="border p-3 rounded-lg "
            placeholder="Description"
            id="description"
            required
          />
          <input
            type="text"
            className="border p-3 rounded-lg "
            maxLength="30"
            minLength="10"
            placeholder="Address"
            id="address"
            required
          />
          <div className="flex gap-5 mt-4 flex-wrap">
            <div className="flex gap-2">
              <input type="checkbox" id="sell" className="w-5" />
              <span>Sell</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="rent" className="w-5" />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="parkingSpot" className="w-5" />
              <span>Parking Spot</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="furnished" className="w-5" />
              <span>Furnished</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="offer" className="w-5" />
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
                defaultValue="1"
                required
                className="rounded-lg border border-gray-300 p-3"
              />
              <p>Beds</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bathrooms"
                min="1"
                max="10"
                defaultValue="1"
                required
                className="rounded-lg border border-gray-300 p-3"
              />
              <p>Bathrooms</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="regularPrice"
                defaultValue="0"
                required
                className="rounded-lg border border-gray-300 p-3"
              />
              <div className="flex flex-col text-center">
                <p>Regular Price</p>
                <p className="text-xs">($ / Month)</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="regularPrice"
                defaultValue="0"
                required
                className="rounded-lg border border-gray-300 p-3"
              />
              <div className="flex flex-col text-center">
                <p>Regular Price</p>
                <p className="text-xs">($ / Month)</p>
              </div>
            </div>
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
          <p className="text-red-700 text-xs">{imageUploadError && imageUploadError} </p>
          {
            formData.imageUrls.length>0 && formData.imageUrls.map((url,index)=>(
              <div key={url} className="flex items-center justify-between border rounded p-3">
                <img src={url} alt="listing-image" className="w-20 h-20 object-contain rounded-lg"/>
                <button className="text-red-700 hover:opacity-80 uppercase rounded-lg" onClick={()=>handleRemoveImage(index)}>Delete</button>
              </div>
            ))
          }
          <button className="border bg-slate-700 text-white p-3 rounded-lg uppercase">
            Create Listing
          </button>
        </div>
      </form>
    </main>
  );
}
