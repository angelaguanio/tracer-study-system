import { Mail, Phone, MapPin, Clock } from 'lucide-react'
import AlumnaLayout from "@/layouts/alumna-layout";
import contact from '../../assets/contact.jpg';
import ContactForm from '../../components/ContactForm';
import { Card, CardContent } from '@/components/ui/card';

const contactInfo = [
  {
    id: 'email',
    icon: Mail,
    title: 'Email',
    content: 'alumni@wesleyan.edu.ph',
    description: 'Send us a message',
    href: 'mailto:alumni@wesleyan.edu.ph',
    isLink: true
  },
  {
    id: 'address',
    icon: MapPin,
    title: 'Address',
    content: 'Mabini Extension Cabanatuan City',
    description: 'Visit us in person',
    isLink: false
  },
  {
    id: 'phone',
    icon: Phone,
    title: 'Phone',
    content: '(044) 960-7110 to 14 local 109',
    description: 'Call us during office hours',
    href: 'tel:044-960-7110',
    isLink: true
  },
  {
    id: 'hours',
    icon: Clock,
    title: 'Office Hours',
    content: 'Monday – Friday: 8:00 AM - 5:00 PM',
    description: 'Saturday - Sunday: Closed',
    isLink: false
  }
];

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

      {/* Contact Information Cards */}
      <div className='py-16 px-4 bg-gradient-to-r from-[#4284DB] to-[#29EAC4]'>
        <div className='max-w-7xl mx-auto'>
          <div className='text-center mb-12'>
            <h2 className='text-4xl font-bold text-white mb-4'>Get in Touch</h2>
            <p className='text-lg text-white max-w-2xl mx-auto'>
              Need help with records, events, or alumni concerns? Reach out through any of the channels below.
            </p>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
            {contactInfo.map((item) => {
              const Icon = item.icon;
              return (
                <Card key={item.id} className='hover:shadow-lg transition-shadow'>
                  <CardContent className='flex flex-col items-center text-center p-6'>
                    <div className='bg-blue-100 p-3 rounded-full mb-4'>
                      <Icon className='w-6 h-6 text-blue-600' />
                    </div>
                    <h3 className='text-lg font-semibold text-gray-900 mb-2'>{item.title}</h3>
                    {item.isLink ? (
                      <a href={item.href} className='text-blue-600 hover:underline mb-1'>
                        {item.content}
                      </a>
                    ) : (
                      <p className='text-blue-600 mb-1'>{item.content}</p>
                    )}
                    <p className='text-sm text-gray-500'>{item.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

ContactUs.layout = page => <AlumnaLayout>{page}</AlumnaLayout>