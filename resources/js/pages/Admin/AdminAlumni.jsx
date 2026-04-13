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

  const applyFilters = (newFilters = {}) => {
    router.get(
      "/admin/alumni",
      {
        search,
        year,
        course,
        page: 1,
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
      applyFilters({ page: 1 });
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
          router.get(
            "/admin/alumni",
            {
              search,
              year: val,
              course,
              page: 1,
            },
            {
              preserveState: true,
              replace: true,
            }
          );
        }}
        course={course}
        setCourse={(val) => {
          setCourse(val);
          router.get(
            "/admin/alumni",
            {
              search,
              year,
              course: val,
              page: 1,
            },
            {
              preserveState: true,
              replace: true,
            }
          );
        }}
      />

      <AdminAlumniTable alumni={alumni} />
    </div>
  );
}

AdminAlumni.layout = (page) => <AdminLayout>{page}</AdminLayout>;