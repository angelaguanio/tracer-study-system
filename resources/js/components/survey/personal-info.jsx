import React from 'react'
import { Card, CardHeader, CardTitle, CardAction, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { User } from 'lucide-react';
import questionsData from "../../lib/questions.json";
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




export default function PersonalInformationSurvey({bindField, category}) {
  const { personalInfo } = questionsData;

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
            {personalInfo.questions.map((q) => {

              //pangkuha data
            const field = bindField(category, q.id, q.type, q.option);
            
//==================BACHELORS DEGREE QUESTION======================

              if(q.type === 'select') {
                return(
                  <div key={q.id} className='flex flex-col gap-y-5'>
                    <Label className='text-lg'>{q.label}</Label>
                    <Select value={field.value} onValueChange={field.onChange}>    
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
                    {field.error && <p className="text-red-500 text-sm">{field.error}</p>}
                  </div>
                )
              }
              
//==================YEAR SELECT QUESTION======================

              if (q.type === 'year_select') {
                const years = Array.from(
                  {length: q.max - q.min + 1},
                  (_, i) => q.max - i //new first
                );

                return(
                    <div key={q.id} className='flex flex-col gap-y-5'>
                    <Label className='text-lg'>{q.label}</Label>
                    <Select value={field.value} onValueChange={field.onChange} >
                      <SelectTrigger className='w-full py-7'>
                        <SelectValue placeholder={q.placeholder} />
                      </SelectTrigger>

                      <SelectContent className='max-h-56'>
                        {years.map(year => (
                          <SelectItem key={year} value={year}>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {field.error && <p className="text-red-500 text-sm">{field.error}</p>}
                  </div>
                )
              }

//==================TEXT QUESTIONS======================

              return (
              <TextInput
                key={q.id}
                labelName={q.id}
                labelTitle={q.label}
                placeholder={q.placeholder}
                type={q.type}
                className='text-lg h-15'
                {...field}
              />
              )
            })}
        </CardContent>
    </Card>
  )
}
