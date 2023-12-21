import {useState} from 'react'
import {Link} from 'react-router-dom'

export default function About() {
  const [contact, setContact] = useState(false);
  const [message, setMessage] = useState(null);
  const onChange = (e) => {
    setMessage(e.target.value);
  };
  return (
    <>
      <h1 className='text-center text-lg text-slate-700 font-semibold underline mt-10'>About Us</h1>
      <div className='px-10 mt-3 text-sm font-normal text-gray-600'>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Officiis temporibus repudiandae iste voluptate dolor perferendis minima sequi, tempora beatae deserunt odio delectus. Sit debitis cum impedit sed autem deleniti, voluptate consequatur alias, doloribus ipsa eaque voluptatem. Veritatis reiciendis dolores tempore eveniet labore, nostrum earum magnam culpa ducimus repellendus non quis nisi quidem molestiae ratione id facere? Dolore ratione, repellat quos deleniti numquam voluptatibus autem velit molestias. Odit itaque ipsa doloremque doloribus dignissimos nostrum consectetur unde nemo dolor officiis corrupti alias repellat aperiam consequatur, inventore ullam, iusto natus placeat magnam. Quasi dolorem inventore rem qui distinctio blanditiis debitis quaerat iste laudantium. </p>
        <p className='hidden sm:block'>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsum soluta voluptatem amet, vitae repudiandae asperiores libero iure itaque dolorum! Expedita praesentium odio, ea reprehenderit eligendi non nostrum iure, ratione amet fugit sit? Nesciunt voluptates sint itaque ratione ab exercitationem natus quod adipisci voluptatem quibusdam totam suscipit qui, nobis hic aspernatur magnam praesentium saepe? Eligendi quia, eum blanditiis esse facere recusandae quisquam amet soluta quasi voluptate consequatur aspernatur error adipisci porro nihil maiores architecto debitis. Aliquam eligendi quia accusamus quas alias eius, veniam et repudiandae cumque officiis tempora, suscipit fugiat doloremque deleniti dolor rem odio atque cupiditate magni nostrum molestias optio. Facere explicabo atque minima. Recusandae eligendi et distinctio a ipsam ex aut quis accusamus nostrum!
        </p></div>
        <div className='p-10'>
        {!contact && (
          <button onClick={()=>setContact(true)} className="bg-slate-700 text-white w-full rounded-lg mt-5 uppercase hover:opacity-90 p-3">
            contact Us
          </button>
        )}
        {contact && (
          <div className="mt-3 w-full flex flex-col gap-2">
          <textarea
            className="w-full p-3 rounded-lg"
            maxLength="100"
            placeholder="Write a message for the Landlord..."
            value={message}
            onChange={onChange}
            rows={4}
          />
          <Link
            to={`mailto:singhpnand14@gmail.com?subject=Regarding MyEstate website 
            &body=${message}`}
            className="uppercase p-3 bg-slate-700 rounded-lg text-white text-center"
          >
            send message
          </Link>
        </div>
        )}
        </div>
        
    </>
    
  )
}
