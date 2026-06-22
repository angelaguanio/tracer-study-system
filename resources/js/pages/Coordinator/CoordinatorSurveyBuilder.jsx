import  {route}  from "ziggy-js";
import { useState, useEffect } from "react";
import { router, usePage, Link, useForm } from "@inertiajs/react";
import { Plus, ArrowLeft, Pencil, Check } from "lucide-react";
import CoordinatorLayout from "@/layouts/coord-layout";
import SectionPanel from "@/components/survey/coordinator/SectionPanel";
import QuestionItem from "@/components/survey/coordinator/QuestionItem";
import SectionFormModal from "@/components/survey/coordinator/SectionFormModal";
import QuestionFormModal from "@/components/survey/coordinator/QuestionFormModal";
import SubheadingFormModal from "@/components/survey/coordinator/SubheadingFormModal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function CoordinatorSurveyBuilder({ survey, has_responses = false }) {
    const { props } = usePage();
    const [localSections, setLocalSections] = useState(survey.sections ?? []);
    const [activeSectionId, setActiveSectionId] = useState((survey.sections ?? [])[0]?.id ?? null);
    const [isEditingHeader, setIsEditingHeader] = useState(false);

    const { data, setData, put, processing, errors, reset } = useForm({
        title: survey.title,
        description: survey.description || '',
    });

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
    const [subheadingModal, setSubheadingModal] = useState({ open: false, subheading: null });

    const activeSection = localSections.find((s) => s.id === activeSectionId);

    const handleReorder = (sectionId, direction) => {
        const idx = localSections.findIndex((s) => s.id === sectionId);
        const swapIdx = direction === "up" ? idx - 1 : idx + 1;
        if (swapIdx < 0 || swapIdx >= localSections.length) return;

        // Optimistic update
        const reordered = [...localSections];
        [reordered[idx], reordered[swapIdx]] = [reordered[swapIdx], reordered[idx]];
        setLocalSections(reordered);

        router.put(route("coordinator.sections.reorder", survey.id), {
            sections: reordered.map((s, idx) => ({ id: s.id, display_order: idx + 1 })),
        }, {
            preserveScroll: true,
        });
    };

    const handleStatusToggle = (checked) => {
        router.put(route("coordinator.surveys.update", survey.id), { status: checked ? "active" : "inactive" });
    };

    const handleSaveHeader = () => {
        put(route("coordinator.surveys.update", survey.id), {
            preserveScroll: true,
            onSuccess: () => {
                setIsEditingHeader(false);
            },
        });
    };

    const handleCancelEdit = () => {
        reset();
        setIsEditingHeader(false);
    };

    const handleQuestionReorder = (itemId, direction) => {
        // Get all items (questions + subheadings) merged and sorted
        const questions = (activeSection?.questions || []).map(q => ({ ...q, itemType: 'question' }));
        const subheadings = (activeSection?.subheadings || []).map(s => ({ ...s, itemType: 'subheading' }));
        const allItems = [...questions, ...subheadings].sort((a, b) => a.display_order - b.display_order);
        
        const idx = allItems.findIndex((item) => item.id === itemId);
        const swapIdx = direction === "up" ? idx - 1 : idx + 1;
        if (swapIdx < 0 || swapIdx >= allItems.length) return;

        const reordered = [...allItems];
        [reordered[idx], reordered[swapIdx]] = [reordered[swapIdx], reordered[idx]];

        // Optimistic update - update both questions and subheadings in local state
        const updatedQuestions = reordered.filter(item => item.itemType === 'question');
        const updatedSubheadings = reordered.filter(item => item.itemType === 'subheading');
        
        setLocalSections((prev) => prev.map((s) =>
            s.id === activeSectionId 
                ? { ...s, questions: updatedQuestions, subheadings: updatedSubheadings } 
                : s
        ));

        // Send reorder request with mixed items
        router.put(route("coordinator.subheadings.reorder", activeSectionId), {
            items: reordered.map((item, i) => ({ 
                id: item.id, 
                type: item.itemType === 'subheading' ? 'subheading' : 'question',
                display_order: i + 1 
            })),
        }, { preserveScroll: true });
    };

    return (
        <div className="min-h-screen w-full bg-[#f0faff] p-4 sm:p-6 flex flex-col gap-4">
            {/* Header */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
                <div className="flex items-start justify-between gap-4">
                    {/* Left: Back button + Title/Description */}
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                        <Link href={route("coordinator.surveys.index")}>
                            <Button variant="ghost" size="sm" className=" text-gray-400 hover:text-gray-600 hover:bg-gray-100 px-2 mt-1">
                                <ArrowLeft size={18} />
                            </Button>
                        </Link>
                        
                        {isEditingHeader ? (
                            <div className="flex-1 space-y-3">
                                <div className="flex items-center gap-2">
                                    <Input
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                        placeholder="Enter survey title"
                                        className="text-lg font-semibold border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                        autoFocus
                                    />
                                </div>
                                <Textarea
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    placeholder="Add a description (optional)"
                                    className="text-sm resize-none border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                    rows={2}
                                />
                                {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
                                {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
                                
                                <div className="flex items-center justify-end gap-2">
                                    <Button
                                        size="sm"
                                        className="bg-blue-600 hover:bg-blue-700 text-white"
                                        onClick={handleSaveHeader}
                                        disabled={processing || !data.title.trim()}
                                    >
                                        <Check size={14} className="mr-1" />
                                        Save
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="border-gray-300 text-gray-700 hover:bg-gray-50"
                                        onClick={handleCancelEdit}
                                        disabled={processing}
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex-1 group">
                                <div className="flex items-start gap-2">
                                    <div className="flex-1 min-w-0">
                                        <h1 className="text-lg font-semibold text-gray-900 truncate">{survey.title}</h1>
                                        {survey.description && (
                                            <p className="text-sm text-gray-500 mt-0.5 line-clamp-2">{survey.description}</p>
                                        )}
                                    </div>
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        className="self-center transition-opacity h-8 w-8 p-0 text-gray-400 hover:text-blue-600 hover:bg-blue-50"
                                        onClick={() => setIsEditingHeader(true)}
                                    >
                                        <Pencil size={14} />
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right: Status Badge + Toggle */}
                    {!isEditingHeader && (
                        <div className="flex items-center gap-3 shrink-0 self-center">
                            <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-1.5 border border-gray-200 ">
                                <Switch
                                    id="status-toggle"
                                    checked={survey.status === "active"}
                                    onCheckedChange={handleStatusToggle}
                                    className="data-[state=checked]:bg-green-600"
                                />
                                <Label 
                                    htmlFor="status-toggle" 
                                    className={`text-sm font-medium cursor-pointer ${
                                        survey.status === "active" ? "text-green-700" : "text-gray-500"
                                    }`}
                                >
                                    {survey.status === "active" ? "Active" : "Inactive"}
                                </Label>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Structural lock banner */}
            {has_responses && (
                <div className="flex items-center gap-2 bg-amber-50 border border-amber-300 rounded-lg px-4 py-2.5 text-sm text-amber-800">
                    <svg className="w-4 h-4 shrink-0 text-amber-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                    </svg>
                    <span><strong>Responses exist.</strong> Wording, title, and description edits are still allowed. Deleting questions/sections and changing question types are locked.</span>
                </div>
            )}

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
                                hasResponses={has_responses}
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
                                <div className="flex gap-2">
                                    <Button size="sm" variant="outline" className="h-7 text-xs border-amber-300 text-amber-700 hover:bg-amber-50" onClick={() => setSubheadingModal({ open: true, subheading: null })}>
                                        <Plus size={12} /> Add Subheading
                                    </Button>
                                    <Button size="sm" className="h-7 text-xs bg-[#008236] hover:bg-green-700 text-white" onClick={() => setQuestionModal({ open: true, question: null })}>
                                        <Plus size={12} /> Add Question
                                    </Button>
                                </div>
                            </div>
                            {(() => {
                                // Merge questions and subheadings, sort by display_order
                                const questions = (activeSection.questions || []).map(q => ({ ...q, itemType: 'question' }));
                                const subheadings = (activeSection.subheadings || []).map(s => ({ ...s, itemType: 'subheading', type: 'subheading' }));
                                const allItems = [...questions, ...subheadings].sort((a, b) => a.display_order - b.display_order);
                                
                                if (allItems.length === 0) {
                                    return (
                                        <div className="bg-white border rounded-lg p-8 text-center text-gray-400 text-sm">
                                            No questions or subheadings in this section yet.
                                        </div>
                                    );
                                }
                                
                                return allItems.map((item, idx) => (
                                    <QuestionItem
                                        key={`${item.itemType}-${item.id}`}
                                        question={item}
                                        isFirst={idx === 0}
                                        isLast={idx === allItems.length - 1}
                                        hasResponses={has_responses}
                                        onEdit={(item) => {
                                            if (item.itemType === 'subheading') {
                                                setSubheadingModal({ open: true, subheading: item });
                                            } else {
                                                setQuestionModal({ open: true, question: item });
                                            }
                                        }}
                                        onReorder={handleQuestionReorder}
                                    />
                                ));
                            })()}
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
                hasResponses={has_responses}
            />
            <SubheadingFormModal
                open={subheadingModal.open}
                onClose={() => setSubheadingModal({ open: false, subheading: null })}
                sectionId={activeSectionId}
                subheading={subheadingModal.subheading}
            />
        </div>
    );
}

CoordinatorSurveyBuilder.layout = (page) => <CoordinatorLayout>{page}</CoordinatorLayout>;