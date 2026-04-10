import { CircleCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function SurveyCompletedCard({ surveyTitle }) {
    return (
        <Card className="bg-white border shadow-sm">
            <CardContent className="flex flex-col items-center gap-4 py-10 text-center">
                <CircleCheck size={48} className="text-[#008236]" />
                <div>
                    <h2 className="text-lg font-semibold text-gray-800">Survey Completed</h2>
                    <p className="text-sm text-gray-500 mt-1">
                        You have already submitted your response for <span className="font-medium">{surveyTitle}</span>.
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
