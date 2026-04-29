import React from 'react'
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from '@/components/ui/card';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { useForm } from '@inertiajs/react';
import { toast } from 'sonner';


export default function ContactForm({auth, userEmail, userName, coordinators, departments}) {

  const {data, setData, post, processing, errors, reset} = useForm({
    title: '',
    department: '',
    alumni_coord: '',
    message: '',

    email: userEmail,
    name: userName

  })

  const filteredCoordinators = data.department && data.department !== 'admin'
    ? coordinators.filter(coord => coord.department === data.department)
    : [];

  function handleChange(e) {
    const {name, value} = e.target
    setData (name, value)
    
  }

  function handleSubmit(e) {
    e.preventDefault();

    post(route('alumna.contact.store'), {
        onSuccess: () => {
            toast.success('Message sent successfully!', {
              description: 'We will get back to you as soon as possible.'
            });
            reset('message', 'department', 'alumni_coord', 'title');
        },
        onError: (errors) => {
            toast.error('Failed to send message', {
              description: 'Please check the form and try again.'
            });
            console.error('Form errors:', errors);
        }
    });
  }

  const titleItems = [
    {
      value: 'Mr.',
      label: 'Mr.' 
    },
    {
      value: 'Mrs.',
      label: 'Mrs.' 
    },
    {
      value: 'Ms.',
      label: 'Ms.' 
    },
    {
      value: 'Miss',
      label: 'Miss' 
    }
  ]

  console.log("Selected Department:", data.department);
  console.log("Auth User Dept:", auth?.user?.department);
  console.log("All Coordinators:", coordinators);
  console.log("Filtered Coordinators:", filteredCoordinators);
  return (
    <Card className='w-1/2 px-4 shadow-xl'>
        <CardHeader>
            <div className='flex flex-col items-center justify-center py-4'>
                <h1 className='text-2xl'>Send us a Message</h1>
                <p>Fill out the form below and we will get back to you as soon as possible.</p>
            </div>
        </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent>

          <div className='flex flex-col w-full py-3 px-4 bg-blue-200/20 rounded-2xl border border-blue-300'>
            <div className='flex w-full justify-between'>
              <div className='flex'>
                <Select onValueChange={(value) => setData('title', value)}>
                    <SelectTrigger className=" text-black border-gray-400 text-sm bg-white">
                      <SelectValue placeholder="Select Title" />
                    </SelectTrigger>
                    <SelectContent className="max-h-48" >
                      <SelectGroup >
                        {titleItems.map((title) => (
                          <SelectItem key={title.value} value={title.value} >
                            {title.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>

                {/* user details */}
                <div className='flex flex-col gap-2 py-1.5 px-3'>
                  <h1 className='text-md'>{userName}</h1>
                  <p className='text-sm text-gray-500'>{userEmail}</p>
                </div>
            </div>
            <h1 className='px-2 py-1 text-sm text-blue-500'>Logged in</h1>
          </div>
          </div>

          
            <div className='flex flex-row gap-3 w-full justify-around py-4'>

              {/* department */}
              <div className='flex flex-col gap-3 w-1/2 px-3 py-2'>
              <Label>Department</Label>
                <Select onValueChange={(value) => setData('department', value)}>
                  <SelectTrigger className="w-full text-black border-gray-400 text-sm bg-white">
                    <SelectValue placeholder="Select Department" />
                  </SelectTrigger>
                  <SelectContent className="max-h-48" >
                    <SelectGroup >
                        <SelectItem value='admin'>Alumni Office</SelectItem>
                        {departments && departments.map((dept) => (
                          <SelectItem key={dept} value={dept}>
                            {dept} Department
                          </SelectItem>
                        ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                </div>

              
              {/* coord */}
              <div className='flex flex-col gap-3 w-1/2 px-3 py-2'>
              <Label>Alumni Coordinator</Label>
                <Select 
                  onValueChange={(val) => setData('alumni_coord', val)}
                  disabled={!data.department || data.department === 'admin'}
                  value={data.department === 'admin' ? '' : data.alumni_coord}
                >
                  <SelectTrigger className="w-full text-black border-gray-400 text-sm bg-white">
                    <SelectValue placeholder={
                      !data.department 
                        ? "Select department first" 
                        : data.department === 'admin'
                          ? "Not applicable for Alumni Office"
                          : filteredCoordinators.length === 0 
                            ? "No coordinators available"
                            : "Send to"
                    } />
                  </SelectTrigger>
                  <SelectContent className="max-h-48" >
                    <SelectGroup >
                       {filteredCoordinators.length > 0 ? (
                         filteredCoordinators.map((coord)=> (
                            <SelectItem key={coord.id} value={coord.id.toString()}>
                              {coord.first_name} {coord.last_name} ({coord.department} Coordinator)
                            </SelectItem>
                          ))
                       ) : (
                         <div className="px-2 py-1.5 text-sm text-gray-500">
                           No coordinators available
                         </div>
                       )}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                </div>
              </div>

              <div className='flex flex-col gap-3 px-3 py-4 h-50'>
                <Label>Your Message</Label>
                <Textarea 
                  className='px-3 border border-gray-400 h-full' 
                  placeholder="Tell us how we can help you..."
                  name="message"
                  value={data.message}
                  onChange={handleChange}
                />
              </div>
          
        </CardContent>

        <CardFooter className='py-4'>
          <Button type='submit' size='login2' variant='blue' disabled={processing}>Submit</Button>
        </CardFooter>
        </form>
    </Card>
  )
}
