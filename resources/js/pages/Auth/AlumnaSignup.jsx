import { useForm } from '@inertiajs/react';
import React from 'react';
import { Card, CardHeader, CardTitle, CardAction, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import TextInput from '../../components/text-input';
import { Button } from '../../components/ui/button';
import Wup from '../../components/wup';
import TextLink from '../../components/text-link';
import AuthLayout from "@/layouts/auth-layout";
import logo from "../../assets/logotracer.png"


export default function AlumnaSignup() {

  //form
  const {data, setData, post, errors, processing} = useForm({
    last_name: "",
    first_name: "",
    middle_name: "",
    email: "",
    password: "",
    password_confirmation: "",
    courses: "",
    year_graduated: "",
    user_role: ""
  });

  
  //form change value
  function handleChange(e) {
    const { name, value} = e.target;
    setData(name, value);
  }
  
  //submit
  const handleSubmit = (e) => {
    e.preventDefault();
  
    post('/alumna/signup', {
      // forceFormData: true, //file upload
      onSuccess: () => {
        console.log('Form submitted successfully');
      },
      onError: (errors) => {
        console.log('Validation errors:', errors);
      }
    });
  };
  
  const startYear = 2000;
  const currentYear = new Date().getFullYear();

  return (
        <Card className="py-10 px-12 w-xl max-h-[90vh] rounded-2xl">
          <CardHeader className="flex flex-col items-center justify-center">
            <img src={logo} className='h-22'/>
            <p className='font-bruno text-lg'>Alumni Connect</p>
          </CardHeader>

          <CardContent className="overflow-y-auto p-4 custom-scrollbar">
           
            <form className="space-y-2" onSubmit={handleSubmit}>
              {/* name field */}
              <div className='flex flex-row justify-evenly w-full gap-2'>
                <TextInput
                  name="last_name" 
                  type="text" 
                  value={data.last_name} 
                  placeholder="Lastname" 
                  onChange={handleChange} 
                  error={errors.last_name} 
                />

                <TextInput
                  name="first_name" 
                  type="text" 
                  value={data.first_name} 
                  placeholder="Firstname" 
                  onChange={handleChange} 
                  error={errors.first_name} 
                />

                <TextInput
                  name="middle_name" 
                  type="text" 
                  value={data.middle_name} 
                  placeholder="Middlename" 
                  onChange={handleChange} 
                  error={errors.middle_name} 
                />
              </div>

              {/* email field */}
              <TextInput
                name="email" 
                type="email" 
                value={data.email} 
                placeholder="Email Address" 
                onChange={handleChange} 
                error={errors.email} 
              />

              {/* pass field */}
              <TextInput 
                name="password" 
                type="password" 
                placeholder="Password" 
                onChange={handleChange} 
                error={errors.password} 
              />

              {/* pass confirm field */}
              <TextInput 
                name="password_confirmation" 
                type="password" placeholder="Confirm Password" 
                onChange={handleChange} 
                error={errors.password_confirmation}
              />

              {/* year dropdown */}
              <Select onValueChange={(value) => setData("year_graduated", value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Year Graduated"/>
                </SelectTrigger>

                <SelectContent className="max-h-48">
                  <SelectGroup>
                    {Array.from(
                      { length: currentYear - startYear + 1 },
                      (_, i) => {
                        const year = currentYear - i;
                        return (
                          <SelectItem key={year} value={year.toString()}>
                            {year}
                          </SelectItem>
                        );
                      }
                    )}
                  </SelectGroup>
                </SelectContent>
              </Select>

              {/* courses dropdown */}
              <Select onValueChange={(value) => setData("courses", value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Course"/>
                </SelectTrigger>

                <SelectContent className="max-h-48">
                  <SelectGroup>
                    <SelectItem value="BSCpE">Bachelor of Science in Computer Engineering</SelectItem>
                    <SelectItem value="BSECE">Bachelor of Science in Electronics Engineering</SelectItem>
                    <SelectItem value="BSIT">Bachelor of Science in Information Technology</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>

              <Button variant="blue" type="submit" size="login2" disabled={processing}>Sign Up</Button>
            </form>
            
          </CardContent>

          <CardFooter className="flex flex-row items-center justify-center gap-1 w-full">
            <p>Already have an account?</p> 
            <TextLink routeName="alumna.login" linkName="Login Here" className="text-blue-600"/>
          </CardFooter>

      </Card>
  )
}


AlumnaSignup.layout = page => <AuthLayout>{page}</AuthLayout>