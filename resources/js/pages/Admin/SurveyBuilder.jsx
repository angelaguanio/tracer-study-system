import { useState, useEffect } from "react";
import { router, usePage, Link } from "@inertiajs/react";
import { Plus, ArrowLeft } from "lucide-react";
import AdminLayout from "@/layouts/admin-layout";
import SectionPanel from "@/components/survey/coordinator/SectionPanel";
import QuestionItem from "@/components/survey/coordinator/QuestionItem";
import SectionFormModal from "@/components/survey/coordinator/SectionFormModal";
import QuestionFormModal from "@/components/survey/coordinator/QuestionFormModal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function SurveyBuilder({ survey }) {
    const { props } = usePage();
    const [localSections, setLocalSections] = useState(survey.sections ?? []);
    const [activeSectionId, setActiveSectionId] = useState((survey.sections ?? [])[0]?.id ?? null);

    // Sync from server after Inertia reloads (add/delete/rename)
    useEffect(() => {
        setLocalSections(survey.sections ?? []);
    }, [survey.sections]);

    // Auto-select newly created section from flash data
    useEffect(() => {
        if (props.flash?.section?.id) {
            setActiveSectionId(props.flash.section.id);
        }
    }, [props.flash?.section?.id]);

    // Keep activeSectionId valid
    useEffect(() => {
        if (!activeSectionId && localSections.length > 0) {
            setActiveSectionId(localSections[0].id);
        }
        if (activeSectionId && !localSections.find(s => s.id === activeSectionId)) {
            setActiveSectionId(localSections[0]?.id ?? null);
        }
    }, [localSections.map(s => s.id).join(',')]);

    const [sectionModal, setSectionModal] = useState({ open: false, section: null });
    const [questionModal, setQuestionModal] = useState({ open: false, question: null });

    const activeSection = localSections.find((s) => s.id === activeSectionId);

    const handleReorder = (sectionId, direction) => {
        const idx = localSections.findIndex((s) => s.id === sectionId);
        const swapIdx = direction === "up" ? idx - 1 : idx + 1;
        if (swapIdx < 0 || swapIdx >= localSections.length) return;

        // Optimistic update
        const reordered = [...localSections];
        [reordered[idx], reordered[swapIdx]] = [reordered[swapIdx], reordered[idx]];
        setLocalSections(reordered);

        router.put(route("admin.sections.reorder", survey.id), {
            sections: reordered.map((s, idx) => ({ id: s.id, display_order: idx + 1 })),
        }, {
            preserveScroll: true,
        });
    };

    const handleStatusToggle = (checked) => {
        router.put(route("admin.surveys.update", survey.id), { status: checked ? "active" : "inactive" });
    };

    const handleQuestionReorder = (questionId, direction) => {
        const questions = activeSection?.questions ?? [];
        const idx = questions.findIndex((q) => q.id === questionId);
        const swapIdx = direction === "up" ? idx - 1 : idx + 1;
        if (swapIdx < 0 || swapIdx >= questions.length) return;

        const reordered = [...questions];
        [reordered[idx], reordered[swapIdx]] = [reordered[swapIdx], reordered[idx]];

        // Optimistic update
        setLocalSections((prev) => prev.map((s) =>
            s.id === activeSectionId ? { ...s, questions: reordered } : s
        ));

        router.put(route("admin.questions.reorder", activeSectionId), {
            questions: reordered.map((q, i) => ({ id: q.id, display_order: i + 1 })),
        }, { preserveScroll: true });
    };

    return (
        <div className="min-h-screen w-full bg-[#f0faff] p-4 sm:p-6 flex flex-col gap-4">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center gap-3">
                    <Link href={route("admin.surveys.index")}>
                        <Button variant="ghost" size="sm" className="text-gray-500 hover:bg-gray-300 px-2">
                            <ArrowLeft size={16} />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-xl font-bold text-gray-800">{survey.title}</h1>
                        {survey.description && <p className="text-sm text-gray-500">{survey.description}</p>}
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Badge className={survey.status === "active" ? "bg-green-100 text-green-700 border-green-300" : "bg-gray-100 text-gray-500 border-gray-300"}>
                        {survey.status.charAt().toUpperCase() + survey.status.slice(1)}
                    </Badge>
                    <div className="flex items-center gap-2">
                        <Switch
                            id="status-toggle"
                            checked={survey.status === "active"}
                            onCheckedChange={handleStatusToggle}
                        />
                        <Label htmlFor="status-toggle" className="text-sm">Active</Label>
                    </div>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 flex-1">
                {/* Left: Sections */}
                <div className="sm:w-64 flex flex-col gap-2">
                    <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-semibold text-gray-600">Sections</span>
                        <Button size="sm" variant="outline" className="h-7 text-xs border-[#9ECEFF] text-[#2859C5]" onClick={() => setSectionModal({ open: true, section: null })}>
                            <Plus size={12} /> Add
                        </Button>
                    </div>
                    {localSections.length === 0 ? (
                        <p className="text-xs text-gray-400 text-center py-4">No sections yet</p>
                    ) : (
                        localSections.map((section, idx) => (
                            <SectionPanel
                                key={section.id}
                                section={section}
                                surveyId={survey.id}
                                isFirst={idx === 0}
                                isLast={idx === localSections.length - 1}
                                isActive={section.id === activeSectionId}
                                onClick={() => setActiveSectionId(section.id)}
                                onReorder={handleReorder}
                                onEdit={(s) => setSectionModal({ open: true, section: s })}
                            />
                        ))
                    )}
                </div>

                <div
        className="h-screen min-h-[1em] w-px self-stretch bg-gradient-to-tr from-transparent via-neutral-500 to-transparent opacity-20 dark:opacity-100"
      ></div>
                {/* Right: Questions */}
                <div className="flex-1 min-w-0 flex flex-col gap-2">
                    {activeSection ? (
                        <>
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-sm font-semibold text-gray-600">{activeSection.title}</span>
                                <Button size="sm" className="h-7 text-xs bg-[#008236] hover:bg-green-700 text-white" onClick={() => setQuestionModal({ open: true, question: null })}>
                                    <Plus size={12} /> Add Question
                                </Button>
                            </div>
                            {activeSection.questions?.length === 0 ? (
                                <div className="bg-white border rounded-lg p-8 text-center text-gray-400 text-sm">
                                    No questions in this section yet.
                                </div>
                            ) : (
                                activeSection.questions?.map((q, idx) => (
                                    <QuestionItem
                                        key={q.id}
                                        question={q}
                                        isFirst={idx === 0}
                                        isLast={idx === activeSection.questions.length - 1}
                                        onEdit={(q) => setQuestionModal({ open: true, question: q })}
                                        onReorder={handleQuestionReorder}
                                    />
                                ))
                            )}
                        </>
                    ) : (
                        <div className="bg-white border rounded-lg p-8 text-center text-gray-400 text-sm">
                            Select a section to manage its questions.
                        </div>
                    )}
                </div>
            </div>

            <SectionFormModal
                open={sectionModal.open}
                onClose={() => setSectionModal({ open: false, section: null })}
                surveyId={survey.id}
                section={sectionModal.section}
            />
            <QuestionFormModal
                open={questionModal.open}
                onClose={() => setQuestionModal({ open: false, question: null })}
                sectionId={activeSectionId}
                question={questionModal.question}
                likertScale={activeSection?.likert_scale ?? null}
            />
        </div>
    );
}

SurveyBuilder.layout = (page) => <AdminLayout>{page}</AdminLayout>;
