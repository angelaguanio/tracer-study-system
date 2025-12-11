import React from 'react'
import { Button } from '../../components/ui/button';
import { Link } from '@inertiajs/react';

export default function CoordinatorDashboard() {
  return (
    <>
    <div>CoordinatorDashboard</div>
    <Button asChild variant="red">
    <Link href={route('coordinator.logout')}>Logout</Link>

    <div>
      Sidebar
    </div>

    <div>
      Nav Bar
    </div>

    <div>
      Main Page
    </div>
    </Button>
  </>
  )
}
