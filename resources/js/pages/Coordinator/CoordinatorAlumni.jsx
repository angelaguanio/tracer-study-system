import { useState, useEffect, useRef } from "react";
import { router } from "@inertiajs/react";
import CoordinatorLayout from "@/layouts/coord-layout";
import CoordinatorAlumniFilters from "@/components/CoordinatorAlumniFilters";
import CoordinatorAlumniTable from "@/components/CoordinatorAlumniTable";

export default function CoordinatorAlumni({ alumni, filters }) {
  const [search, setSearch] = useState(filters.search || "");
  const [year, setYear] = useState(filters.year || "all");
  const [course, setCourse] = useState(filters.course || "all");
  const isFirstRender = useRef(true);

  const applyFilters = (params = {}) => {
    router.get("/coordinator/alumni", 
      { search, year, course, page: 1, ...params }, 
      { preserveState: true, replace: true }
    );
  };

  const handleView = (id) => {
    router.visit(route("coordinator.alumni.show", id));
  };

  useEffect(() => {
    if (isFirstRender.current) { isFirstRender.current = false; return; }
    const delay = setTimeout(() => applyFilters(), 500);
    return () => clearTimeout(delay);
  }, [search]);

  return (
    <div className="w-full h-full flex flex-col p-4 gap-4 overflow-hidden">
      <div className="shrink-0">
        <CoordinatorAlumniFilters 
          search={search} setSearch={setSearch} 
          year={year} setYear={(v) => {setYear(v); applyFilters({year: v})}} 
          course={course} setCourse={(v) => {setCourse(v); applyFilters({course: v})}} 
        />
      </div>

      <div className="flex-1 min-h-0 flex flex-col">
        <CoordinatorAlumniTable alumni={alumni} onView={handleView} />
      </div>
    </div>
  );
}

CoordinatorAlumni.layout = (page) => <CoordinatorLayout>{page}</CoordinatorLayout>;