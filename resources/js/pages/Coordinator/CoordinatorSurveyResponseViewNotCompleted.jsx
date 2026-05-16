import { router } from "@inertiajs/react";
import { ArrowLeft } from "lucide-react";
import CoordinatorLayout from "@/layouts/coord-layout";

export default function CoordinatorSurveyResponseViewNotCompleted({ survey }) {
  const handleBack = () => {
    router.get(`/coordinator/survey-response/${survey.id}`);
  };

  return (
    <div className="bg-[#F3FAFF] min-h-screen w-full px-6 lg:px-10 py-6 flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 bg-[#0B63F6] text-white px-5 py-2.5 rounded-md hover:bg-blue-700 text-sm font-medium shadow"
        >
          <ArrowLeft size={16} />
          Back
        </button>

        <h1 className="text-lg font-semibold text-gray-800">{survey?.title}</h1>
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

