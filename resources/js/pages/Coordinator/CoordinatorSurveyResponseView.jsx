import { router } from "@inertiajs/react";
import { ArrowLeft, Eye } from "lucide-react";
import CoordinatorLayout from "@/layouts/coord-layout";

export default function CoordinatorSurveyResponseView({ response, survey }) {
  const handleBack = () => {
    router.visit(`/coordinator/survey-response/${survey.id}`);
  };

  return (
    <div className="min-h-screen w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      
      {/* Header Section */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        
        <div className="flex items-center gap-3">
          <button
            onClick={handleBack}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-md"
            title="Back"
          >
            <ArrowLeft size={24} className="stroke-[2]" />
          </button>

          <h1 className="text-lg sm:text-xl font-bold text-gray-800 tracking-tight break-words">
            {survey?.title}
          </h1>
        </div>

        <div className="flex items-center gap-2 bg-gray-200 text-gray-700 px-3 py-1.5 sm:px-4 sm:py-2 rounded-md text-xs sm:text-sm font-medium shadow-sm">
          <Eye size={14} />
          Read Only
        </div>
      </div>

      {/* Questionnaire Data Presentation Block */}
      <div className="bg-white p-5 sm:p-6 lg:p-8 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800 mb-6">Survey Answers</h2>

        <div className="space-y-8 text-sm">
          {response?.sections?.length > 0 ? (
            response.sections.map((section, i) => (
              <div key={i} className="border-b border-gray-50 last:border-0 pb-6 last:pb-0">
                <h3 className="font-bold text-gray-800 mb-4 bg-gray-50 p-3 rounded-lg uppercase tracking-wider text-xs">
                    {section.section_title}
                </h3>

                {section.answers?.length > 0 ? (
                  <div className="space-y-5 pl-1">
                    {section.answers.map((item, idx) => (
                      <div key={idx} className="block">
                        {/* Changed "No question" to "Question not provided" */}
                        <p className="text-gray-500 text-xs uppercase tracking-wider font-semibold mb-1">
                            {item.question || "Question not provided"}
                        </p>
                        {/* Changed "-" to "No answer" */}
                        <p className="font-semibold text-gray-900 bg-gray-50/50 p-3 rounded border border-gray-50">
                            {item.answer || "No answer provided"}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 italic pl-1">No answers in this section</p>
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-4">No survey responses found.</p>
          )}
        </div>
      </div>
    </div>
  );
}

CoordinatorSurveyResponseView.layout = (page) => <CoordinatorLayout>{page}</CoordinatorLayout>;