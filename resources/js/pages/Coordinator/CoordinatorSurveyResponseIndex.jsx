import React from "react";
import { router } from "@inertiajs/react";
import CoordinatorLayout from "@/layouts/coord-layout";

export default function CoordinatorSurveyResponseIndex({ surveys = [] }) {
  return (
    <div className="min-h-screen w-full bg-[#f0faff] p-4 sm:p-6 flex flex-col gap-6">
      {/* HEADER SECTION */}
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-bold text-gray-900">Survey Responses</h2>
        <p className="text-sm text-gray-500">Review survey submissions</p>
      </div>

      {/* SURVEY LIST SECTION */}
      {surveys.length === 0 ? (
        <div className="bg-white border rounded-lg p-10 text-center text-gray-400 shadow-sm">
          No surveys found.
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {surveys.map((survey) => (
            <div
              key={survey.id}
              className="bg-white border rounded-lg p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all hover:border-blue-200"
            >
              {/* SURVEY INFO */}
              <div className="flex-1">
                <h2 className="font-semibold text-gray-800 text-base">{survey.title}</h2>

                <div className="flex flex-wrap items-center gap-2 mt-1 text-sm text-gray-500">
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      survey.status === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {survey.status === "active" ? "Active" : "Inactive"}
                  </span>
                  <span>
                    {survey.sections_count} sections ·{" "}
                    {survey.created_at ? new Date(survey.created_at).toLocaleDateString() : "N/A"}
                  </span>
                </div>

                <p className="text-xs text-gray-400 mt-1">
                  Created by: <span className="font-medium text-gray-600">{survey.created_by}</span>
                </p>
              </div>

              {/* ACTION BUTTON */}
              <button
                onClick={() => router.get(`/coordinator/survey-response/${survey.id}`)}
                className="w-full sm:w-auto border border-blue-400 hover:bg-blue-50 cursor-pointer text-blue-600 px-4 py-2 rounded-md text-sm font-medium transition-colors"
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

// Layout wrapper
CoordinatorSurveyResponseIndex.layout = (page) => (
  <CoordinatorLayout>{page}</CoordinatorLayout>
);