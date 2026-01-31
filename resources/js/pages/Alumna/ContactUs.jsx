import React from 'react'
import { Mail, Phone, MapPin, Clock } from 'lucide-react'
import AlumnaLayout from "@/layouts/alumna-layout";

export default function ContactUs() {
  return (
    <>
      {/* HEADER */}
      <div className='flex flex-col w-full'>
        <div className="bg-blue-50 py-10 flex justify-center">
          <h1 className="text-4xl md:text-5xl font-bold text-blue-900">
            Contact Us
          </h1>
        </div>

        {/* CONTENT */}
        <div className="bg-blue-50 pb-16">
          <div className="max-w-6xl mx-auto px-6">

            {/* CARDS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">

              {/* EMAIL */}
              <div className="bg-white rounded-xl shadow p-8">
                <div className="bg-blue-100 w-12 h-12 flex items-center justify-center rounded-lg mb-4">
                  <Mail className="text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-1">Email</h3>
                <a
                  href="mailto:alumni@wesleyan.edu.ph"
                  className="text-blue-600 hover:underline"
                >
                  alumni@wesleyan.edu.ph
                </a>
                <p className="text-sm text-gray-500 mt-2">Send us a message</p>
              </div>

              {/* ADDRESS */}
              <div className="bg-white rounded-xl shadow p-8">
                <div className="bg-blue-100 w-12 h-12 flex items-center justify-center rounded-lg mb-4">
                  <MapPin className="text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-1">Address</h3>
                <p className="text-blue-600">Mabini Extension Cabanatuan City</p>
                <p className="text-sm text-gray-500 mt-2">Visit us in person</p>
              </div>

              {/* PHONE */}
              <div className="bg-white rounded-xl shadow p-8">
                <div className="bg-blue-100 w-12 h-12 flex items-center justify-center rounded-lg mb-4">
                  <Phone className="text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-1">Phone</h3>
                <p className="text-blue-600">(044) 960-7110 to 14 local 109</p>
                <p className="text-sm text-gray-500 mt-2">Call us during office hours</p>
              </div>

              {/* OFFICE HOURS */}
              <div className="bg-white rounded-xl shadow p-8">
                <div className="bg-blue-100 w-12 h-12 flex items-center justify-center rounded-lg mb-4">
                  <Clock className="text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-1">Office Hours</h3>
                <p className="text-blue-600">Monday – Friday: 8:00 AM – 5:00 PM</p>
                <p className="text-sm text-gray-500 mt-2">Saturday – Sunday: Closed</p>
              </div>

            </div>

            {/* BOX */}
            <div className="bg-blue-100 rounded-xl text-center py-10 px-6 w-full md:w-2/3 mx-auto">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Prefer Email?</h2>
              <p className="text-gray-700 mb-1">
                You can reach us at{' '}
                <a
                  href="mailto:alumni@wesleyan.edu.ph"
                  className="text-blue-600 font-medium hover:underline"
                >
                  alumni@wesleyan.edu.ph
                </a>
              </p>
              <p className="text-sm text-gray-500">
                We typically respond within 24 business hours
              </p>
            </div>

          </div>
        </div>
      </div>
    </>
  )
}

ContactUs.layout = page => <AlumnaLayout>{page}</AlumnaLayout>