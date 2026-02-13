import React, { useState } from 'react'
import PersonalInformationSurvey from '../../components/survey/personal-info'
import cect from '../../assets/wup_cect.png';
import logo from '../../assets/logo final.png'
import wuplogo from '../../assets/wup.png'
import cectlogo from '../../assets/wup_cect.png'
import { Button } from '../../components/ui/button';
import { Link, useForm } from '@inertiajs/react';

export default function Survey() {

    const [step, setStep] = useState(0);

    const {data, setData, post, errors, processing} = useForm({
        answers: {}
    });

    const steps = [
        PersonalInformationSurvey,
        EmploymentStatus,
        EmploymentHistory,
        SkillsDevelopment,
        ReviewSubmit,
      ];

    const totalSteps = steps.length;
    const isLastStep = step === totalSteps - 1;

    const next = () => setStep(s => Math.min(s + 1, totalSteps - 1));
    const prev = () => setStep(s => Math.max(s - 1, 0));


    const handleChange = (key, value) => {
        setData('answers', {
          ...data.answers,
          [key]: value,
        });
      };

    const submit = () =>  post(`/survey/${survey.id}`); 

    const CurrentStep = steps[step];

  return (
    <div className='flex flex-col min-h-screen w-full items-center p-5 overflow-y-auto'>
        <header className='flex flex-col justify-center items-center p-8'>
            <div className='flex flex-row justify-center items-center gap-x-1'>
                <img src={wuplogo} className='aspect-square h-20'/>
                <img src={logo} className='aspect-square h-40'/>
                <img src={cectlogo} className='aspect-square h-18'/>
            </div>

            <h1 className='font-inria text-2xl font-bold'>TRACER STUDY SYSTEM</h1>
            <p className='font-inria text-xl'>COLLEGE OF ENGINEERING AND COMPUTER TECHNOLOGY </p>
        </header>

        <main className='h-full w-1/2'>
            <form>
                <CurrentStep
                    data={data}
                    errors={errors}
                    onChange={handleChange}
                />
            </form>
        </main>

        <footer className='flex justify-between items-center w-full max-w-4xl py-5 px-3'>
            {step > 0 && (
                <Button asChild size='lg' className='w-30'> 
                    <Link onClick={prev}>Cancel</Link>
                </Button>
            )}
            
            {!isLastStep ? (
                <Button asChild size='lg' className='w-30'>
                    <Link onClick={next}>Next</Link>
                </Button>
            ) : (
                <Button asChild size='lg' className='w-30'>
                    <Link onClick={submit}>Submit</Link>
                </Button>
            )}
            
        </footer>
    </div>
  )
}
