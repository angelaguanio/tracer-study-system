import { router } from "@inertiajs/react";
import { ArrowLeft, Eye, User } from "lucide-react";
import CoordinatorLayout from "@/layouts/coord-layout";

export default function CoordinatorSurveyResponseView({ response, survey }) {
  const handleBack = () => {
    router.visit(`/coordinator/survey-response/${survey.id}`);
  };

  return (
    <div className="bg-[#F3FAFF] min-h-screen w-full px-6 lg:px-10 py-6">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 bg-[#0B63F6] text-white px-5 py-2.5 rounded-md hover:bg-blue-700 text-sm font-medium shadow"
        >
          <ArrowLeft size={16} />
          Back
        </button>

        <div className="flex items-center gap-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm font-medium">
          <Eye size={16} />
          Read Only
        </div>
      </div>

      <div className="bg-white p-6 lg:p-8 rounded-xl shadow mb-6">
        <div className="flex items-center gap-2 mb-4">
          <User size={20} />
          <h2 className="text-lg font-semibold">Personal Information</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6 text-sm">
          <div>
            <p className="text-gray-500">Name</p>
            <p className="font-semibold">{response?.name || "-"}</p>
          </div>

          <div>
            <p className="text-gray-500">Email</p>
            <p className="font-semibold">{response?.email || "-"}</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 lg:p-8 rounded-xl shadow">
        <h2 className="text-lg font-semibold mb-4">Survey Answers</h2>

        <div className="space-y-6 text-sm">
          {response?.sections?.length > 0 ? (
            response.sections.map((section, i) => (
              <div key={i} className="border-b pb-4">
                <h3 className="font-bold text-gray-800 mb-3">{section.section_title}</h3>

                {section.answers?.length > 0 ? (
                  section.answers.map((item, idx) => (
                    <div key={idx} className="mb-3">
                      <p className="text-gray-500">{item.question || "No question"}</p>
                      <p className="font-semibold text-gray-900">{item.answer || "-"}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400">No answers in this section</p>
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-500">No survey responses found.</p>
          )}
        </div>
      </div>
    </div>
  );
}

CoordinatorSurveyResponseView.layout = (page) => <CoordinatorLayout>{page}</CoordinatorLayout>;

