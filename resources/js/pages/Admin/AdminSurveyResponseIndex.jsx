import { router } from "@inertiajs/react";
import AdminLayout from "@/layouts/admin-layout";

export default function AdminSurveyResponseIndex({ surveys = [] }) {
  return (
    <div className="min-h-screen w-full bg-[#f0faff] p-4 sm:p-6 flex flex-col gap-6">

      {/* HEADER */}
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-bold text-gray-900">
          Survey Responses
        </h2>

        <p className="text-sm text-gray-500">
          Review survey submissions
        </p>
      </div>

      {/* EMPTY STATE */}
      {surveys.length === 0 ? (
        <div className="bg-white border rounded-lg p-10 text-center text-gray-400 shadow-sm">
          No surveys found.
        </div>
      ) : (
        <div className="flex flex-col gap-3">

          {surveys.map((survey) => (
            <div
              key={survey.id}
              className="bg-white border rounded-lg p-6 shadow-sm flex items-center justify-between min-h-[120px]"
            >

              {/* LEFT */}
              <div>
                <h2 className="font-semibold text-gray-800 text-base">
                  {survey.title}
                </h2>

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

              {/* BUTTON */}
              <button
                onClick={() =>
                  router.get(`/admin/survey-response/${survey.id}`)
                }
                className="border border-blue-400 hover:bg-blue-300/70 cursor-pointer text-blue-600 px-3 py-1.5 rounded-md text-xs font-medium"
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

AdminSurveyResponseIndex.layout = (page) => (
  <AdminLayout>{page}</AdminLayout>
);