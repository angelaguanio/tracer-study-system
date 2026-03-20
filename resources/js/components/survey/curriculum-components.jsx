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
 
export default function CurriculumComponentsSurvey({bindField, category}) {
  const { curriculumComponents } = questionsData;
 
  // track question number across groups
  let questionNumber = 0;
 
  return (
    <Card className='h-fit px-3 py-10 content-center'>
        <CardHeader>
            <CardTitle>
              <div className='flex items-center gap-3'>
                <User/>
                <h1 className=''>{curriculumComponents.title}</h1>
              </div>
            </CardTitle>
            <CardDescription>
              {curriculumComponents.desc}
            </CardDescription>
        </CardHeader>
        <CardContent className='flex flex-col gap-4'>
 
            {/* Rating scale header */}
            <div className='grid grid-cols-[1fr_auto] bg-gray-100 rounded-md px-4 py-3'>
              <div></div>
              <div className='grid grid-cols-4 gap-8 text-sm font-semibold text-gray-700 text-center'>
                {curriculumComponents.rating_scale.map((scale) => (
                  <span key={scale.value}>{scale.label}</span>
                ))}
              </div>
            </div>
 
            {/* Grouped questions */}
            {curriculumComponents.groups.map((group) => (
              <div key={group.group} className='flex flex-col gap-3'>
 
                {/* Group label */}
                <h2 className='text-base font-bold text-gray-900 px-4 pt-2'>
                  {group.group}
                </h2>
 
                {/* Questions in group */}
                {group.questions.map((q) => {
                  questionNumber += 1;
                  const field = bindField(category, q.id, q.type, q.options);
 
//==================RATING QUESTION======================
                  return (
                    <div key={q.id} className='flex flex-col gap-1'>
                      <div className='grid grid-cols-[1fr_auto] items-center px-4 py-2'>
                        <p className='text-sm text-gray-800'>
                          {questionNumber}. {q.label}
                        </p>
                        <div className='grid grid-cols-4 gap-8 text-center'>
                          {curriculumComponents.rating_scale.map((scale) => (
                            <label
                              key={scale.value}
                              className='flex flex-col items-center gap-1 cursor-pointer'
                            >
                              <input
                                type="radio"
                                name={q.id}
                                value={scale.value}
                                checked={field.value === scale.value}
                                onChange={() => field.onChange(scale.value)}
                                className='w-4 h-4 accent-gray-800 cursor-pointer'
                              />
                              <span className='text-sm text-gray-700'>{scale.value}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                      {field.error && <p className="text-red-500 text-sm px-4">{field.error}</p>}
                    </div>
                  );
                })}
              </div>
            ))}
 
            {/* Extra text question at the bottom */}
            {(() => {
              const eq = curriculumComponents.extra_question;
              const field = bindField(category, eq.id, eq.type);
              return (
                <div className='px-4 pt-2'>
                  <TextInput
                    labelName={eq.id}
                    labelTitle={eq.label}
                    placeholder={eq.placeholder}
                    type={eq.type}
                    className='text-sm h-10'
                    {...field}
                  />
                </div>
              );
            })()}
 
        </CardContent>
    </Card>
  )
}