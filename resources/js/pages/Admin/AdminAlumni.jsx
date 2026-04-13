import { useState, useEffect } from "react";
import { router } from "@inertiajs/react";
import AdminLayout from "@/layouts/admin-layout";
import AdminAlumniFilters from "@/components/AdminAlumniFilters";
import AdminAlumniTable from "@/components/AdminAlumniTable";

export default function AdminAlumni({ alumni, filters }) {
  const [search, setSearch] = useState(filters.search || "");
  const [year, setYear] = useState(filters.year || "all");
  const [course, setCourse] = useState(filters.course || "all");

  const applyFilters = (newFilters = {}) => {
    router.get(
      "/admin/alumni",
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

  //  AUTO SEARCH (debounce)
  useEffect(() => {
    const delay = setTimeout(() => {
      applyFilters();
    }, 500);

    return () => clearTimeout(delay);
  }, [search]);

  return (
    
        <div className="w-full rounded-2xl p-3 md:p-4 shadow-sm">

          <AdminAlumniFilters
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

          <AdminAlumniTable alumni={alumni} />
        </div>
  
  );
}

AdminAlumni.layout = (page) => (
  <AdminLayout>{page}</AdminLayout>
);