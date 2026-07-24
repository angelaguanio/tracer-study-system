import { route } from 'ziggy-js';
import { useState } from "react";
import { router, usePage } from "@inertiajs/react";
import logo from '../../assets/logo final.png';
import wuplogo from '../../assets/wup.png';
import cectlogo from '../../assets/wup_cect.png';
import SurveyStepIndicator from "@/components/survey/alumna/SurveyStepIndicator";
import SurveySection from "@/components/survey/alumna/SurveySection";
import SurveyCompletedCard from "@/components/survey/alumna/SurveyCompletedCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { WifiOff } from "lucide-react";

export default function Survey({ survey, sections = [], currentSectionIndex = 0, draft = null, completed = false }) {
    const { errors } = usePage().props;
    const [stepIndex, setStepIndex] = useState(currentSectionIndex);
    const [answers, setAnswers] = useState(draft?.answers ?? {});
    const [busy, setBusy] = useState(false);

    const currentSection = sections[stepIndex];
    const isLast = stepIndex === sections.length - 1;
    const total = sections.length;

    const handleChange = (questionId, value) => {
        setAnswers((prev) => ({ ...prev, [questionId]: value }));
    };

    const handleNext = () => {
        setBusy(true);
        router.post(
            route("alumna.surveys.draft", survey.id),
            { section_id: currentSection.id, answers },
            {
                onSuccess: () => setStepIndex((i) => i + 1),
                onFinish: () => setBusy(false),
                preserveScroll: true,
            }
        );
    };

    const handleSubmit = () => {
        setBusy(true);
        router.post(
            route("alumna.surveys.draft", survey.id),
            { section_id: currentSection.id, answers },
            {
                onSuccess: () => {
                    router.post(route("alumna.surveys.submit", survey.id), { section_id: currentSection.id, answers }, {
                        onFinish: () => setBusy(false),
                    });
                },
                onError: () => setBusy(false),
                preserveScroll: true,
            }
        );
    };

    const handleBack = () => setStepIndex((i) => i - 1);

    return (
        <div className='flex flex-col min-h-screen w-full items-center p-5 overflow-y-auto bg-survey-bg'>
            <header className='flex flex-col justify-center items-center pt-6 pb-2'>
                <div className='flex flex-row justify-center items-center gap-x-1'>
                    <img src={wuplogo} className='aspect-square h-20'/>
                    <img src={logo} className='aspect-square h-40'/>
                    <img src={cectlogo} className='aspect-square h-18'/>
                </div>
                <div className='flex flex-col justify-center items-center gap-2'>
                    <h1 className='font-bruno text-xl'>ALUMNI CONNECT</h1>
                    <p className='font-inria text-xl text-center'>COLLEGE OF ENGINEERING AND COMPUTER TECHNOLOGY</p>
                </div>
            </header>

            <main className='w-full sm:w-3/4 md:w-2/3 lg:w-1/2 px-4'>
                {completed ? (
                    <SurveyCompletedCard surveyTitle={survey.title} />
                ) : (
                    <div className="flex flex-col gap-6 pt-6 pb-6">
                        <div>
                            <h1 className="text-xl font-bold text-blue-text mb-1">{survey.title}</h1>
                            {survey.description && (
                                <p className="text-sm text-gray-500 mb-3">{survey.description}</p>
                            )}
                            <SurveyStepIndicator current={stepIndex + 1} total={total} />
                        </div>

                        <Card className="bg-white border shadow-lg py-2 px-2">
                            <CardContent className="p-6">
                                <SurveySection
                                    section={currentSection}
                                    answers={answers}
                                    onChange={handleChange}
                                    errors={errors}
                                />
                            </CardContent>
                        </Card>

                        <div className="flex justify-between">
                            <Button variant="outline" onClick={handleBack} disabled={stepIndex === 0 || busy}>
                                Back
                            </Button>
                            {isLast ? (
                                <Button className="bg-blue-btn hover:bg-bluehover-btn text-white" onClick={handleSubmit} disabled={busy}>
                                    {busy ? 'Submitting...' : 'Submit'}
                                </Button>
                            ) : (
                                <Button className="bg-blue-btn hover:bg-bluehover-btn text-white" onClick={handleNext} disabled={busy}>
                                    {busy ? 'Saving...' : 'Next'}
                                </Button>
                            )}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
