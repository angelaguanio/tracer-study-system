import { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import AlumnaLayout from "@/layouts/alumna-layout";
import { CircleCheck, SparkleIcon, PartyPopper, ClipboardX, FileText, GraduationCap, NotebookText, CalendarDays, NotebookPen } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Link, usePage, router } from '@inertiajs/react';
import { Badge } from "@/components/ui/badge";
import { toast } from 'sonner';

export default function AlumnaQuestionnaire({ 
  tracerStudySurvey, 
  tracerStudyCompleted, 
  cectSurveys, 
  hasTracerStudy 
}) {
  const { props } = usePage();
  const justCompleted = props.flash?.justCompleted;
  const [selectedTab, setSelectedTab] = useState(
    // Auto-switch to CECT tab when a CECT survey was just completed
    justCompleted ? 'cect-surveys' : 'tracer-study'
  );

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
        <div className='flex items-center justify-center w-full py-10'>
          <Card className="w-full max-w-xl mx-2 overflow-hidden shadow-xl rounded-3xl p-0 gap-1">
            <CardHeader className="bg-gradient-to-r from-green-500 to-teal-400 p-8 text-white space-y-4">
              <div className='space-y-4'>
                <div className='flex flex-row gap-2'>
                  <PartyPopper />
                  <span className='text-sm'>TRACER STUDY COMPLETED</span>
                </div>
                <div>
                  <h1 className='text-2xl sm:text-3xl'>Already Submitted</h1>
                  <p>You have completed the tracer study survey.</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col px-10 py-8 gap-5 items-center text-center">
              <CircleCheck size={64} color='green' />
              <div className='space-y-2'>
                <p className='text-lg font-medium'>You've already submitted the tracer study survey.</p>
                <p className='text-sm text-gray-500'>
                  Thank you for sharing your post-graduation experience. Your feedback helps us improve our programs for future students.
                </p>
              </div>
            </CardContent>
          </Card>
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
                  <h1 className='text-3xl sm:text-4xl font-bold'>Your Voice Matters</h1>
                  <p className="text-sm sm:text-base">Share your post-graduation experience</p>
                </div>
              </div>
          </CardHeader>

          <CardContent className="flex flex-col px-6 sm:px-10 py-6 gap-6">
            <div className='space-y-4'>
              <p>Help us improve our programs by sharing your post-graduation experience. 
                Your feedback is invaluable for future students and curriculum development.
              </p>
              <p className='text-[13px] text-gray-500'>We'd love to hear about your journey, challenges overcome, and the impact of 
                your education on your career success.
              </p>
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
      <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 w-full max-w-7xl mx-auto py-6 px-4'>
        {cectSurveys.map((survey) => (
          <Card key={survey.id} className="flex flex-col w-full overflow-hidden shadow-xl rounded-3xl p-0 gap-2 ">
            <CardHeader className='h-38 bg-gradient-to-l from-[#49EDC8] to-[#2D88FB] px-5 sm:px-8 py-5 text-white'>
              <div className="flex items-start gap-3 mt-3">
                <div className={`flex-col w-full items-center ${survey.description ? 'space-y-2' : ''}`}>
                <div className="bg-white/20 rounded-2xl p-4">
                  <div className="flex items-start gap-3">

                      <div className="p-3 rounded-full bg-white/30 shrink-0">
                          <NotebookPen size={20} />
                      </div>

                      <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">

                              <h3 className="text-lg font-semibold text-white line-clamp-2 break-words">
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
                  {survey.description && (
                    <p className="text-sm font-normal text-white line-clamp-2">{survey.description}</p>
                  )}
                </div>
                
              </div>
            </CardHeader>
            <CardContent className="flex flex-col p-6">
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
              <div className="w-full">
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
                    Take Survey
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  //CECT TABSSSSS (UNG DALAWA SA TAAS)
  return (
    <div className="w-full">
      {/* Tab Navigation */}
      <div className="flex justify-center mb-6 py-6 px-4">
        <div className="bg-white rounded-lg shadow-md p-1 flex flex-col sm:flex-row w-full sm:w-auto">
          <button
            onClick={() => setSelectedTab('tracer-study')}
            className={`flex-1 px-4 py-3 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
              selectedTab === 'tracer-study'
                ? 'bg-[#269be9] text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <SparkleIcon size={16} />
            Tracer Study Survey
          </button>
          <button
            onClick={() => setSelectedTab('cect-surveys')}
            className={`flex-1 px-4 py-3 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
              selectedTab === 'cect-surveys'
                ? 'bg-[#31c7b3d7] text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <GraduationCap size={16} />
            CECT Surveys
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {selectedTab === 'tracer-study' ? renderTracerStudyTab() : renderCectSurveysTab()}
    </div>
  );
}

AlumnaQuestionnaire.layout = page => <AlumnaLayout>{page}</AlumnaLayout>

