import React from 'react'
import AuthLayout from '../../layouts/auth-layout'
import { Card, CardHeader, CardTitle, CardAction, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from '../../components/ui/button';
import Wup from '../../components/ui/wup';
import TextInput from '../../components/text-input'
import { useForm } from '@inertiajs/react'
import { UserRound, Lock } from 'lucide-react';
import TextLink from '../../components/text-link';




export default function AlumnaLogin() {

  //form
  const { data, setData, post, processing, errors } = useForm({
    email: "",
    password: "",
  });

  //form change
  function handleChange(e) {
    const {name, value} = e.target
    setData (name, value)
    
  }

  //submit
  function handleSubmit(e) {
    e.preventDefault();

    //alerts user to input all fields
    if (!data.email || !data.password) {
      alert("Please fill in all fields");
      return;
  }
    post("/alumna/login", {
      onError: (err) => console.log("Errors:", err),
      onSuccess: () => console.log("Login successful"),
    });
  }

  return (
    <AuthLayout>
       <Card className="py-10 px-12 w-xl max-h-[90vh] rounded-2xl">
        <CardHeader className="flex flex-col items-center justify-center">
          <Wup/>
        </CardHeader>

        <CardContent>
          <form className='space-y-3' onSubmit={handleSubmit}>

          {errors.credentials && (
            <div className="bg-red-100 text-red-700 p-2 rounded mb-4">
              {errors.credentials}
            </div>
          )}

          <TextInput 
            name="email" 
            type="email"
            value={data.email} 
            placeholder="Email Address" 
            onChange={handleChange}  
            icon={UserRound}
            className="pl-10"
          />

          <TextInput 
            name="password" 
            type="password"
            value={data.password} 
            placeholder="Password" 
            onChange={handleChange} 
            icon={Lock}
            className="pl-10"
          />
            

          <Button variant="blue" size="login2">Login</Button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-row items-center justify-center gap-1 w-full">
          <p>Don't have an account?</p> 
          <TextLink routeName="alumna.signup" linkName="Sign up Here"/>
        </CardFooter>
      </Card>
    </AuthLayout>
  )
}
