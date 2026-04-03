import { useState } from "react";
import { router } from "@inertiajs/react";
import CoordinatorLayout from "@/layouts/coord-layout";
import CoordinatorAlumniFilters from "@/components/CoordinatorAlumniFilters";
import CoordinatorAlumniTable from "@/components/CoordinatorAlumniTable";

export default function CoordinatorAlumni({ alumni, filters }) {
  const [search, setSearch] = useState(filters.search || "");
  const [year, setYear] = useState(filters.year || "all");
  const [course, setCourse] = useState(filters.course || "all");

  // 🔥 SAMPLE DATA (PARA MAY OUTPUT AGAD)
  const sampleAlumni = {
    data: [
      { id: 1, name: "Angela Marie P. Guanio", course: "BSIT", year: 2018 },
      { id: 2, name: "Franzell M. Tatad", course: "BSCpE", year: 2021 },
      { id: 3, name: "Jay Mharie D. Atayde", course: "BSECE", year: 2020 },
      { id: 4, name: "Tiffany Joy G.Soria", course: "BSIT", year: 2019 },
      { id: 5, name: "Reygie A. Allapitan", course: "BSCpE", year: 2018 },
    ],
    links: [],
  };

  const applyFilters = (newFilters = {}) => {
    router.get("/coordinator/alumni", {
      search,
      year,
      course,
      ...newFilters,
    });
  };

  const displayAlumni = alumni?.data?.length ? alumni : sampleAlumni;

  return (
    <div className="min-h-screen w-full bg-[#C4EFFF]">
      <div className="p-4 md:p-6">
        <div className="bg-white rounded-2xl p-3 md:p-4 shadow-sm">

          <CoordinatorAlumniFilters
            search={search}
            setSearch={(val) => {
              setSearch(val);
              applyFilters({ search: val });
            }}
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

          <CoordinatorAlumniTable alumni={displayAlumni} />
        </div>
      </div>
    </div>
  );
}

CoordinatorAlumni.layout = (page) => (
  <CoordinatorLayout>{page}</CoordinatorLayout>
);