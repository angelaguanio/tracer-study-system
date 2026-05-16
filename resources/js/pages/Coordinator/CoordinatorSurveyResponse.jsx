import { useState, useEffect } from "react";
import { router } from "@inertiajs/react";
import { Check, ArrowLeft } from "lucide-react";

import CoordinatorSurveyDeletePrompt from "@/components/CoordinatorSurveyDeletePrompt";
import CoordinatorSurveyResponseTable from "@/components/CoordinatorSurveyResponseTable";
import CoordinatorSurveyResponseFilter from "@/components/CoordinatorSurveyResponseFilter";
import CoordinatorLayout from "@/layouts/coord-layout";

export default function CoordinatorSurveyResponse({ responses, filters, survey }) {
  const [search, setSearch] = useState(filters?.search || "");
  const [year, setYear] = useState(filters?.year || "all");
  const [course, setCourse] = useState(filters?.course || "all");

  const [page, setPage] = useState(filters?.page || 1);

  const [localResponses, setLocalResponses] = useState(responses.data || []);

  // When parent route changes (page/filter), keep local state in sync
  useEffect(() => {
    setLocalResponses(responses.data || []);
  }, [responses]);

  useEffect(() => {
    setPage(1);
  }, [search, year, course]);

  useEffect(() => {
    const delay = setTimeout(() => {
      router.get(
        `/coordinator/survey-response/${survey.id}`,
        { search, year, course, page },
        {
          preserveState: true,
          replace: true,
          preserveScroll: true,
        }
      );
    }, 500);

    return () => clearTimeout(delay);
  }, [search, year, course, page]);

  const handleBack = () => {
    router.get("/coordinator/survey-response");
  };

  const [deleteId, setDeleteId] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const confirmDelete = () => {
    if (!deleteId) return;

    // delete route exists as: DELETE /survey-response/{surveyId}/{userId}
    // under coordinator group in routes/web.php
    router.delete(`/coordinator/survey-response/${survey.id}/${deleteId}`, {
      preserveScroll: true,
      onSuccess: () => {
        setLocalResponses((prev) => prev.filter((item) => item.id !== deleteId));
        setDeleteId(null);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      },
    });
  };

  return (
    <div className="w-full p-4">
      {/*  Title block at Filters sa iisang main flex element */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6 w-full">
        
        {/*  Back Button + Survey Title */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handleBack}
            className="text-gray-400 hover:text-gray-600 transition-colors shrink-0 p-1 rounded-md"
            title="Back"
          >
            <ArrowLeft size={24} className="stroke-[2]" />
          </button>

          <h1 className="text-xl font-bold text-gray-800 tracking-tight whitespace-nowrap">
            {survey.title}
          </h1>
        </div>

        <CoordinatorSurveyResponseFilter
          search={search}
          setSearch={setSearch}
          year={year}
          setYear={setYear}
          course={course}
          setCourse={setCourse}
        />
        
      </div>

      <CoordinatorSurveyResponseTable
        responses={{ ...responses, data: localResponses }}
        page={page}
        setPage={setPage}
        surveyId={survey.id}
        onDelete={(res) => setDeleteId(res.id)}
      />

      {deleteId && (
        <CoordinatorSurveyDeletePrompt
          onCancel={() => setDeleteId(null)}
          onConfirm={confirmDelete}
        />
      )}

      {showSuccess && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-[420px] rounded-xl p-10 shadow-xl text-center flex flex-col items-center gap-5">
            <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center shadow-md">
              <Check className="text-white w-9 h-9 stroke-[3]" />
            </div>
            <p className="text-gray-700 text-lg font-semibold">Deleted successfully</p>
          </div>
        </div>
      )}
    </div>
  );
}

CoordinatorSurveyResponse.layout = (page) => <CoordinatorLayout>{page}</CoordinatorLayout>;
