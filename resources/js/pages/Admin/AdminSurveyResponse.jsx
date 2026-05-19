import { useState, useEffect } from "react";
import { router } from "@inertiajs/react";
import { ArrowLeft } from "lucide-react";

import AdminSurveyResponseTable from "@/components/AdminSurveyResponseTable";
import AdminSurveyResponseFilter from "@/components/AdminSurveyResponseFilter";
import AdminLayout from "@/layouts/admin-layout";

export default function AdminSurveyResponse({
  responses,
  filters,
  survey,
}) {
  const [search, setSearch] = useState(filters?.search || "");
  const [year, setYear] = useState(filters?.year || "all");
  const [course, setCourse] = useState(filters?.course || "all");
  const [page, setPage] = useState(filters?.page || 1);

  const [localResponses, setLocalResponses] = useState(
    responses?.data || []
  );

  useEffect(() => {
    setLocalResponses(responses?.data || []);
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

  return (
    // 🔥 ())
    <div className="w-full h-full p-4 flex flex-col overflow-hidden">

      {/* HEADER + FILTER AREA (IDENTICAL STRUCTURE) */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-5 py-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4 w-full">

        {/* BACK + TITLE */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handleBack}
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors shrink-0 p-1 rounded-md cursor-pointer"
          >
            <ArrowLeft size={24} className="stroke-[2]" />
          </button>

          <h1 className="text-xl font-bold text-gray-800 tracking-tight whitespace-nowrap">
            {survey.title}
          </h1>
        </div>

        {/* FILTER () */}
        <AdminSurveyResponseFilter
          search={search}
          setSearch={setSearch}
          year={year}
          setYear={setYear}
          course={course}
          setCourse={setCourse}
        />
      </div>

      {/* (NO DELETE PROP) */}
      <AdminSurveyResponseTable
        responses={{ ...responses, data: localResponses }}
        page={page}
        setPage={setPage}
        surveyId={survey.id}
      />

    </div>
  );
}

AdminSurveyResponse.layout = (page) => (
  <AdminLayout>{page}</AdminLayout>
);