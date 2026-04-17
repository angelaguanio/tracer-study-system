import { useState, useEffect, useRef } from "react";
import { router } from "@inertiajs/react";
import AdminLayout from "@/layouts/admin-layout";
import AdminAlumniFilters from "@/components/AdminAlumniFilters";
import AdminAlumniTable from "@/components/AdminAlumniTable";

export default function AdminAlumni({ alumni, filters }) {
  const [search, setSearch] = useState(filters.search || "");
  const [year, setYear] = useState(filters.year || "all");
  const [course, setCourse] = useState(filters.course || "all");
  const isFirstRender = useRef(true);

  const applyFilters = (params = {}) => {
    router.get(
      "/admin/alumni",
      {
        search,
        year,
        course,
        page: 1,
        ...params,
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
      applyFilters();
    }, 500);

    return () => clearTimeout(delay);
  }, [search]);

  useEffect(() => {
    if (!isFirstRender.current) {
      applyFilters();
    }
  }, [year, course]);

  return (
    <div className="w-full rounded-2xl p-3 md:p-4 shadow-sm">
      <AdminAlumniFilters
        search={search}
        setSearch={setSearch}
        year={year}
        setYear={setYear}
        course={course}
        setCourse={setCourse}
      />

      <AdminAlumniTable alumni={alumni} />
    </div>
  );
}

AdminAlumni.layout = (page) => <AdminLayout>{page}</AdminLayout>;