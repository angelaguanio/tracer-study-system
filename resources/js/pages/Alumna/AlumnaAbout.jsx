import React from 'react'
import graduationBg from '../../assets/graduation-bg.jpg'
import AlumnaLayout from '../../layouts/alumna-layout';


export default function AlumnaAbout() {
  return (
    <div className="flex flex-col w-full">
     
      {/* Header */}
      <section className="bg-gradient-to-r from-blue-600 to-teal-500 text-white py-12 sm:py-16 md:py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4">
            CECT Alumni Tracer
          </h1>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-4 sm:mb-6">
            Study and Updates Portal
          </h2>
          <p className="text-base sm:text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            Strengthening connections between the College of Engineering and Computer
            Technology and its graduates from Mindanao University, Philippines
          </p>
        </div>
      </section>

      {/* Welcome Section */}
      <section className="bg-white py-12 sm:py-14 md:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-6">
            Welcome to Alumni Connect
          </h2>
          <p className="text-gray-700 mb-3 sm:mb-4 leading-relaxed text-sm sm:text-base">
            The Alumni Connect is a system that serves as a hub for alumni connections, information updates, and data
            collection. It helps the college to evaluate how well its academic training programs students for
            employment and identify areas for improvement.
          </p>
          <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
            Through this portal, alumni can update their employment details, share achievements, and take part in the
            Graduate Tracer Study, which tracks the employability and career growth of CECT graduates.
          </p>
        </div>
      </section>

      {/* Our Purpose Section */}
      <section 
        className="py-12 sm:py-14 md:py-16 px-4 sm:px-6 lg:px-8 relative bg-cover bg-center"
        style={{
          backgroundImage: `url(${graduationBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black opacity-60"></div>
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-8 sm:mb-10 md:mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white">Our Purpose</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
            {/* Purpose Card 1 */}
            <div className="bg-blue-100 rounded-lg p-5 sm:p-6 shadow-md hover:shadow-xl transition-shadow">
              <h3 className="font-bold text-gray-800 mb-2 text-base sm:text-lg">Connect Alumni</h3>
              <p className="text-gray-700 text-xs sm:text-sm leading-relaxed">
                Maintain an active connection between the college and its alumni community.
              </p>
            </div>

            {/* Purpose Card 2 */}
            <div className="bg-blue-100 rounded-lg p-5 sm:p-6 shadow-md hover:shadow-xl transition-shadow">
              <h3 className="font-bold text-gray-800 mb-2 text-base sm:text-lg">Track Career Growth</h3>
              <p className="text-gray-700 text-xs sm:text-sm leading-relaxed">
                Gather relevant data on graduates' employment, educational, and industry experience.
              </p>
            </div>

            {/* Purpose Card 3 */}
            <div className="bg-blue-100 rounded-lg p-5 sm:p-6 shadow-md hover:shadow-xl transition-shadow">
              <h3 className="font-bold text-gray-800 mb-2 text-base sm:text-lg">Curriculum Development</h3>
              <p className="text-gray-700 text-xs sm:text-sm leading-relaxed">
                Support curriculum development by aligning academic outcomes with real-world demands.
              </p>
            </div>

            {/* Purpose Card 4 */}
            <div className="bg-blue-100 rounded-lg p-5 sm:p-6 shadow-md hover:shadow-xl transition-shadow">
              <h3 className="font-bold text-gray-800 mb-2 text-base sm:text-lg">Alumni Engagement</h3>
              <p className="text-gray-700 text-xs sm:text-sm leading-relaxed">
                Provide alumni with news, events, and opportunities for continued collaboration with the institution.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why It Matters Section */}
      <section className="bg-blue-50 py-12 sm:py-14 md:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-6">
            Why It Matters
          </h2>
          <p className="text-gray-700 mb-3 sm:mb-4 leading-relaxed text-sm sm:text-base">
            The information gathered through the tracer study plays a vital role in shaping the future of CECT
            programs. It allows the college to evaluate how well its academic training programs students for
            professional success and identify areas for improvement in teaching, curriculum design,
            and career development services.
          </p>
          <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
            By staying connected, alumni contribute directly to the growth and excellence of future CECT
            graduates.
          </p>
        </div>
      </section>
    </div>
  )
}

AlumnaAbout.layout = (page) => (
  <AlumnaLayout>{page}</AlumnaLayout>
);