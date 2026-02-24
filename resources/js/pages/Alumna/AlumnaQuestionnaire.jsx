import React from 'react'
import PersonalInformationSurvey from '../../components/survey/personal-info'

import { Card, CardHeader, CardTitle, CardAction, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import AlumnaLayout from "@/layouts/alumna-layout";
import { CircleCheck, SparkleIcon } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Link } from '@inertiajs/react';


export default function AlumnaQuestionnaire() {
  return (
      <Card className="w-full max-w-xl overflow-hidden shadow-2xl rounded-3xl p-0 gap-2">
        <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-400 p-8 text-white space-y-4">
            <div className='space-y-4'>
              <div className='flex flex-row gap-2'>
                <SparkleIcon/>
                <span className='text-sm'>HELP SHAPE OUR FUTURE</span>
              </div>

              <div>
                <h1 className='text-3xl'>Your Voice Matters</h1>
                <p>Share you post-graduation experience</p>
              </div>
            </div>
        </CardHeader>

        <CardContent className="flex flex-col px-10 py-5 gap-5">
          <div className='space-y-3'>
            <p>Help us improve our programs by sharing your post-graduation experience. 
              Your feedback is invaluable for future students and curriculum development.
            </p>
            <p className='text-[13px] text-gray-500'>We'd love to hear about your journey, challenges overcome, and the impact of 
              your education on your career success.
            </p>
          </div>

          <div className='flex flex-row gap-5'>
            {/* dalawang div */}
            <div className='flex items-center gap-3 bg-blue-100 p-5 rounded-2xl w-1/2'>
              <CircleCheck color='green'/>
              <div className='flex flex-col'>
                <p className='text-[15px]'>5-10 minutes</p>
                <span className='text-[12px] text-gray-500'>Quick and easy</span>
              </div>
            </div>

            <div className='flex items-center gap-3 bg-blue-100 p-5 rounded-2xl w-1/2'>
              <CircleCheck color='green'/>
              <div className='flex flex-col'>
                <p className='text-[15px]'>Confidential</p>
                <span className='text-[12px] text-gray-500'>Your privacy matters</span>
              </div>
            </div>
          </div>

          
        </CardContent>

        <CardFooter className="flex flex-col justify-center p-5">
          <Button asChild className="flex bg-blue-btn text-[15px] font" size="survey_btn">
            <Link href={route('alumna.survey')}>Start Survey</Link>
          </Button>
          <span className='text-sm text-gray-400 pt-7 pb-5'>Estimated completion time: 5-10 minutes.</span>
        </CardFooter>
      </Card>

  )
}

AlumnaQuestionnaire.layout = page => <AlumnaLayout>{page}</AlumnaLayout>

