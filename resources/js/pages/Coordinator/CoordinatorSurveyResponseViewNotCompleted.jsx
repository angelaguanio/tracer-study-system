import { router } from "@inertiajs/react";
import { ArrowLeft } from "lucide-react";
import CoordinatorLayout from "@/layouts/coord-layout";

export default function CoordinatorSurveyResponseViewNotCompleted({ survey }) {
  const handleBack = () => {
    router.get(`/coordinator/survey-response/${survey.id}`);
  };

  return (
    <div className="bg-[#F3FAFF] min-h-screen w-full px-6 lg:px-10 py-6 flex flex-col">
      {/* Back Button + Survey Title Alignment Copy from CoordinatorSurveyResponse */}
      <div className="flex items-center gap-3 mb-6 shrink-0 w-full">
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

      <div className="flex-1 flex items-start justify-center pt-20">
        <p className="text-gray-600 font-semibold text-lg max-w-md text-center leading-relaxed">
          This user has not yet completed the survey
        </p>
      </div>
    </div>
  );
}

CoordinatorSurveyResponseViewNotCompleted.layout = (page) => (
  <CoordinatorLayout>{page}</CoordinatorLayout>
);