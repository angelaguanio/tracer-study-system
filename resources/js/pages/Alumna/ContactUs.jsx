import { Mail, Phone, MapPin, Clock } from 'lucide-react'
import AlumnaLayout from "@/layouts/alumna-layout";
import contact from '../../assets/contact.jpg';
import ContactForm from '../../components/ContactForm';

export default function ContactUs({auth, userEmail, userName, coordinators, departments}) {
  return (
    <div className='flex flex-col w-full min-h-screen bg-gradient-to-b from-gray-50 to-white'>
      {/* header message */}
      <section className='relative h-[500px] overflow-hidden'>
        <img src={contact} className='absolute h-full w-full object-cover object-center'/>
        <div className='absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/50'/>

        <div className='relative z-10 flex flex-col h-full items-center justify-center gap-6 px-4'>
          <h1 className='text-white text-7xl font-bold tracking-tight drop-shadow-2xl'>Contact Us</h1>
          <p className='text-white text-lg w-full max-w-3xl text-center leading-relaxed drop-shadow-lg font-light'>
            Your feedback is a vital part of our developmental research. Whether you have questions about the tracer survey or suggestions for improvements, your input helps us build a better bridge between our graduates and the institution.
          </p>
        </div>
      </section>

      {/* form */}
      <div className='flex justify-center items-center py-16 px-4'>
        <ContactForm 
          userEmail={userEmail} 
          userName={userName} 
          coordinators={coordinators}
          departments={departments}
          auth={auth}
        />
      </div>
    </div>
  )
}

ContactUs.layout = page => <AlumnaLayout>{page}</AlumnaLayout>