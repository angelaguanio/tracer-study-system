import { router } from "@inertiajs/react";
import { Pencil, Trash2, ChevronUp, ChevronDown, Rows3, Rows4, Hash, CircleChevronDown, CircleDashed, SquareCheck, Heading2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { route } from "ziggy-js";

const TYPE_MAP = {
    text:       { label: "Short Answer",    icon: Rows3 },
    textarea:   { label: "Long Answer",     icon: Rows4 },
    number:     { label: "Number",          icon: Hash },
    select:     { label: "Dropdown",        icon: CircleChevronDown },
    radio:      { label: "Multiple Choice", icon: CircleDashed },
    checkbox:   { label: "Checkboxes",      icon: SquareCheck },
    likert:     { label: "Likert Scale",    icon: CircleDashed },
    subheading: { label: "Subheading",      icon: Heading2 },
};

export default function QuestionItem({ question, onEdit, onReorder, isFirst, isLast }) {
    const handleDelete = () => {
        if (question.itemType === 'subheading') {
            router.delete(route("admin.subheadings.destroy", question.id));
        } else {
            router.delete(route("admin.questions.destroy", question.id));
        }
    };

    const typeInfo = TYPE_MAP[question.type] ?? { label: question.type, icon: Rows3 };
    const TypeIcon = typeInfo.icon;
    const isSubheading = question.type === 'subheading';

    if (isSubheading) {
        return (
            <div className="flex flex-col gap-1 px-4 py-3 rounded-lg border-2 border-dashed bg-amber-50 border-amber-300 hover:bg-amber-100 transition">
                <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            <Heading2 size={16} className="text-amber-700" />
                            <span className="text-xs font-semibold text-amber-700 uppercase tracking-wide">Section Description</span>
                        </div>
                        <p className="text-sm text-gray-700 whitespace-pre-wrap">{question.label}</p>
                    </div>
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
            </div>
        );
    }

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
