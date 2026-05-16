import { useState, useEffect } from "react";
import { router } from "@inertiajs/react";
import { Check, ArrowLeft } from "lucide-react";

import AdminSurveyDeletePrompt from "@/components/AdminSurveyDeletePrompt";
import AdminSurveyResponseTable from "@/components/AdminSurveyResponseTable";
import AdminSurveyResponseFilter from "@/components/AdminSurveyResponseFilter";
import AdminLayout from "@/layouts/admin-layout";

export default function AdminSurveyResponse({ responses, filters, survey }) {

  const [search, setSearch] = useState(filters?.search || "");
  const [year, setYear] = useState(filters?.year || "all");
  const [course, setCourse] = useState(filters?.course || "all");

  const [page, setPage] = useState(filters?.page || 1);

  const [deleteId, setDeleteId] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const [localResponses, setLocalResponses] = useState(responses.data || []);

  useEffect(() => {
    setLocalResponses(responses.data || []);
  }, [responses]);

  useEffect(() => {
    setPage(1);
  }, [search, year, course]);

  useEffect(() => {
    const delay = setTimeout(() => {
      router.get(
        `/admin/survey-response/${survey.id}`,
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
    router.get("/admin/survey-response");
  };

  const confirmDelete = () => {
    if (!deleteId) return;

    router.delete(`/admin/survey-response/${survey.id}/${deleteId}`, {
      preserveScroll: true,
      onSuccess: () => {
        setLocalResponses((prev) =>
          prev.filter((item) => item.id !== deleteId)
        );

        setDeleteId(null);
        setShowSuccess(true);

        setTimeout(() => setShowSuccess(false), 3000);
      },
    });
  };

  return (
    <div className="w-full p-4">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">

        <button
          onClick={handleBack}
          className="flex items-center gap-2 bg-[#0B63F6] text-white px-5 py-2.5 rounded-md hover:bg-blue-700 text-sm font-medium shadow cursor-pointer"
        >
          <ArrowLeft size={16} />
          Back
        </button>

        <h1 className="text-lg font-semibold text-gray-800">
          {survey.title}
        </h1>

      </div>

      {/* FILTER */}
      <AdminSurveyResponseFilter
        search={search}
        setSearch={setSearch}
        year={year}
        setYear={setYear}
        course={course}
        setCourse={setCourse}
      />

      {/* TABLE */}
      <AdminSurveyResponseTable
        responses={{ ...responses, data: localResponses }}
        page={page}
        setPage={setPage}
        onDelete={(res) => setDeleteId(res.id)}
        surveyId={survey.id}
      />

      {/* DELETE MODAL */}
      {deleteId && (
        <AdminSurveyDeletePrompt
          onCancel={() => setDeleteId(null)}
          onConfirm={confirmDelete}
        />
      )}

      {/* SUCCESS MODAL */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-[420px] rounded-xl p-10 shadow-xl text-center flex flex-col items-center gap-5">

            <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center shadow-md">
              <Check className="text-white w-9 h-9 stroke-[3]" />
            </div>

            <p className="text-gray-700 text-lg font-semibold">
              Deleted successfully
            </p>

          </div>
        </div>
      )}

    </div>
  );
}

AdminSurveyResponse.layout = (page) => <AdminLayout>{page}</AdminLayout>;