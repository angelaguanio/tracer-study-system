import { router } from "@inertiajs/react";
import { ArrowLeft, Eye, User } from "lucide-react";
import AdminLayout from "@/layouts/admin-layout";

export default function AdminSurveyResponseView({ response, survey }) {

    const handleBack = () => {
        router.visit(`/admin/survey-response/${survey.id}`);
    };

    return (
        /* BINAGO: Ginawang fluid ang padding (px-4 pataas sa lg:px-10) para maganda ang margin sa mobile */
        <div className="bg-[#F3FAFF] w-full h-screen overflow-y-auto px-4 sm:px-6 lg:px-10 py-6">

            {/* HEADER AREA:
                - Mobile: flex-col at gap-3 para bumaba nang maayos ang badge kung mahaba ang title.
                - Desktop (sm:): flex-row, items-center, at justify-between para magkatabi sila.
            */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6 w-full">

                {/* Back Button + Title */}
                <div className="flex items-center gap-3 shrink-0 min-w-0">
                    <button
                        onClick={handleBack}
                        className="text-gray-400 hover:text-gray-600 transition-colors shrink-0 p-1 rounded-md cursor-pointer hover:bg-gray-100"
                        title="Back"
                    >
                        <ArrowLeft size={24} className="stroke-[2]" />
                    </button>

                    {/* Nilagyan ng truncate para hindi itulak palabas ang screen kung sobrang haba ng title */}
                    <h1 className="lg:text-xl text-md line-clamp-2 font-bold text-gray-800 tracking-tight max-w-[280px] xs:max-w-xs sm:max-w-md md:max-w-lg lg:max-w-2xl" title={survey?.title}>
                        {survey?.title}
                    </h1>
                </div>

                {/* READ ONLY BADGE:
                    - Mobile: 'w-fit' para sumakto lang ang lapad nito sa sarili niyang text kapag bumaba.
                */}
                <div className="flex items-center gap-2 bg-gray-200 text-gray-700 px-3.5 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm font-medium shadow-sm shrink-0 w-fit">
                    <Eye size={16} />
                    Read Only
                </div>

            </div>

            {/* UNCOMMENTED & UPDATED PERSONAL INFORMATION FORM (Just in case kailanganin mo ulit, responsive na grid-cols-1 hanggang md:grid-cols-3) */}
            {/* <div className="bg-white p-5 sm:p-6 lg:p-8 rounded-xl shadow mb-6">
                <div className="flex items-center gap-2 mb-4">
                    <User size={20} className="text-gray-700" />
                    <h2 className="text-lg font-semibold text-gray-800">
                        Personal Information
                    </h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 text-sm">
                    <div>
                        <p className="text-gray-400 text-xs sm:text-sm mb-0.5">Name</p>
                        <p className="font-semibold text-gray-900 break-words">
                            {response?.name || "-"}
                        </p>
                    </div>
                    <div>
                        <p className="text-gray-400 text-xs sm:text-sm mb-0.5">Email</p>
                        <p className="font-semibold text-gray-900 break-words">
                            {response?.email || "-"}
                        </p>
                    </div>
                </div>
            </div> 
            */}

            {/* SURVEY ANSWERS CARD CONTAINER */}
            <div className="bg-white p-5 sm:p-6 lg:p-8 rounded-xl shadow mb-10">

                <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-50 pb-2">
                    Survey Answers
                </h2>

                {/* Spacing sa mobile ay medyo mas pinalapit kumpara sa malaking screen (space-y-5 pataas) */}
                <div className="space-y-5 sm:space-y-6 text-sm">

                    {response?.sections?.length > 0 ? (
                        response.sections.map((section, i) => (
                            <div key={i} className="border-b last:border-0 pb-5 last:pb-0">

                                {/* SECTION TITLE */}
                                <h3 className="font-bold text-blue-600 text-base mb-3 tracking-wide">
                                    {section.section_title}
                                </h3>

                                {/* ANSWERS WRAPPER */}
                                {section.answers?.length > 0 ? (
                                    /* space-y-4 para sa bawat Question-Answer block upang madaling basahin sa mobile screen */
                                    <div className="space-y-4 pl-0.5">

                                        {section.answers.map((item, idx) => (
                                            <div key={idx} className="block group">

                                                {/* QUESTION */}
                                                <p className="text-gray-500 font-medium text-xs sm:text-sm mb-1 leading-relaxed">
                                                    {idx + 1}. {item.question || "No question"}
                                                </p>

                                                {/* ANSWER BOX: 
                                                    - Ginawan nating may pinalabas na background container ng kaunti (`bg-gray-50/70 p-2.5 rounded-lg`) 
                                                      para madaling ma-distinguish sa mobile kung aling sagot ang para sa tanong na iyon.
                                                */}
                                                <div className="bg-gray-50/70 p-2.5 rounded-lg border border-gray-100/50">
                                                    <p className="font-semibold text-gray-900 text-sm break-words whitespace-pre-line leading-relaxed">
                                                        {item.answer || "-"}
                                                    </p>
                                                </div>

                                            </div>
                                        ))}

                                    </div>
                                ) : (
                                    <p className="text-gray-400 italic pl-1 text-xs">
                                        No answers in this section
                                    </p>
                                )}

                            </div>
                        ))
                    ) : (
                        <div className="text-gray-500 text-center py-8">
                            No survey responses found.
                        </div>
                    )}

                </div>

            </div>

        </div>
    );
}

AdminSurveyResponseView.layout = (page) => (
    <AdminLayout>{page}</AdminLayout>
);