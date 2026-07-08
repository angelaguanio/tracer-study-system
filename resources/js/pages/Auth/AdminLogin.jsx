import React, { useEffect } from 'react'
import AuthLayout from '../../layouts/auth-layout'
import { Card, CardHeader, CardContent} from "@/components/ui/card";
import { Button } from '../../components/ui/button';
import Wup from '../../components/wup'
import TextInput from '../../components/text-input'
import { useForm, Link } from '@inertiajs/react'
import { UserRound, Lock, ArrowLeft, Loader2 } from 'lucide-react';
import axios from 'axios';


export default function AdminLogin({sessionExpired,}) {
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

    post("/admin/login");
}

return (
  <AuthLayout>
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

      <CardContent className="px-6">
        <form className="space-y-3 sm:space-y-4" onSubmit={handleSubmit}>
          {errors.email && (
            <div className="mb-2 rounded bg-red-100 p-2 text-sm text-red-700 sm:text-base">
              {errors.email}
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
              type="submit"
              variant="blue"
              size="login2"
              disabled={processing}
              className="w-full h-11 text-sm sm:h-12 sm:text-base md:h-14"
          >
              {processing ? (
                  <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Logging in...
                  </>
              ) : (
                  "Login"
              )}
          </Button>
        </form>
      </CardContent>
    </Card>
  </AuthLayout>
)
}
