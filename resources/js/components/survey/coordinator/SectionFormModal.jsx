import { useState, useEffect } from "react";
import { router } from "@inertiajs/react";
import { Plus, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function SectionFormModal({ open, onClose, surveyId, section = null }) {
    const isEdit = !!section;
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [likertScale, setLikertScale] = useState([]);
    const [newScaleItem, setNewScaleItem] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        setTitle(section?.title ?? "");
        setDescription(section?.description ?? "");
        setLikertScale(section?.likert_scale ?? []);
        setNewScaleItem("");
        setError("");
    }, [section, open]);

    const addScaleItem = () => {
        if (!newScaleItem.trim()) return;
        setLikertScale((prev) => [...prev, newScaleItem.trim()]);
        setNewScaleItem("");
    };

    const removeScaleItem = (i) => setLikertScale((prev) => prev.filter((_, idx) => idx !== i));

    const handleSubmit = () => {
        const payload = {
            title,
            description,
            likert_scale: likertScale.length > 0 ? likertScale : null,
        };
        const onError = (e) => setError(e.title ?? "");

        if (isEdit) {
            router.put(route("admin.sections.update", section.id), payload, { onError, onSuccess: onClose });
        } else {
            router.post(route("admin.sections.store", surveyId), payload, { onError, onSuccess: onClose });
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>{isEdit ? "Edit Section" : "Add Section"}</DialogTitle>
                </DialogHeader>

                <div className="flex flex-col gap-3">
                    <div className="flex flex-col gap-1">
                        <Label>Title</Label>
                        <Input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Section title"
                            autoFocus
                            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                        />
                        {error && <p className="text-xs text-red-500">{error}</p>}
                    </div>

                    <div className="flex flex-col gap-1">
                        <Label>Description <span className="text-gray-400 text-xs">(optional)</span></Label>
                        <Textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Brief description of this section"
                            rows={2}
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label>Likert Scale <span className="text-gray-400 text-xs">(optional — for rating questions)</span></Label>
                        {likertScale.map((item, i) => (
                            <div key={i} className="flex items-center gap-2">
                                <span className="flex-1 text-sm bg-gray-50 border rounded px-2 py-1">{item}</span>
                                <Button size="icon" variant="ghost" className="h-7 w-7 text-[#E70813]" onClick={() => removeScaleItem(i)}>
                                    <X size={12} />
                                </Button>
                            </div>
                        ))}
                        <div className="flex gap-2">
                            <Input
                                value={newScaleItem}
                                onChange={(e) => setNewScaleItem(e.target.value)}
                                placeholder="e.g. Very Much"
                                onKeyDown={(e) => e.key === "Enter" && addScaleItem()}
                            />
                            <Button size="sm" variant="outline" onClick={addScaleItem}><Plus size={14} /></Button>
                        </div>
                        {likertScale.length > 0 && (
                            <p className="text-xs text-gray-400">Scale order: {likertScale.join(" → ")}</p>
                        )}
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button className="bg-[#008236] hover:bg-green-700 text-white" onClick={handleSubmit}>
                        {isEdit ? "Save" : "Add Section"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
