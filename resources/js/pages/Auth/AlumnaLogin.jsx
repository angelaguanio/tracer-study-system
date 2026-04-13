import React from 'react'
import { Card, CardHeader, CardTitle, CardAction, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from '../../components/ui/button';
import Wup from '../../components/wup';
import TextInput from '../../components/text-input';
import { useForm } from '@inertiajs/react';
import { UserRound, Lock } from 'lucide-react';
import TextLink from '../../components/text-link';
import AuthLayout from "@/layouts/auth-layout";
import { ArrowLeft } from "lucide-react";
import { Link } from "@inertiajs/react";





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
  <Card className="w-full max-w-md sm:max-w-lg px-4 py-6 sm:px-6 sm:py-8 md:px-10 md:py-10 max-h-[90vh] rounded-2xl bg-white shadow-lg">
    
    <CardHeader className="relative flex flex-col items-center justify-center">
       {/* Back Button */}
      <Link
        href={route('role.select')}
        className="absolute left-4 top-4 flex items-center justify-center h-9 w-9 rounded-full hover:bg-gray-100"
      >
        <ArrowLeft className="h-5 w-5 text-gray-700" />
      </Link>
      <Wup />
    </CardHeader>

    <CardContent>
      <form className="space-y-3 sm:space-y-4" onSubmit={handleSubmit}>
        
        {errors.credentials && (
          <div className="bg-red-100 text-red-700 p-2 rounded text-sm sm:text-base">
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
          className="pl-10 text-black border-gray-400 w-full text-sm sm:text-base"
        />

        <TextInput 
          name="password" 
          type="password"
          value={data.password} 
          placeholder="Password" 
          onChange={handleChange} 
          icon={Lock}
          className="pl-10 text-black border-gray-400 w-full text-sm sm:text-base"
        />

        <Button 
          variant="blue" 
          size="login2" 
          className="w-full h-11 sm:h-12 md:h-14 text-sm sm:text-base"
        >
          Login
        </Button>

      </form>
    </CardContent>

    <CardFooter className="flex flex-col sm:flex-row items-center justify-center gap-1 text-black text-sm sm:text-base text-center">
      <p>Don't have an account?</p> 
      <TextLink routeName="alumna.signup" linkName="Sign up Here"/>
    </CardFooter>

  </Card>
)
}


AlumnaLogin.layout = page => <AuthLayout>{page}</AuthLayout>