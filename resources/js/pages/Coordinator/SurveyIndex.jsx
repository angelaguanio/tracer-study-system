import { useState } from "react";
import { router } from "@inertiajs/react";
import { Plus } from "lucide-react";
import CoordinatorLayout from "@/layouts/coord-layout";
import SurveyCard from "@/components/survey/coordinator/SurveyCard";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function SurveyIndex({ surveys = [] }) {
    const [open, setOpen] = useState(false);
    const [form, setForm] = useState({ title: "", description: "" });
    const [errors, setErrors] = useState({});

    const handleCreate = () => {
        router.post(route("coordinator.surveys.store"), form, {
            onError: (e) => setErrors(e),
            onSuccess: () => { setOpen(false); setForm({ title: "", description: "" }); },
        });
    };

    return (
        <div className="min-h-screen w-full bg-[#f0faff] p-4 sm:p-6 flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-bold text-gray-800">List of Surveys</h1>
                <Button className="bg-[#008236] hover:bg-green-700 text-white" onClick={() => setOpen(true)}>
                    <Plus size={16} /> New Survey
                </Button>
            </div>

            {surveys.length === 0 ? (
                <div className="bg-white border rounded-lg p-10 text-center text-gray-400 shadow-sm">
                    No surveys yet. Create one to get started.
                </div>
            ) : (
                <div className="flex flex-col gap-3">
                    {surveys.map((survey) => <SurveyCard key={survey.id} survey={survey} />)}
                </div>
            )}

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>New Survey</DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-1">
                            <Label>Title</Label>
                            <Input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder="Survey title" />
                            {errors.title && <p className="text-xs text-red-500">{errors.title}</p>}
                        </div>
                        <div className="flex flex-col gap-1">
                            <Label>Description <span className="text-gray-400 font-normal">(optional)</span></Label>
                            <Textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} rows={3} />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                        <Button className="bg-[#008236] hover:bg-green-700 text-white" onClick={handleCreate}>Create</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

SurveyIndex.layout = (page) => <CoordinatorLayout>{page}</CoordinatorLayout>;
