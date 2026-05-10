import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Heading2 } from "lucide-react";

export default function QuestionRenderer({ question, value, onChange, error }) {
    const id = `q-${question.id}`;
    const hasOthers = (question.options ?? []).includes("Others");

    // Handle subheading type - render as static text block
    if (question.type === "subheading") {
        return (
            <div className="flex flex-col gap-2 px-4 py-3 rounded-lg bg-blue-50 border-l-4 border-blue-500">
                <div className="flex items-center gap-2">
                    <Heading2 size={18} className="text-blue-700" />
                    <span className="text-sm font-semibold text-blue-700 uppercase tracking-wide">Section Information</span>
                </div>
                <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{question.label}</p>
            </div>
        );
    }

    const handleCheckbox = (option, checked) => {
        const current = Array.isArray(value) ? value : [];
        onChange(checked ? [...current, option] : current.filter((v) => v !== option));
    };

    // For select/radio: value may be "Others" + a pipe-separated custom text e.g. "Others|my custom"
    const isOthersSelected = (val) => typeof val === "string" && val === "Others" || (typeof val === "string" && val.startsWith("Others|"));
    const othersText = (val) => typeof val === "string" && val.startsWith("Others|") ? val.slice(7) : "";

    const handleOthersText = (text) => onChange(text ? `Others|${text}` : "Others");

    // For checkbox: check if "Others" is in the array
    const checkboxOthersText = Array.isArray(value)
        ? (value.find(v => v.startsWith("Others|")) ?? (value.includes("Others") ? "Others" : null))
        : null;
    const checkboxOthersCustom = checkboxOthersText?.startsWith("Others|") ? checkboxOthersText.slice(7) : "";

    const handleCheckboxOthersText = (text) => {
        const current = Array.isArray(value) ? value : [];
        const withoutOthers = current.filter(v => v !== "Others" && !v.startsWith("Others|"));
        onChange([...withoutOthers, text ? `Others|${text}` : "Others"]);
    };

    return (
        <div className="flex flex-col gap-2">
            <Label htmlFor={id} className="text-gray-800 font-medium text-[15px]">
                {question.label}
                {question.is_required && <span className="text-red-500 ml-1">*</span>}
            </Label>

            {question.type === "text" && (
                <Input id={id} value={value ?? ""} onChange={(e) => onChange(e.target.value)} />
            )}

            {question.type === "textarea" && (
                <Textarea id={id} value={value ?? ""} onChange={(e) => onChange(e.target.value)} rows={3} />
            )}

            {question.type === "number" && (
                <Input id={id} type="number" value={value ?? ""} onChange={(e) => onChange(e.target.value)} />
            )}

            {question.type === "likert" && (
                <div className="flex flex-col gap-2">
                    <div className="grid grid-cols-2 sm:flex sm:flex-row gap-2">
                        {(question.options ?? []).map((opt) => (
                            <button
                                key={opt}
                                type="button"
                                onClick={() => onChange(opt)}
                                className={`flex-1 min-w-[60px] text-xs border rounded-lg py-3 px-1 text-center transition ${
                                    value === opt
                                        ? "bg-blue-btn text-white border-blue-btn"
                                        : "bg-white text-gray-700 border-gray-300 hover:border-blue-btn"
                                }`}
                            >
                                {opt}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {question.type === "select" && (
                <>
                    <Select value={isOthersSelected(value) ? "Others" : (value ?? "")} onValueChange={(v) => onChange(v)}>
                        <SelectTrigger id={id} className="w-full"><SelectValue placeholder="Select an option" /></SelectTrigger>
                        <SelectContent>
                            {(question.options ?? []).map((opt) => (
                                <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {isOthersSelected(value) && (
                        <Input placeholder="Please specify..." value={othersText(value)} onChange={(e) => handleOthersText(e.target.value)} />
                    )}
                </>
            )}

            {question.type === "radio" && (
                <RadioGroup value={isOthersSelected(value) ? "Others" : (value ?? "")} onValueChange={(v) => onChange(v)}>
                    {(question.options ?? []).map((opt) => (
                        <div key={opt} className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                                <RadioGroupItem value={opt} id={`${id}-${opt}`} />
                                <Label htmlFor={`${id}-${opt}`} className="font-normal">{opt}</Label>
                            </div>
                            {opt === "Others" && isOthersSelected(value) && (
                                <Input className="ml-6" placeholder="Please specify..." value={othersText(value)} onChange={(e) => handleOthersText(e.target.value)} />
                            )}
                        </div>
                    ))}
                </RadioGroup>
            )}

            {question.type === "checkbox" && (
                <div className="flex flex-col gap-2">
                    {(question.options ?? []).map((opt) => {
                        const isChecked = Array.isArray(value) && (value.includes(opt) || (opt === "Others" && value.some(v => v.startsWith("Others|"))));
                        return (
                            <div key={opt} className="flex flex-col gap-1">
                                <div className="flex items-center gap-2">
                                    <Checkbox
                                        id={`${id}-${opt}`}
                                        checked={isChecked}
                                        onCheckedChange={(checked) => {
                                            if (opt === "Others") {
                                                const current = Array.isArray(value) ? value : [];
                                                const withoutOthers = current.filter(v => v !== "Others" && !v.startsWith("Others|"));
                                                onChange(checked ? [...withoutOthers, "Others"] : withoutOthers);
                                            } else {
                                                handleCheckbox(opt, checked);
                                            }
                                        }}
                                    />
                                    <Label htmlFor={`${id}-${opt}`} className="font-normal">{opt}</Label>
                                </div>
                                {opt === "Others" && isChecked && (
                                    <Input className="ml-6" placeholder="Please specify..." value={checkboxOthersCustom} onChange={(e) => handleCheckboxOthersText(e.target.value)} />
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
    );
}
