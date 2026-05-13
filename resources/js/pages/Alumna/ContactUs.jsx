import React from 'react'
import { Mail, Phone, MapPin, Clock } from 'lucide-react'
import AlumnaLayout from "@/layouts/alumna-layout";
import contact from '../../assets/contact.jpg';
import ContactForm from '../../components/ContactForm';

export default function ContactUs({auth, userEmail, userName, coordinators, departments}) {
  return (
    <>
      <div className='flex flex-col w-full'>
        {/* header message */}
        <section className='relative h-[450px] overflow-hidden'>
          <img src={contact} className='absolute h-full w-full object-cover object-center'/>
          <div className='absolute inset-0 bg-black/60 backdrop-blur-[1px]'/>

          <div className='relative z-10 flex flex-col h-full items-center justify-center gap-3 '>
            <h1 className='text-white text-6xl'>Contact Us</h1>
            <p className='text-white text-md w-1/2 text-center'>
              Your feedback is a vital part of our developmental research. Whether you have questions about the tracer survey or suggestions for system improvements, your input helps us build a better bridge between our graduates and the institution.
            </p>
            
          </div>
        </section>

        {/* form */}
        <div className='flex justify-center items-center py-10'>
          <ContactForm 
            userEmail={userEmail} 
            userName={userName} 
            coordinators={coordinators}
            departments={departments}
            auth={auth}
          />
        </div>
      </div>
    </>
  )
}

ContactUs.layout = page => <AlumnaLayout>{page}</AlumnaLayout>