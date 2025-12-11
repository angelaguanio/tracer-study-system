

import React from 'react'
import { Button } from '../../components/ui/button';
import { Link } from '@inertiajs/react';



export default function AlumnaHome() {
  return (
    <>
    <div>AlumnaHome</div>
    <Button asChild variant="red">
      <Link href={route('alumna.logout')}>Logout</Link>
    </Button>

  </>
  )
}
