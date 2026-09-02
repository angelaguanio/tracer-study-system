import { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import AlumnaLayout from "@/layouts/alumna-layout";
import { CircleCheck, SparkleIcon, PartyPopper, ClipboardX, FileText, GraduationCap, NotebookText, CalendarDays, NotebookPen } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Link, usePage, router } from '@inertiajs/react';
import { Badge } from "@/components/ui/badge";
import { toast } from 'sonner';
import { DotPattern } from "@/components/magicui/dot-pattern";
import { cn } from "@/lib/utils";
export default function AlumnaQuestionnaire({ 
  tracerStudySurvey, 
  tracerStudyCompleted, 
  cectSurveys, 
  hasTracerStudy 
}) {
  const { props, url } = usePage();
  const justCompleted = props.flash?.justCompleted;
  const completedSurveyType = props.flash?.completedSurveyType;
  
  const tabMatch = url.match(/[?&]tab=([^&]+)/);
  const tabParam = tabMatch ? tabMatch[1] : null;

  const activeTab = tabParam || (justCompleted && completedSurveyType === 'cect' ? 'cect-surveys' : 'tracer-study');

  // Fire a toast when arriving back after survey submission
  useEffect(() => {
    if (justCompleted) {
      toast.success('Survey Completed!', {
        description: 'Your response has been recorded. Thank you for your feedback!',
        duration: 5000,
      });
    }
  }, [justCompleted]);

  // Just finished this session → toast fires above; fall through to normal tab render

  const renderTracerStudyTab = () => {
    // Tracer study already completed
    if (tracerStudyCompleted) {
      return (
        <div className="flex items-center justify-center w-full py-10 px-4">
          <div className="relative bg-white w-full max-w-[520px] overflow-hidden shadow-md rounded-3xl border border-gray-100 flex flex-col items-center text-center pt-12 pb-12 px-6 sm:px-10">
            
            {/* Green Check Icon Circle */}
            <div className="w-[90px] h-[90px] rounded-full bg-[#F0FDF4] flex items-center justify-center mb-6">
               <div className="w-[60px] h-[60px] rounded-full bg-white border-[3px] border-[#16A34A] flex items-center justify-center">
                  <svg className="w-8 h-8 text-[#16A34A]" fill="none" stroke="currentColor" strokeWidth="4" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 13l4 4L19 7"></path>
                  </svg>
               </div>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#111827] mb-3 tracking-tight">Thank you!</h1>
            
            <p className="text-gray-500 text-[15px] sm:text-base">
               {justCompleted && completedSurveyType !== 'cect' 
                 ? "Your tracer study survey has been successfully submitted." 
                 : "Your tracer study survey has already been submitted."}
            </p>

            {/* Green dash accent */}
            <div className="w-10 h-[3px] bg-[#16A34A] rounded-full my-7" />

            {/* Light Green Alert Box */}
            <div className="bg-[#F6FDF7] border border-[#DCFCE7] rounded-xl p-4 flex items-center gap-4 text-left w-full max-w-md z-10 mb-6">
               <div className="w-[44px] h-[44px] rounded-full bg-[#E0FBE8] flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-[#16A34A]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                  </svg>
               </div>
               <div>
                 <p className="text-[#374151] text-[14px] sm:text-[14px] leading-relaxed font-medium">
                   We appreciate your time and feedback.
                 </p>
                 <p className="text-gray-500 text-[13px] sm:text-[13px]">
                   It helps us create better programs for future students.
                 </p>
               </div>
            </div>

            {/* Bottom green wave background */}
            <div className="absolute bottom-0 left-0 w-full h-16 overflow-hidden pointer-events-none">
               <svg viewBox="0 0 1440 320" className="absolute bottom-0 w-full h-full object-cover object-bottom" preserveAspectRatio="none">
                 <path fill="#22C55E" fillOpacity="0.4" d="M0,256L48,256C96,256,192,256,288,240C384,224,480,192,576,186.7C672,181,768,203,864,197.3C960,192,1056,160,1152,149.3C1248,139,1344,149,1392,154.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
               </svg>
               <svg viewBox="0 0 1440 320" className="absolute bottom-0 w-full h-full object-cover object-bottom" preserveAspectRatio="none">
                 <path fill="#16A34A" fillOpacity="1" d="M0,128L48,138.7C96,149,192,171,288,181.3C384,192,480,192,576,176C672,160,768,128,864,133.3C960,139,1056,181,1152,181.3C1248,181,1344,139,1392,117.3L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
               </svg>
            </div>
          </div>
        </div>
      );
    }

    // No tracer study available
    if (!hasTracerStudy) {
      return (
        <div className='flex items-center justify-center w-full py-10'>
          <Card className="w-full max-w-xl overflow-hidden shadow-2xl rounded-3xl p-0 gap-2">
            <CardHeader className="bg-gradient-to-r from-slate-500 to-slate-400 p-8 text-white space-y-4">
              <div className='space-y-4'>
                <div className='flex flex-row gap-2'>
                  <ClipboardX size={18} />
                  <span className='text-sm'>TRACER STUDY</span>
                </div>
                <div>
                  <h1 className='text-2xl sm:text-3xl'>No Active Tracer Study</h1>
                  <p>Check back later for the tracer study survey.</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col px-10 py-8 gap-5 items-center text-center">
              <ClipboardX size={64} className='text-slate-300' />
              <div className='space-y-2'>
                <p className='text-lg font-medium text-gray-700'>There is no active tracer study survey at the moment.</p>
                <p className='text-sm text-gray-500'>
                  The alumni affairs office will notify you when the tracer study becomes available.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    // Show tracer study survey
    //TRACER STUDY SURVEY CARD
    return (
      <div className='flex items-center justify-center w-full px-4'>
        <Card className="w-full max-w-xl overflow-hidden shadow-2xl rounded-3xl p-0 gap-1 bg-white text-gray-800">
         <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-400 px-6 sm:px-8 py-6 text-white space-y-4">
              <div className='space-y-2'>
                <div className='flex flex-row gap-2'>
                  <SparkleIcon/>
                  <span className='text-sm'>HELP SHAPE OUR FUTURE</span>
                </div>

                <div>
                  <h1 className='text-3xl sm:text-4xl font-bold'>WUP Graduate Tracer Study</h1>
                </div>
              </div>
          </CardHeader>

          <CardContent className="flex flex-col px-6 sm:px-10 py-6 gap-6">
            <div className='space-y-4'>
              <p>Share information about your employment, career progression, educational experiences, and skills development after graduation.</p>
              <p className='text-[13px] text-gray-500'>Your responses provide valuable insights into the experiences of WUP graduates and their transition beyond university.</p>
            </div>

            <div className='flex flex-col sm:flex-row gap-4'>
              <div className='flex items-center gap-3 bg-blue-100 p-5 rounded-2xl w-full sm:w-1/2'>
                <CircleCheck color='green'/>
                <div className='flex flex-col'>
                  <p className='text-[15px] text-gray-800'>5-10 minutes</p>
                  <span className='text-[12px] text-gray-500'>Quick and easy</span>
                </div>
              </div>

              <div className='flex items-center gap-3 bg-blue-100 p-5 rounded-2xl w-full sm:w-1/2'>
                <CircleCheck color='green'/>
                <div className='flex flex-col'>
                  <p className='text-[15px] text-gray-800'>Confidential</p>
                  <span className='text-[12px] text-gray-500'>Your privacy matters</span>
                </div>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col items-center px-6 sm:px-8 py-6 gap-4">
          <Button
            asChild
            className="w-full bg-blue-btn hover:bg-bluehover-btn"
            size="survey_btn"
        >
            <Link href={route('alumna.start-survey')}>
                Start Tracer Study
            </Link>
        </Button>

        <span className="text-xs sm:text-sm text-gray-400 text-center">
            Estimated completion time: 5–10 minutes.
        </span>
          </CardFooter>
        </Card>
      </div>
    );
  };

 
  const renderCectSurveysTab = () => {
    if (cectSurveys.length === 0) {
      return (
        <div className='flex items-center justify-center w-full py-10'>
          <Card className="w-full max-w-xl overflow-hidden shadow-2xl rounded-3xl p-0 gap-2">
            <CardHeader className="bg-gradient-to-r from-slate-500 to-slate-400 p-8 text-white space-y-4">
              <div className='space-y-4'>
                <div className='flex flex-row gap-2'>
                  <ClipboardX size={18} />
                  <span className='text-sm'>CECT SURVEYS</span>
                </div>
                <div>
                  <h1 className='text-2xl sm:text-3xl'>No Active Surveys</h1>
                  <p>Check back later for CECT surveys.</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col px-10 py-8 gap-5 items-center text-center">
              <ClipboardX size={64} className='text-slate-300' />
              <div className='space-y-2'>
                <p className='text-lg font-medium text-gray-700'>There are no active CECT surveys at the moment.</p>
                <p className='text-sm text-gray-500'>
                  CECT surveys will be available when faculty or coordinators create them.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    //=======CARDS CECT SURVEYSSSSSSS==============
    return (
      <div className="w-full max-w-7xl mx-auto py-8 px-4 flex flex-col items-center">
        {/* Header Section */}
        <div className="text-center mb-10 max-w-2xl px-4">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#001D4A] mb-3">
            Alumni Forms
          </h2>
          <div className="w-12 h-1 bg-yellow-400 mx-auto rounded-full mb-4" />
          <p className="text-gray-500 text-[15px] sm:text-base leading-relaxed">
            Complete available forms and questionnaires related to alumni activities, events, and other university initiatives.
          </p>
        </div>

        <div className='flex flex-wrap justify-center gap-6 w-full'>
          {cectSurveys.map((survey) => (
            <Card key={survey.id} className="flex flex-col w-full sm:w-[380px] overflow-hidden shadow-xl rounded-3xl p-0 gap-2 shrink-0">
            <CardHeader className='bg-gradient-to-l from-[#49EDC8] to-[#2D88FB] px-5 sm:px-8 py-5 text-white'>
              <div className="flex items-start gap-3 mt-3">
                <div className="flex-col w-full items-center space-y-2">
                <div className="bg-white/20 rounded-2xl p-4">
                  <div className="flex items-start gap-3">

                      <div className="p-3 rounded-full bg-white/30 shrink-0">
                          <NotebookPen size={20} />
                      </div>

                      <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">

                              <h3 className="text-lg font-semibold text-white line-clamp-2 break-words min-h-[3.5rem]">
                                  {survey.title}
                              </h3>

                              {survey.completed && (
                                  <Badge className="bg-green-100 text-green-700 border-green-300 whitespace-nowrap self-start">
                                      Completed
                                  </Badge>
                              )}

                          </div>
                      </div>

                  </div>
              </div>
                  <p className="text-sm font-normal text-white line-clamp-2 min-h-[2.5rem]">
                    {survey.description || ""}
                  </p>
                </div>
                
              </div>
            </CardHeader>
            <CardContent className="flex flex-col flex-1 p-6">
              <div className="mb-4">
                <div className="flex flex-col items-start gap-3 text-sm text-gray-500">
                  <div className='flex gap-2 items-center'>
                    <NotebookText size={15}/>
                    <span>{survey.questions_count} Question{survey.questions_count !== 1 ? 's' : ''}</span>
                  </div>
                  <div className='flex gap-2 items-center'>
                    <CalendarDays size={15}/>
                    <span>{new Date(survey.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              <div className="w-full mt-auto pt-4">
                {survey.completed ? (
                  <Button variant="outline" disabled className="w-full">
                    <CircleCheck size={16} className="mr-2" />
                    Completed
                  </Button>
                ) : (
                  <Button 
                    className="bg-blue-btn hover:bg-bluehover-btn text-white w-full"
                    onClick={() => router.get(`/alumna/surveys/${survey.id}`)}
                  >
                    <FileText size={16} className="mr-2" />
                    Answer Questionnaire
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full relative flex-1 flex flex-col justify-center items-center min-h-[calc(100vh-80px)] py-8 bg-[#F8FAFC]">
      
      {/* Background Magic UI Dot Pattern */}
      <DotPattern
        width={20}
        height={20}
        cx={1}
        cy={1}
        cr={1.5}
        className={cn(
          "[mask-image:radial-gradient(800px_circle_at_center,white,transparent)]",
          "fill-blue-500/20 absolute inset-0 h-full w-full z-0"
        )}
      />

      {/* Large Bottom Waves (SVG) */}
      <div className="absolute bottom-0 left-0 w-full pointer-events-none z-0 flex items-end">
        <svg viewBox="0 0 1440 320" preserveAspectRatio="none" className="w-full h-[30vh] md:h-[40vh] opacity-30">
          <path fill="#93C5FD" fillOpacity="1" d="M0,192L48,176C96,160,192,128,288,138.7C384,149,480,203,576,213.3C672,224,768,192,864,165.3C960,139,1056,117,1152,122.7C1248,128,1344,160,1392,176L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </div>
      <div className="absolute bottom-0 left-0 w-full pointer-events-none z-0 flex items-end">
        <svg viewBox="0 0 1440 320" preserveAspectRatio="none" className="w-full h-[25vh] md:h-[35vh] opacity-50">
           <path fill="#60A5FA" fillOpacity="1" d="M0,96L60,122.7C120,149,240,203,360,202.7C480,203,600,149,720,138.7C840,128,960,160,1080,186.7C1200,213,1320,235,1380,245.3L1440,256L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"></path>
        </svg>
      </div>

      {/* Tab Content */}
      <div className="relative z-10 w-full flex-1 flex flex-col justify-center items-center">
        {activeTab === 'tracer-study' ? renderTracerStudyTab() : renderCectSurveysTab()}
      </div>
    </div>
  );
}

AlumnaQuestionnaire.layout = page => <AlumnaLayout>{page}</AlumnaLayout>

