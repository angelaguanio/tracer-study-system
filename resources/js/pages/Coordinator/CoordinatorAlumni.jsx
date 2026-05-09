import { useState, useEffect, useRef } from "react"; // Idagdag ang useRef
import { router } from "@inertiajs/react";
import CoordinatorLayout from "@/layouts/coord-layout";
import CoordinatorAlumniFilters from "@/components/CoordinatorAlumniFilters";
import CoordinatorAlumniTable from "@/components/CoordinatorAlumniTable";

export default function CoordinatorAlumni({ alumni, filters }) {
  const [search, setSearch] = useState(filters.search || "");
  const [year, setYear] = useState(filters.year || "all");
  const [course, setCourse] = useState(filters.course || "all");
  
  // Gagamit tayo ng Ref para malaman kung "first render" pa lang
  const isFirstRender = useRef(true);

  const applyFilters = (newFilters = {}) => {
    router.get(
      "/coordinator/alumni",
      {
        search,
        year,
        course,
        // Kunin ang current page mula sa props para hindi mawala
        page: alumni.current_page, 
        ...newFilters,
      },
      {
        preserveState: true,
        replace: true,
      }
    );
  };

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const delay = setTimeout(() => {
      applyFilters({ search, page: 1 });
    }, 500);

    return () => clearTimeout(delay);
  }, [search]);

  return (
    <div className="w-full rounded-2xl p-3 md:p-4 shadow-sm">
      <CoordinatorAlumniFilters
        search={search}
        setSearch={setSearch}
        year={year}
        setYear={(val) => {
          setYear(val);
          applyFilters({ year: val, page: 1 });
        }}
        course={course}
        setCourse={(val) => {
          setCourse(val);
          applyFilters({ course: val, page: 1 });
        }}
      />

      <CoordinatorAlumniTable alumni={alumni} />
    </div>
  );
}

CoordinatorAlumni.layout = (page) => (
  <CoordinatorLayout>{page}</CoordinatorLayout>
);