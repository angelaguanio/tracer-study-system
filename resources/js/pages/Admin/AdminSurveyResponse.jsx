import { useState, useEffect } from "react";
import { router } from "@inertiajs/react";
import { ArrowLeft } from "lucide-react";

import AdminSurveyResponseTable from "@/components/admin/AdminSurveyResponseTable";
import AdminSurveyResponseFilter from "@/components/admin/AdminSurveyResponseFilter";
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
    <div className="w-full h-full p-4 flex flex-col overflow-hidden">

      {/* MOBILE: Hiwalay ang title card sa filter card (flex-col).
        DESKTOP: Pagsasamahin sa iisang mahabang card container (md:bg-white md:rounded-2xl md:shadow-sm md:border)
      */}
      <div className="flex flex-col gap-3 mb-4 w-full md:bg-white md:rounded-2xl md:shadow-sm md:border md:border-gray-100 md:px-5 md:py-4 md:flex-row md:items-center md:justify-between md:gap-4">

        {/* TITLE CARD (Para sa Mobile) -> Nagiging transparent at walang style sa Desktop */}
        <div className="flex items-center gap-3 shrink-0 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm md:p-0 md:border-0 md:shadow-none md:bg-transparent">
          <button
            onClick={handleBack}
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors shrink-0 p-1 rounded-md cursor-pointer"
          >
            <ArrowLeft size={24} className="stroke-[2]" />
          </button>

          <h1 className="lg:text-xl text-md font-bold text-gray-800 tracking-tight whitespace-nowrap line-clamp-2">
            {survey.title}
          </h1>
        </div>

        {/* FILTER COMPONENT */}
        <AdminSurveyResponseFilter
          search={search}
          setSearch={setSearch}
          year={year}
          setYear={setYear}
          course={course}
          setCourse={setCourse}
        />
      </div>

      {/* TABLE */}
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