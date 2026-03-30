export default function SurveyStepIndicator({ current, total }) {
    const progress = Math.round((current / total) * 100);

    return (
        <div className="flex flex-col gap-1">
            <div className="flex justify-between text-sm text-gray-500">
                <span>Step {current} of {total}</span>
                <span>{progress}%</span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                    className="h-full bg-blue-btn rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                />
            </div>
        </div>
    );
}
