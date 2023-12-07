import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";
import { FaBath, FaBed, FaChair, FaMapMarkerAlt, FaParking } from "react-icons/fa";

export default function Listing() {
  SwiperCore.use([Navigation]);
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const params = useParams();
  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/listing/get/${params.listingId}`);
        const data = await res.json();
        if (data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }
        setListing(data);
        setLoading(false);
        setError(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchListing();
  }, [params.listingId]);
  console.log(listing);

  return (
    <main>
      {loading && (
        <p className="text-center my-6 text-2xl font-semibold">Loading...</p>
      )}
      {error && (
        <p className="text-center my-6 text-2xl font-semibold">
          Something went Wrong!!
        </p>
      )}
      {listing && !error && !loading && (
        <>
          <div>
            <Swiper navigation>
              {listing.imageUrls.map((url) => (
                <SwiperSlide key={url}>
                  <div
                    className="h-[550px]"
                    style={{
                      background: `url(${url}) center no-repeat`,
                      backgroundSize: "cover",
                    }}
                  ></div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
          <div className="p-4 w-full sm:max-w-[1000px] m-auto">
            <h1 className="font-bold text-2xl">
              {listing.name} - ${listing.regularPrice}
            </h1>
            <div className="flex items-center gap-3 text-sm font-semibold mt-4">
              <FaMapMarkerAlt className="text-green-700 " />
              <span className="mb-1 text-slate-700">{listing.address}</span>
            </div>
            <div className="flex mt-3 gap-3 font-semibold">
              <p className="bg-red-900 w-full max-w-[200px] text-white text-center rounded-lg p-1">
                {listing.type === "rent" ? "For Rent" : "For Sale"}
              </p>
              {listing.offer && (
                <p className="bg-green-900 w-full max-w-[200px] text-white text-center rounded-lg p-1">
                  $ {listing.regularPrice - listing.discountPrice}
                </p>
              )}
            </div>
            <div className="flex mt-3">
              <p className="text-slate-800 font-semibold text-sm">
                <span className="object-cover font-bold text-black text-md">Details - </span>
                {listing.description}
              </p>
            </div>
            <div className="flex mt-3  text-green-800 font-semibold gap-5">
              <div className="flex items-center gap-1">
                <FaBed />
                <span>
                  {listing.bedrooms}
                  {(listing.bedrooms>1)?" Beds":" Bed"}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <FaBath />
                <span>
                  {listing.bathrooms}
                  {(listing.bathrooms>1)?" Baths":" Bath"}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <FaParking />
                <span>
                  {(listing.parking)?" Parking":" No Parking"}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <FaChair />
                <span>
                  {(listing.furnished)?" Furnished":" Not Frunished"}
                </span>
              </div>
            </div>
          </div>
        </>
      )}
    </main>
  );
}