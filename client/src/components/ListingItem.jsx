import { Link } from "react-router-dom";
import { FaMapMarkerAlt } from "react-icons/fa";
import { list } from "firebase/storage";

export default function ListingItem({ listing }) {
  return (
    <div className="bg-white overflow-hidden rounded-lg shadow hover:shadow-lg transition-shadow duration-3000 w-full sm:w-[300px]">
      <Link to={`/listing/${listing._id}`}>
        <img
          src={listing.imageUrls[0]}
          alt="Listing cover"
          className="h-[320px] sm:h-[220px] w-full object-cover hover:scale-105 transition-scale duration-300 "
        />
        <div className="p-3 flex flex-col gap-2 w-full">
          <p className="truncate font-semibold text-lg text-slate-700">
            {listing.name}
          </p>

          <div className="flex items-center gap-1 text-sm font-normal ">
            <FaMapMarkerAlt className="h-4 w-4 text-green-700" />
            <p className="truncate text-gray-600 font-semibold">
              {listing.address}
            </p>
          </div>
          <p className="text-sm text-gray-600 font-semibold line-clamp-2">
            {listing.description}{" "}
          </p>

          <p className="font-bold text-slate-600 text-lg">
            {`$`}
            {listing.offer
              ? listing.discountPrice.toLocaleString("en-US")
              : listing.regularPrice.toLocaleString("en-US")}
            <span>{listing.type === "rent" ? " / month" : ""}</span>
          </p>
          <div className="flex gap-5 font-bold text-sm text-gray-600">
            <div>
              <span>{listing.bedrooms}</span>
              <span>{listing.bedrooms > 1 ? " beds" : " bed"}</span>
            </div>
            <div>
              <span>{listing.bathrooms}</span>
              <span>{listing.bathrooms > 1 ? " baths" : " bath"}</span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
