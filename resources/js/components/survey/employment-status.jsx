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
 
export default function EmploymentStatusSurvey({bindField, category}) {
  const { employmentStatus } = questionsData;
 
  return (
    <Card className='h-fit px-3 py-10 content-center'>
        <CardHeader>
            <CardTitle>
              <div className='flex items-center gap-3'>
                <User/>
                <h1 className=''>{employmentStatus.title}</h1>
              </div>
            </CardTitle>
            <CardDescription>
              {employmentStatus.desc}
            </CardDescription>
        </CardHeader>
        <CardContent className='flex flex-col gap-6'>
          {employmentStatus.questions.map((q) => {
            const field = bindField(category, q.id, q.type, q.options);
 
            //==================RADIO QUESTIONS======================
            if (q.type === 'radio') {
              return (
                <div key={q.id} className='flex flex-col gap-2'>
                  <Label className='font-semibold'>{q.label}</Label>
                  <div className='flex flex-col gap-2'>
                    {q.options.map((opt) => (
                      <label
                        key={opt.value}
                        className='flex items-center gap-3 cursor-pointer'
                      >
                        <input
                          type="radio"
                          name={q.id}
                          value={opt.value}
                          checked={field.value === opt.value}
                          onChange={() => field.onChange(opt.value)}
                          className='w-4 h-4 accent-gray-800 cursor-pointer'
                        />
                        <span className='text-sm text-gray-700'>{opt.label}</span>
                      </label>
                    ))}
                  </div>
                  {field.error && <p className="text-red-500 text-sm">{field.error}</p>}
                </div>
              );
            }
 
            //==================TEXT QUESTIONS======================
            return (
              <div key={q.id} className='flex flex-col gap-2'>
                <Label className='font-semibold'>{q.label}</Label>
                <TextInput
                  labelName={q.id}
                  labelTitle={q.label}
                  placeholder={q.placeholder}
                  type={q.type}
                  className='text-sm h-11'
                  {...field}
                />
                {field.error && <p className="text-red-500 text-sm">{field.error}</p>}
              </div>
            );
          })}
        </CardContent>
    </Card>
  )
}
 