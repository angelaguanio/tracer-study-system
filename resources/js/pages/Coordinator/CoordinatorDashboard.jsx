import React from 'react'
import { Button } from '../../components/ui/button';
import { Link } from '@inertiajs/react';
import CoordinatorLayout from "@/layouts/coord-layout";


export default function CoordinatorDashboard() {
  return (
    
    <div>
      CoordinatorDashboard
    </div>
  
  )
}

CoordinatorDashboard.layout = page => <CoordinatorLayout>{page}</CoordinatorLayout>
