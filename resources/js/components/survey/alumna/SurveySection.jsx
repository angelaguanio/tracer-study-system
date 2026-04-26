import QuestionRenderer from "./QuestionRenderer";

export default function SurveySection({ section, answers, onChange, errors = {} }) {
    // Merge questions and subheadings, sort by display_order
    const questions = (section.questions || []).map(q => ({ ...q, itemType: 'question' }));
    const subheadings = (section.subheadings || []).map(s => ({ 
        ...s, 
        itemType: 'subheading', 
        type: 'subheading',
        // Subheadings don't need is_required since they're not input fields
        is_required: false
    }));
    const allItems = [...questions, ...subheadings].sort((a, b) => a.display_order - b.display_order);

    return (
        <div className="flex flex-col gap-6">
            <div className="mb-3">
                <h2 className="text-xl font-semibold text-blue-text">{section.title}</h2>
                {section.description && <p className="text-sm text-gray-500 mt-1">{section.description}</p>}
                
            </div>

            {allItems.map((item) => (
                <QuestionRenderer
                    key={`${item.itemType}-${item.id}`}
                    question={item}
                    value={answers[item.id]}
                    onChange={(val) => onChange(item.id, val)}
                    error={errors[`answers.${item.id}`]}
                />
            ))}
        </div>
    );
}
