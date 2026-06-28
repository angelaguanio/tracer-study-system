import { router } from "@inertiajs/react";
import { ArrowLeft } from "lucide-react";
import CoordinatorLayout from "@/layouts/coord-layout";

export default function CoordinatorSurveyResponseViewNotCompleted({ survey }) {
  const handleBack = () => {
    // Note: router.get is fine, but router.visit is the standard Inertia way
    router.visit(`/coordinator/survey-response/${survey.id}`);
  };

  return (
    <div className="bg-[#F3FAFF] min-h-screen w-full px-4 sm:px-6 lg:px-10 py-6 flex flex-col">
      {/* Header Container */}
      <div className="flex items-center gap-3 mb-6 shrink-0 w-full max-w-6xl mx-auto">
        <button
          onClick={handleBack}
          className="text-gray-400 hover:text-gray-600 transition-colors shrink-0 p-1 rounded-md cursor-pointer"
          title="Back"
        >
          <ArrowLeft size={24} className="stroke-[2]" />
        </button>

        <h1 className="text-lg sm:text-xl font-bold text-gray-800 tracking-tight truncate">
          {survey?.title}
        </h1>
      </div>

      {/* Centered Message Container */}
      <div className="flex justify-center mt-16 px-4">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-blue-100 max-w-sm w-full text-center">
            {/* Opsyonal: Icon para mas visual ang state */}
            <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⏳</span>
            </div>
            <p className="text-gray-600 font-semibold text-base sm:text-lg leading-relaxed">
                This user has not yet completed the survey.
            </p>
        </div>
      </div>
    </div>
  );
}

CoordinatorSurveyResponseViewNotCompleted.layout = (page) => (
  <CoordinatorLayout>{page}</CoordinatorLayout>
);