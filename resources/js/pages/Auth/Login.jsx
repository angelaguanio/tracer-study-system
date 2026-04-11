import React from 'react'

import { Card, CardHeader,CardFooter } from "@/components/ui/card";

import Wup from '../../components/wup'
import { Button } from '../../components/ui/button'
import { Link } from '@inertiajs/react'
import AuthLayout from "@/layouts/auth-layout";



export default function Login() {
  return (
    <Card className="w-full max-w-lg py-6 px-4 sm:py-8 sm:px-6 md:py-10 md:px-8 bg-white rounded-2xl shadow-lg">
      
      <CardHeader className="flex flex-col items-center justify-center">
        <Wup />
      </CardHeader>

      <CardFooter className="flex flex-col space-y-3 sm:space-y-4 mt-4">
        <Button asChild variant="blue" size="login" className="w-full">
          <Link href={route('alumna.login')}>ALUMNA</Link>
        </Button>

        <Button asChild variant="blue" size="login" className="w-full">
          <Link href={route('coordinator.login')}>COORDINATOR</Link>
        </Button>
      </CardFooter>

    </Card>
  );
}

Login.layout = page => <AuthLayout>{page}</AuthLayout>
