import React from 'react'
import { Card, CardHeader, CardTitle, CardAction, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { User } from 'lucide-react';
import personalInfo from '../../lib/questions';
import TextInput from '../text-input';
import { Label } from '../ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from '@headlessui/react';




export default function PersonalInformationSurvey() {
  return (
    
    <Card className='h-fit px-3 py-10 content-center '>
        <CardHeader>
            <CardTitle >
              <div className='flex items-center gap-3'>
                <User/>
                <h1 className=''>{personalInfo.title}</h1>
              </div>
            </CardTitle>

            <CardDescription>
              {personalInfo.desc}
            </CardDescription>
        </CardHeader>

        <CardContent>
              <form className='flex flex-col gap-10'>
                {personalInfo.questions.map((q) => {

                  //==================BACHELORS DEGREE QUESTION======================

                  if(q.type === 'select') {
                    return(
                      <div className='flex flex-col gap-y-5'>
                        <Label className='text-lg'>{q.label}</Label>
                        {/* <Select value={data[q.id]} onValueChange={value => setData(q.id, value)}> */}
                        <Select >
                          <SelectTrigger className='w-full py-7'>
                            <SelectValue placeholder={q.placeholder} />
                          </SelectTrigger>

                          <SelectContent className='max-h-56'>
                            {q.options.map((opt) => (
                              <SelectItem key={opt.value} value={opt.value}>
                                {opt.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )
                  }
                  
                  // if (type === 'year_select') {
                    
                  // }

                  return (
                  <TextInput
                    key={q.id}
                    labelName={q.id}
                    labelTitle={q.label}
                    placeholder={q.placeholder}
                    type={q.type}
                    className='text-lg h-15'
                  />
                  )
                })}

              
              </form>
        </CardContent>
    </Card>
  )
}
