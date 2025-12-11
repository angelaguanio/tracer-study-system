import React from 'react'

import { Card, CardHeader,CardFooter } from "@/components/ui/card";

import Wup from '../../components/ui/wup'
import { Button } from '../../components/ui/button'
import { Link } from '@inertiajs/react'
import AuthLayout from '../../layouts/auth-layout'


export default function Login() {
  return (
    <AuthLayout>
      <Card className="py-10 w-xl">
        <CardHeader className="flex flex-col items-center justify-center">
          <Wup/>
        </CardHeader>
        <CardFooter className="flex flex-col space-y-4">
        <Button asChild variant="blue" size="login">
          <Link href={route('alumna.login')}>ALUMNA</Link>
        </Button>

        <Button asChild variant="blue" size="login">
          <Link href={route('coordinator.login')}>COORDINATOR</Link>
        </Button>
        </CardFooter>
      </Card>
    </AuthLayout>
  )
}
