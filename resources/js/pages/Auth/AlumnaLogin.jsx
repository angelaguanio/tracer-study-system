import React, { useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardAction, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from '../../components/ui/button';
import Wup from '../../components/wup';
import TextInput from '../../components/text-input';
import { useForm } from '@inertiajs/react';
import TextLink from '../../components/text-link';
import AuthLayout from "@/layouts/auth-layout";
import { UserRound, Lock, Loader2, ArrowLeft } from 'lucide-react';
import { Link } from "@inertiajs/react";
import axios from 'axios';



export default function AlumnaLogin({ status, sessionExpired, }) {

  //form
  const { data, setData, post, processing, errors } = useForm({
    email: "",
    password: "",
  });

  // Ensure fresh CSRF token on mount
  useEffect(() => {
    const csrfToken = document.head.querySelector('meta[name="csrf-token"]');
    if (csrfToken) {
      axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken.content;
    }
  }, []);

  //form change
  function handleChange(e) {
    const {name, value} = e.target
    setData (name, value)
    
  }

  //submit
  function handleSubmit(e) {
    e.preventDefault();
    if (processing) return;

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
    <>
    {/* expired session */}
    {sessionExpired && (
        <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
            <h3 className="font-semibold text-blue-800">
                Session Expired
            </h3>

            <p className="mt-1 text-sm text-blue-700">
                Your session expired due to inactivity.
                Please log in again.
            </p>
        </div>
    )}
    
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
        
        {status && (
          <div className="bg-green-100 text-green-700 p-2 rounded text-sm sm:text-base">
            {status}
          </div>
        )}

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
        <div className='text-end text-[12px] -mt-2 underline'>
          <Link href={route('alumna.forgot-password')} >Forgot Password?</Link>
        </div>
        <Button
          type="submit"
          variant="blue" 
          size="login2" 
          disabled={processing}
          className="w-full h-11 sm:h-12 md:h-14 text-sm sm:text-base"
        >
          {processing ? (
              <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Logging in...
              </>
          ) : (
              "Login"
          )}
        </Button>

      </form>
    </CardContent>

    <CardFooter className="flex flex-col items-center justify-center gap-1 text-black text-sm sm:text-base text-center">
      
      <div className='flex flex-row gap-1 text-sm'>
        <p>Don't have an account?</p> 
        <TextLink routeName="alumna.signup" linkName="Sign up Here"/>
      </div>
      
      
    </CardFooter>

  </Card>
  </>
)
}


AlumnaLogin.layout = page => <AuthLayout>{page}</AuthLayout>