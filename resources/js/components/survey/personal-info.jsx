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
        <CardContent className='flex flex-col gap-6'>
            {personalInfo.questions.map((group) => {
 
//==================NAME GROUP (3 columns, single label)======================
              if (group.group === 'name') {
                return (
                  <div key="name" className='flex flex-col gap-2'>
                    <Label className='text-sm font-semibold text-gray-900'>{group.label}</Label>
                    <div className='grid grid-cols-3 gap-3'>
                      {group.fields.map((q) => {
                        const field = bindField(category, q.id, q.type, q.options);
                        return (
                          <TextInput
                            key={q.id}
                            labelName={q.id}
                            placeholder={q.placeholder}
                            type={q.type}
                            className='text-sm h-10'
                            {...field}
                          />
                        );
                      })}
                    </div>
                  </div>
                );
              }
 
//==================CONTACT GROUP (3 columns, each with label)======================
              if (group.group === 'contact') {
                return (
                  <div key="contact" className='grid grid-cols-3 gap-3'>
                    {group.fields.map((q) => {
                      const field = bindField(category, q.id, q.type, q.options);
                      return (
                        <TextInput
                          key={q.id}
                          labelName={q.id}
                          labelTitle={q.label}
                          placeholder={q.placeholder}
                          type={q.type}
                          className='text-sm h-10'
                          {...field}
                        />
                      );
                    })}
                  </div>
                );
              }
 
//==================EDUCATION GROUP (2 columns)======================
              if (group.group === 'education') {
                return (
                  <div key="education" className='grid grid-cols-2 gap-3'>
                    {group.fields.map((q) => {
                      const field = bindField(category, q.id, q.type, q.options);
 
//==================BACHELORS DEGREE QUESTION======================
                      if(q.type === 'select') {
                        return(
                          <div key={q.id} className='flex flex-col gap-y-2'>
                            <Label className='text-sm font-semibold text-gray-900'>{q.label}</Label>
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
                          (_, i) => q.max - i
                        );
                        return(
                          <div key={q.id} className='flex flex-col gap-y-2'>
                            <Label className='text-sm font-semibold text-gray-900'>{q.label}</Label>
                            <Select value={field.value} onValueChange={field.onChange}>
                              <SelectTrigger className='w-full py-7'>
                                <SelectValue placeholder={q.placeholder} />
                              </SelectTrigger>
                              <SelectContent className='max-h-56'>
                                {years.map(year => (
                                  <SelectItem key={year} value={String(year)}>
                                    {year}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            {field.error && <p className="text-red-500 text-sm">{field.error}</p>}
                          </div>
                        )
                      }
 
                      return null;
                    })}
                  </div>
                );
              }
 
              return null;
            })}
        </CardContent>
    </Card>
  )
}