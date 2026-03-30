import QuestionRenderer from "./QuestionRenderer";

export default function SurveySection({ section, answers, onChange, errors = {} }) {
    return (
        <div className="flex flex-col gap-6">
            <div className="mb-3">
                <h2 className="text-xl font-semibold text-blue-text">{section.title}</h2>
                {section.description && <p className="text-sm text-gray-500 mt-1">{section.description}</p>}
                
            </div>

            {section.questions.map((question) => (
                <QuestionRenderer
                    key={question.id}
                    question={question}
                    value={answers[question.id]}
                    onChange={(val) => onChange(question.id, val)}
                    error={errors[`answers.${question.id}`]}
                />
            ))}
        </div>
    );
}
