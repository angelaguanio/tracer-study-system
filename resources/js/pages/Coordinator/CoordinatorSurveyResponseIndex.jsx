import { router } from "@inertiajs/react";
import CoordinatorLayout from "@/layouts/coord-layout";

export default function CoordinatorSurveyResponseIndex({ surveys = [] }) {
  return (
    <div className="min-h-screen w-full bg-[#f0faff] p-4 sm:p-6 flex flex-col gap-6">
      <div className="flex flex-col gap-1">
         <h2 className="text-xl font-bold text-gray-900">Survey Responses</h2>
         <p className="text-sm text-gray-500">Review survey submissions</p>
    </div>

      {surveys.length === 0 ? (
        <div className="bg-white border rounded-lg p-10 text-center text-gray-400 shadow-sm">
          No surveys found.
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {surveys.map((survey) => (
            <div
              key={survey.id}
              className="bg-white border rounded-lg p-5 shadow-sm flex items-center justify-between"
            >
              <div>
                <h2 className="font-semibold text-gray-800 text-base">{survey.title}</h2>

                <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs ${
                      survey.status === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {survey.status === "active" ? "Active" : "Inactive"}
                  </span>

                  <span>
                    {survey.sections_count} sections ·{" "}
                    {new Date(survey.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>

             <button
                onClick={() =>
                  router.get(`/coordinator/survey-response/${survey.id}`)
                }
                className="border border-blue-400 hover:bg-blue-300/70 cursor-pointer text-blue-600 px-4 py-2 rounded-md text-sm font-medium"
              >
                View Survey Response
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

CoordinatorSurveyResponseIndex.layout = (page) => (
  <CoordinatorLayout>{page}</CoordinatorLayout>
);

