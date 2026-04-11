import { useState, useEffect } from "react";
import { router } from "@inertiajs/react";
import CoordinatorLayout from "@/layouts/coord-layout";
import CoordinatorAlumniFilters from "@/components/CoordinatorAlumniFilters";
import CoordinatorAlumniTable from "@/components/CoordinatorAlumniTable";

export default function CoordinatorAlumni({ alumni, filters }) {
  const [search, setSearch] = useState(filters.search || "");
  const [year, setYear] = useState(filters.year || "all");
  const [course, setCourse] = useState(filters.course || "all");

  const applyFilters = (newFilters = {}) => {
    router.get(
      "/coordinator/alumni",
      {
        search,
        year,
        course,
        ...newFilters,
      },
      {
        preserveState: true,
        replace: true,
      }
    );
  };

  // 🔥 AUTO SEARCH (debounce)
  useEffect(() => {
    const delay = setTimeout(() => {
      applyFilters();
    }, 500);

    return () => clearTimeout(delay);
  }, [search]);

  return (
    <div className="min-h-screen w-full bg-[#C4EFFF]">
      <div className="p-4 md:p-6">
        <div className="bg-white rounded-2xl p-3 md:p-4 shadow-sm">

          <CoordinatorAlumniFilters
            search={search}
            setSearch={setSearch}
            year={year}
            setYear={(val) => {
              setYear(val);
              applyFilters({ year: val });
            }}
            course={course}
            setCourse={(val) => {
              setCourse(val);
              applyFilters({ course: val });
            }}
          />

          <CoordinatorAlumniTable alumni={alumni} />
        </div>
      </div>
    </div>
  );
}

CoordinatorAlumni.layout = (page) => (
  <CoordinatorLayout>{page}</CoordinatorLayout>
);