import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase.js";
import {
  updateUserFailure,
  updateUserSuccess,
  updateUserStart,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutUserFailure,
  signOutUserStart,
  signOutUserSuccess,
} from "../redux/user/userSlice.js";
import { Link } from "react-router-dom";
import { createListing } from "../../../api/controllers/listing.controller.js";

export default function () {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setupdateSuccess] = useState(false);
  const [showListingsError, setshowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const [listingDeleteError, setListingDeleteError] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);
  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData({ ...formData, avatar: downloadURL });
        });
      }
    );
  };
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
      setupdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  const handleDeleteUser = async (e) => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };
  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch("/api/auth/signout");
      const data = await res.json();
      if (data.success === false) {
        dispatch(signOutUserFailure(data.message));
        return;
      }
      dispatch(signOutUserSuccess(data));
    } catch (error) {
      dispatch(signOutUserFailure(error.message));
    }
  };

  const handleShowListings = async (e) => {
    try {
      setshowListingsError(false);
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await res.json();
      if (data.success === false) {
        setshowListingsError(true);
        return;
      }
      setUserListings(data);
    } catch (error) {
      setshowListingsError(true);
    }
  };

  const handleListingDelete = async(listingId)=>{
    try {
      setListingDeleteError(false);
      const res = await fetch(`/api/listing/delete/${listingId}`,{
        method:'DELETE',
      });
      const data = await res.json();
      if(data.success === false){
        setListingDeleteError(data.message);
        return;
      }
      setUserListings((prev)=>{
        prev.filter((listing)=>listing._id!==listingId);
      })
    } catch (error) {
      setListingDeleteError(error.message);
    }
  }

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="font-semibold text-3xl mt-7 text-center">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          hidden
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          ref={fileRef}
          accept="image/*"
        />
        <img
          onClick={() => fileRef.current.click()}
          className="rounded-full h-24 w-24 object-cover self-center mt-3 cursor-pointer"
          src={formData.avatar || currentUser.avatar}
          alt="profile-img"
        />
        <p className="text-sm font-semibold self-center">
          {fileUploadError ? (
            <span className="text-red-600">Error uploading file!</span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span className="text-slate-600">Uploading {filePerc}%</span>
          ) : filePerc === 100 ? (
            <span className="text-green-600">
              Profile image successfully uploaded!
            </span>
          ) : (
            " "
          )}
        </p>
        <input
          type="text"
          placeholder="username"
          defaultValue={currentUser.username}
          className="border rounded-lg p-3 "
          onChange={handleChange}
          id="username"
        />
        <input
          type="email"
          placeholder="email"
          defaultValue={currentUser.email}
          className="border rounded-lg p-3 "
          onChange={handleChange}
          id="email"
        />
        <input
          type="password"
          placeholder="password"
          className="border rounded-lg p-3 "
          onChange={handleChange}
          id="password"
        />
        <button
          disabled={loading}
          className="uppercase bg-slate-700 p-3 rounded-lg text-white hover:opacity-95 disabled:opacity-85"
        >
          {loading ? "Updating..." : "Update"}
        </button>
        <Link
          to={"/create-listing"}
          className="uppercase bg-green-700 p-3 rounded-lg text-white text-center hover:opacity-95 disabled:opacity-85"
        >
          Create Listing
        </Link>
      </form>
      <div className="flex justify-between mt-5">
        <span
          onClick={handleDeleteUser}
          className="text-red-700 cursor-pointer"
        >
          Delete account
        </span>
        <span onClick={handleSignOut} className="text-red-700 cursor-pointer">
          Sign out
        </span>
      </div>
      <p className="text-red-700 mt5">{error ? error : " "}</p>
      <p className="text-green-700 mt5">
        {updateSuccess ? "User is updated successfully!" : " "}
      </p>
      <button
        onClick={handleShowListings}
        className="text-green-700 w-full hover:opacity-80"
      >
        Show Listings
      </button>
      <p className="text-red-700 text-sm mt-5">
        {showListingsError ? "Error showing listings" : ""}{" "}
      </p>
      {userListings &&
        userListings.length > 0 &&
        <div className="flex flex-col items-center gap-4">
            <h1 className="font-bold mt-4">Your Listings</h1>
            {userListings.map((listing) => (
            <div key={listing._id} className="flex border rounded p-3 items-center justify-between font-semibold w-full">
              <Link to={`/listing/${listing._id}`}>
                <img
                  src={listing.imageUrls[0]}
                  alt="listing cover"
                  className="h-16 w-16 object-contain"
                />
              </Link>
              <Link to={`/listing/${listing._id}`} className="truncated hover:underline flex-1 mx-4">
                 <p>{listing.name}</p> 
              </Link>
              <div className="flex flex-col items-center">
                <button onClick={()=>handleListingDelete(listing._id)} className="uppercase text-red-700 hover:opacity-80" >Delete</button>
                <Link to={`/update-listing/${listing._id}`}><button className="uppercase text-green-700 hover:opacity-80" >Edit</button>
                </Link>
              </div>
            </div>
            ))}
          </div>
        }
    </div>
  );
}
