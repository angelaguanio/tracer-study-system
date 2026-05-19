import { router } from "@inertiajs/react";
import { ArrowLeft, Eye, User } from "lucide-react";
import CoordinatorLayout from "@/layouts/coord-layout";

export default function CoordinatorSurveyResponseView({ response, survey }) {
  const handleBack = () => {
    router.visit(`/coordinator/survey-response/${survey.id}`);
  };

  return (
    <div className="min-h-screen w-full px-6 lg:px-10 py-6">
      {/* Justified Layout Row holding Side Header elements alongside Action Badge */}
      <div className="flex items-center justify-between gap-4 mb-6 w-full">
        
        {/* Back Button + Survey Title Block Alignment */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handleBack}
            className="text-gray-400 hover:text-gray-600 transition-colors shrink-0 p-1 rounded-md"
            title="Back"
          >
            <ArrowLeft size={24} className="stroke-[2]" />
          </button>

          <h1 className="text-xl font-bold text-gray-800 tracking-tight whitespace-nowrap">
            {survey?.title}
          </h1>
        </div>

        {/* Read Only Status Badge Element */}
        <div className="flex items-center gap-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm font-medium shadow-sm shrink-0">
          <Eye size={16} />
          Read Only
        </div>
      </div>

      {/* Profile/Personal Information Wrapper */}
      <div className="bg-white p-6 lg:p-8 rounded-xl shadow mb-6">
        <div className="flex items-center gap-2 mb-4">
          <User size={20} className="text-gray-700" />
          <h2 className="text-lg font-semibold text-gray-800">Personal Information</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6 text-sm">
          <div>
            <p className="text-gray-500 mb-0.5">Name</p>
            <p className="font-semibold text-gray-900">{response?.name || "-"}</p>
          </div>

          <div>
            <p className="text-gray-500 mb-0.5">Email</p>
            <p className="font-semibold text-gray-900">{response?.email || "-"}</p>
          </div>
        </div>
      </div>

      {/* Questionnaire Data Presentation Block */}
      <div className="bg-white p-6 lg:p-8 rounded-xl shadow">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Survey Answers</h2>

        <div className="space-y-6 text-sm">
          {response?.sections?.length > 0 ? (
            response.sections.map((section, i) => (
              <div key={i} className="border-b last:border-0 pb-4 last:pb-0">
                <h3 className="font-bold text-gray-800 mb-3">{section.section_title}</h3>

                {section.answers?.length > 0 ? (
                  <div className="space-y-3 pl-1">
                    {section.answers.map((item, idx) => (
                      <div key={idx} className="block">
                        <p className="text-gray-500 mb-0.5">{item.question || "No question"}</p>
                        <p className="font-semibold text-gray-900">{item.answer || "-"}</p>
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