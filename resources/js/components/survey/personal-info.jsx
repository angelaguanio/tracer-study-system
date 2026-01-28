import React from 'react'
import { Card, CardHeader, CardTitle, CardAction, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { User } from 'lucide-react';

export default function PersonalInformationSurvey() {
  return (
    
    <Card>
        <CardHeader>
            <CardTitle >
              <div className='flex items-center gap-3'>
                <User/>
                <h1>Personal Information</h1>
              </div>
            </CardTitle>
            <CardDescription></CardDescription>
        </CardHeader>
    </Card>
  )
}
