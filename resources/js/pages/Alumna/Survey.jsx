import React, { useState } from 'react'
import PersonalInformationSurvey from '../../components/survey/personal-info'
import cect from '../../assets/wup_cect.png';
import logo from '../../assets/logo final.png'
import wuplogo from '../../assets/wup.png'
import cectlogo from '../../assets/wup_cect.png'
import { Button } from '../../components/ui/button';
import { Link, useForm } from '@inertiajs/react';
import questionsData from "../../lib/questions.json";


export default function Survey() {

    //usestate for changing pages
    const [step, setStep] = useState(0);

    //kukuha ng data sa front end 
    const {data, setData, post, errors, processing} = useForm('SurveyForm', {
        answers: {
            personalInfo: {}
        }
    });

    //pang change ng page
    const next = () => setStep(step + 1);
    const prev = () => setStep(step - 1);

    //kumukuha ng mismong sagot sa survey
    const handleChange = (category, key, value) => {
    setData('answers', {
        ...data.answers,
        [category]: {
        ...data.answers[category],
        [key]: value,
        },
    });
    };

    //bind helper function
    const bindField = (category, key) => {
      // Matches Laravel's: "answers.personalInfo.last_name"
      const errorKey = `answers.${category}.${key}`;
  
      return {
          value: data.answers[category]?.[key] || "",
          error: errors[errorKey], 
          onChange: (val) => {
              // Handle both HTML events and direct values from Shadcn UI Select
              const value = val?.target ? val.target.value : val;
              handleChange(category, key, value);
          },
      };
  };

      //define niya kung anong part ng category
      const steps = [
        { component: PersonalInformationSurvey, category: 'personalInfo' },
        // { component: EmploymentSurvey, category: 'employmentInfo' },
        // { component: SkillsSurvey, category: 'skills' },
      ];
    
      //para sa steps ng multipage
      const CurrentStep = steps[step].component;
      const currentCategory = steps[step].category;
      const isLastStep = step === steps.length - 1;

      //track category using steps func
      const currentCategoryData = questionsData[steps[step].category];

      //submit func
      const submit = (e) => {
        e.preventDefault(); // prevent default form submission
        post('/alumna/survey', data); // send the answers to your backend
    };


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
                <CurrentStep bindField={bindField} category={currentCategory} config={currentCategoryData} />
            </form>
        </main>

        <footer className='flex justify-between items-center w-full max-w-4xl py-5 px-3'>
            {step > 0 && (
                <Button onClick={prev} size='lg' className='w-30'> 
                    Previous
                </Button>
            )}
            
            {!isLastStep ? (
                <Button onClick={next} size='lg' className='w-30'>
                    Next
                </Button>
            ) : (
                <Button onClick={submit} size='lg' className='w-30'>
                    Submit
                </Button>
            )}
            
        </footer>
    </div>
  )

}
