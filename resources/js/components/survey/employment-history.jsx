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
 
export default function EmploymentHistorySurvey({bindField, category}) {
  const { employmentHistory } = questionsData;
 
  return (
    <Card className='h-fit px-3 py-10 content-center'>
        <CardHeader>
            <CardTitle>
              <div className='flex items-center gap-3'>
                <User/>
                <h1 className=''>{employmentHistory.title}</h1>
              </div>
            </CardTitle>
            <CardDescription>
              {employmentHistory.desc}
            </CardDescription>
        </CardHeader>
        <CardContent className='flex flex-col gap-6'>
          {employmentHistory.questions.map((q) => {
            const field = bindField(category, q.id, q.type, q.options);
 
//==================RADIO GRID — now single column (one per row)======================
            if (q.type === 'radio_grid') {
              const othersField = bindField(category, q.id + '_others_specify', 'text');
              return (
                <div key={q.id} className='flex flex-col gap-2'>
                  <Label className='text-sm font-semibold text-gray-900'>{q.label}</Label>
                  <div className='flex flex-col gap-2'>
                    {q.options.map((opt) => (
                      <div key={opt.value}>
                        <label className='flex items-center gap-3 cursor-pointer'>
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
 
                        {/* Show text input when "Others" is selected */}
                        {opt.value === 'others' && field.value === 'others' && (
                          <div className='mt-2 ml-7'>
                            <TextInput
                              labelName={q.id + '_others_specify'}
                              placeholder='Please specify...'
                              type='text'
                              className='text-sm h-10'
                              {...othersField}
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  {field.error && <p className="text-red-500 text-sm">{field.error}</p>}
                </div>
              );
            }
 
//==================RADIO (single column)======================
            if (q.type === 'radio') {
              return (
                <div key={q.id} className='flex flex-col gap-2'>
                  <Label className='text-sm font-semibold text-gray-900'>{q.label}</Label>
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
        </CardContent>
    </Card>
  )
}