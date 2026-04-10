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

export default function Survey({ survey, sections = [], currentSectionIndex = 0, draft = null, completed = false }) {
    const { errors } = usePage().props;
    const [stepIndex, setStepIndex] = useState(currentSectionIndex);
    const [answers, setAnswers] = useState(draft?.answers ?? {});

    const currentSection = sections[stepIndex];
    const isLast = stepIndex === sections.length - 1;
    const total = sections.length;

    const handleChange = (questionId, value) => {
        setAnswers((prev) => ({ ...prev, [questionId]: value }));
    };

    const handleNext = () => {
        router.post(
            route("alumna.surveys.draft", survey.id),
            { section_id: currentSection.id, answers },
            { onSuccess: () => setStepIndex((i) => i + 1), preserveScroll: true }
        );
    };

    const handleSubmit = () => {
        router.post(route("alumna.surveys.submit", survey.id), { section_id: currentSection.id, answers });
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
                <h1 className='font-inria text-2xl font-bold'>TRACER STUDY SYSTEM</h1>
                <p className='font-inria text-xl'>COLLEGE OF ENGINEERING AND COMPUTER TECHNOLOGY</p>
            </header>

            <main className='w-full sm:w-3/4 md:w-2/3 lg:w-1/2 px-4'>
                {completed ? (
                    <SurveyCompletedCard surveyTitle={survey.title} />
                ) : (
                    <div className="flex flex-col gap-6 pt-2 pb-6">
                        <div>
                            <h1 className="text-xl font-bold text-blue-text mb-3">{survey.title}</h1>
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
                            <Button variant="outline" onClick={handleBack} disabled={stepIndex === 0}>
                                Back
                            </Button>
                            {isLast ? (
                                <Button className="bg-blue-btn hover:bg-bluehover-btn text-white" onClick={handleSubmit}>
                                    Submit
                                </Button>
                            ) : (
                                <Button className="bg-blue-btn hover:bg-bluehover-btn text-white" onClick={handleNext}>
                                    Next
                                </Button>
                            )}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
