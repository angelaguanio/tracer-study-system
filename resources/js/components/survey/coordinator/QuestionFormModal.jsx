import { useState, useEffect } from "react";
import { router } from "@inertiajs/react";
import { Plus, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {Rows3, Rows4, CircleDashed, Hash, CircleChevronDown, SquareCheck, RectangleEllipsis, Heading2} from 'lucide-react';

const CHOICE_TYPES = ["select", "radio", "checkbox"];
const QUESTION_TYPES = [
    { icon: Rows3, value: "text", label: "Short Answer" },
    { icon: Rows4, value: "textarea", label: "Long Answer" },
    { icon: Hash, value: "number", label: "Number" },
    { icon: CircleChevronDown, value: "select",   label: "Dropdown" },
    { icon: CircleDashed, value: "radio", label: "Multiple Choice" },
    { icon: SquareCheck, value: "checkbox", label: "Checkboxes" },
    { icon: RectangleEllipsis, value: "likert", label: "Likert Scale" },
];

export default function QuestionFormModal({ open, onClose, sectionId, question = null, likertScale = null, hasResponses = false }) {
    const isEdit = !!question;
    // When editing with existing responses, only label/is_required can change freely.
    // Type change and option removal are locked.
    const isStructurallyLocked = isEdit && hasResponses;
    const [form, setForm] = useState({ label: "", type: "text", is_required: false, options: [] });
    const [newOption, setNewOption] = useState("");
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (question?.id) {
            // Edit existing question
            setForm({ label: question.label, type: question.type, is_required: question.is_required, options: question.options ?? [] });
        } else {
            // Create new regular question
            setForm({ label: "", type: "text", is_required: false, options: [] });
        }
        setErrors({});
    }, [question, open]);

    const hasOthers = form.options.includes("Others");

    const toggleOthers = () => {
        setForm((f) => ({
            ...f,
            options: hasOthers
                ? f.options.filter((o) => o !== "Others")
                : [...f.options.filter((o) => o !== "Others"), "Others"],
        }));
    };

    const addOption = () => {
        if (!newOption.trim()) return;
        const trimmed = newOption.trim();
        // Insert before "Others" if it exists
        setForm((f) => {
            const withoutOthers = f.options.filter((o) => o !== "Others");
            const updated = [...withoutOthers, trimmed];
            if (hasOthers) updated.push("Others");
            return { ...f, options: updated };
        });
        setNewOption("");
    };

    const removeOption = (i) => setForm((f) => ({ ...f, options: f.options.filter((_, idx) => idx !== i) }));

    const handleSubmit = () => {
        const payload = { ...form };
        if (!CHOICE_TYPES.includes(form.type)) delete payload.options;

        const onError = (e) => setErrors(e);

        // Determine route prefix from current route name
        const currentRoute = route().current();
        const isCoordinator = currentRoute && currentRoute.indexOf('coordinator.') === 0;
        const routePrefix = isCoordinator ? 'coordinator' : 'admin';

        if (isEdit) {
            router.put(route(`${routePrefix}.questions.update`, question.id), payload, { onError, onSuccess: onClose });
        } else {
            router.post(route(`${routePrefix}.questions.store`, sectionId), payload, { onError, onSuccess: onClose });
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="lg:max-w-lg max-w-sm">
                <DialogHeader>
                    <DialogTitle>{isEdit ? "Edit Question" : "Add Question"}</DialogTitle>
                </DialogHeader>

                {/* question input part */}
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-3">
                        <Label>Question:</Label>
                        <Input value={form.label} onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))} placeholder="Question label" />
                        {errors.label && <p className="text-xs text-red-500">{errors.label}</p>}
                    </div>

                    {/* choose answer type */}
                    <div className="flex flex-col gap-3">
                        <Label>Answer Type:</Label>
                        {isStructurallyLocked ? (
                            <div className="flex items-center gap-2 border border-gray-200 rounded-md px-3 py-2 bg-gray-50 text-sm text-gray-500">
                                {(() => {
                                    const t = QUESTION_TYPES.find(t => t.value === form.type);
                                    return t ? <><t.icon size={14} className="text-gray-400" />{t.label}</> : form.type;
                                })()}
                                <span className="ml-auto text-xs text-amber-600 font-medium">Locked</span>
                            </div>
                        ) : (
                            <Select value={form.type} onValueChange={(v) => setForm((f) => ({ ...f, type: v, options: [] }))}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {QUESTION_TYPES.map((t) => (
                                        <SelectItem key={t.value} value={t.value}>
                                            <div className="flex items-center gap-2">
                                                <t.icon size={15} />
                                                {t.label}
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    </div>

                    <div className="flex items-center gap-3">
                        <Switch
                            id="is_required"
                            checked={form.is_required}
                            onCheckedChange={(v) => setForm((f) => ({ ...f, is_required: v }))}
                        />
                        <Label htmlFor="is_required">Required</Label>
                    </div>

                    {form.type === "likert" && (
                        <div className="flex flex-col gap-1">
                            <Label>Likert Scale</Label>
                            {likertScale && likertScale.length > 0 ? (
                                <div className="flex flex-wrap gap-1">
                                    {likertScale.map((item, i) => (
                                        <span key={i} className="text-xs bg-blue-50 text-blue-700 border border-blue-200 rounded px-2 py-1">{item}</span>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-xs text-orange-500">No likert scale defined for this section. Edit the section to add one.</p>
                            )}
                        </div>
                    )}

                    {CHOICE_TYPES.includes(form.type) && (
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center justify-between">
                                <Label>Options</Label>
                                {!isStructurallyLocked && (
                                    <Button
                                        size="sm"
                                        variant={hasOthers ? "default" : "outline"}
                                        className="h-6 text-xs"
                                        onClick={toggleOthers}
                                    >
                                        {hasOthers ? "Remove Others" : '+ "Others" option'}
                                    </Button>
                                )}
                            </div>
                            {isStructurallyLocked && (
                                <p className="text-xs text-amber-600 flex items-center gap-1">
                                    <span>⚠</span> Options that have been selected by respondents cannot be removed.
                                </p>
                            )}
                            <div className="flex flex-col gap-2 max-h-48 overflow-y-auto pr-1">
                            {form.options.map((opt, i) => (
                                <div key={i} className="flex items-center gap-2">
                                    <span className={`flex-1 text-sm border rounded px-2 py-1 ${opt === "Others" ? "bg-blue-50 text-blue-700 italic" : "bg-gray-50"}`}>{opt}</span>
                                    {/* When locked, still allow removing options — backend will block if they have answers */}
                                    {opt !== "Others" && (
                                        <Button size="icon" variant="ghost" className="h-7 w-7 text-[#E70813]" onClick={() => removeOption(i)}><X size={12} /></Button>
                                    )}
                                </div>
                            ))}
                            </div>
                            <div className="flex gap-2">
                                <Input
                                    value={newOption}
                                    onChange={(e) => setNewOption(e.target.value)}
                                    placeholder="Add option"
                                    onKeyDown={(e) => e.key === "Enter" && addOption()}
                                />
                                <Button size="sm" variant="outline" onClick={addOption}><Plus size={14} /></Button>
                            </div>
                            {errors.options && <p className="text-xs text-red-500">{errors.options}</p>}
                        </div>
                    )}
                </div>
              <DialogFooter className=" flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        className="w-full sm:w-auto"
                    >
                        Cancel
                    </Button>

                    <Button
                        className="bg-[#008236] hover:bg-green-700 text-white w-full sm:w-auto"
                        onClick={handleSubmit}
                    >
                        {isEdit ? "Save Question" : "Add Question"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
