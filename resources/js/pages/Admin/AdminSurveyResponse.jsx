import { useState, useEffect } from "react";
import { router } from "@inertiajs/react";
import { Check } from "lucide-react";

import AdminSurveyDeletePrompt from "@/components/AdminSurveyDeletePrompt";
import AdminSurveyResponseTable from "@/components/AdminSurveyResponseTable";
import AdminSurveyResponseFilter from "@/components/AdminSurveyResponseFilter";
import AdminLayout from "@/layouts/admin-layout";

export default function AdminSurveyResponse({ responses, filters }) {

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
        "/admin/survey-response",
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

  const confirmDelete = () => {
    if (!deleteId) return;

    router.delete(`/admin/survey-response/${deleteId}`, {
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
    <div className="w-full p-3 md:p-4">

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

            {/* SOLID GREEN CIRCLE + WHITE CHECK */}
            <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center shadow-md">
              <Check className="text-white w-9 h-9 stroke-[3]" />
            </div>

            {/* TEXT */}
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