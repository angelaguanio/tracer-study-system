import { router } from "@inertiajs/react";
import { Pencil, Trash2, ChevronUp, ChevronDown, Rows3, Rows4, Hash, CircleChevronDown, CircleDashed, SquareCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const TYPE_MAP = {
    text:     { label: "Short Answer",    icon: Rows3 },
    textarea: { label: "Long Answer",     icon: Rows4 },
    number:   { label: "Number",          icon: Hash },
    select:   { label: "Dropdown",        icon: CircleChevronDown },
    radio:    { label: "Multiple Choice", icon: CircleDashed },
    checkbox: { label: "Checkboxes",      icon: SquareCheck },
    likert:   { label: "Likert Scale",    icon: CircleDashed },
};

export default function QuestionItem({ question, onEdit, onReorder, isFirst, isLast }) {
    const handleDelete = () => {
        router.delete(route("admin.questions.destroy", question.id));
    };

    const typeInfo = TYPE_MAP[question.type] ?? { label: question.type, icon: Rows3 };
    const TypeIcon = typeInfo.icon;

    return (
        <div className="flex flex-col gap-1 px-3 py-2 rounded-lg border bg-white border-gray-200 hover:bg-gray-50 transition">
            <div className="flex items-start justify-between gap-2">
                <span className="text-sm text-gray-800">{question.label}</span>
                <div className="flex gap-1 shrink-0">
                    <Button size="icon" variant="ghost" className="h-7 w-7" disabled={isFirst} onClick={() => onReorder(question.id, "up")}><ChevronUp size={14} /></Button>
                    <Button size="icon" variant="ghost" className="h-7 w-7" disabled={isLast} onClick={() => onReorder(question.id, "down")}><ChevronDown size={14} /></Button>
                    <Button size="icon" variant="ghost" className="h-7 w-7 text-[#2859C5]" onClick={() => onEdit(question)}>
                        <Pencil size={14} />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-7 w-7 text-[#E70813]" onClick={handleDelete}>
                        <Trash2 size={14} />
                    </Button>
                </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
                <Badge className="bg-sky-100 text-sky-700 border-sky-300 flex items-center gap-1">
                    <TypeIcon size={11} />
                    {typeInfo.label}
                </Badge>
                {question.is_required && (
                    <Badge className="bg-orange-100 text-orange-600 border-orange-300">Required</Badge>
                )}
            </div>
        </div>
    );
}
