import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Contact({ listing }) {
  const [landlord, setLandlord] = useState(null);
  const [error, setError] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const fetchLandlord = async () => {
      try {
        const res = await fetch(`/api/user/${listing.userRef}`);
        const data = await res.json();
        setLandlord(data);
        setError(false);
      } catch (error) {
        setError(true);
      }
    };
    fetchLandlord();
  }, [listing.userRef]);

  const onChange = (e) => {
    setMessage(e.target.value);
  };

  return (
    <>
      <div className="mt-3 w-full flex flex-col gap-2">
        <p>
          Contact{" "}
          <span className="font-semibold">{landlord && landlord.username}</span>{" "}
          for <span className="font-semibold">{listing.name}</span>
        </p>
        <textarea
          className="w-full p-3 rounded-lg"
          maxLength="100"
          placeholder="Write a message for the Landlord..."
          value={message}
          onChange={onChange}
        />
        <Link
          to={`mailto:${landlord && landlord.email}?subject=Regarding 
          ${listing.name} 
          &body=${message}`}
          className="uppercase p-3 bg-slate-700 rounded-lg text-white text-center"
        >
          send message
        </Link>
      </div>
    </>
  );
}
