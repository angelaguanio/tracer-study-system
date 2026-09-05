import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Search, ListFilter } from "lucide-react";

export default function CoordinatorSurveyResponseFilter({
  search,
  setSearch,
  year,
  setYear,
  course,
  setCourse,
  status,
  setStatus,
}) {
  const latestYear = new Date().getFullYear() - 1;
  const yearOptions = Array.from({ length: latestYear - 1990 + 1 }, (_, i) => {
    const s = latestYear - i;
    return `${s}-${s + 1}`;
  });

  const [isOpen, setIsOpen] = useState(false);
  const filterRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (filterRef.current && !filterRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const activeFiltersCount = [
    course !== "all" ? 1 : 0,
    year !== "all" ? 1 : 0,
    status !== "all" ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  return (
    <div className="flex flex-col gap-2.5 w-full bg-white p-4 rounded-2xl shadow-sm border border-gray-100 md:flex-row md:items-center md:gap-3 md:w-auto md:bg-transparent md:p-0 md:shadow-none md:border-0 relative">
      
      {/* SEARCH FIELD */}
      <div className="relative w-full md:w-[260px] flex-shrink-0">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <Input
          placeholder="Search..."
          className="h-10 pl-10 bg-white border-gray-200 rounded-lg text-gray-700"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* FILTER BUTTON */}
      <div ref={filterRef} className="relative self-end md:self-auto">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`h-10 w-10 flex items-center justify-center rounded-lg border transition-colors relative ${
            isOpen || activeFiltersCount > 0
              ? "bg-blue-50 border-blue-200 text-blue-700"
              : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
          }`}
        >
          <ListFilter size={18} />
          {activeFiltersCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center border-2 border-white">
              {activeFiltersCount}
            </span>
          )}
        </button>

        {/* FILTER DROPDOWN CONTENT */}
        {isOpen && (
          <div className="absolute top-12 right-0 w-[220px] bg-white rounded-xl shadow-lg border border-gray-100 py-3 z-50 flex flex-col">
            
            <div className="flex items-center justify-between px-4 pb-2 border-b border-gray-100 mb-2">
              <h4 className="text-sm font-semibold text-gray-800">Filters</h4>
              {activeFiltersCount > 0 && (
                <button
                  onClick={() => {
                    setCourse("all");
                    setYear("all");
                    setStatus("all");
                  }}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700"
                >
                  Clear all
                </button>
              )}
            </div>

            <div className="flex flex-col px-2 space-y-4">
              
              {/* Course */}
              <div className="flex flex-col">
                <div className="text-xs font-semibold text-gray-800 px-2 mb-1">Course</div>
                <div className="flex flex-col">
                  {['all', 'BSIT', 'BSCpE', 'BSEcE', 'BSCS'].map(c => (
                    <button
                      key={c}
                      onClick={() => setCourse(c)}
                      className="flex items-center gap-2 px-2 py-1.5 hover:bg-gray-50 rounded-md text-sm text-gray-700 text-left"
                    >
                      <span className="w-4 flex justify-center text-lg leading-none">
                        {course === c ? '•' : ''}
                      </span>
                      {c === 'all' ? 'All Courses' : c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Year */}
              <div className="flex flex-col">
                <div className="text-xs font-semibold text-gray-800 px-2 mb-1">Year</div>
                <div className="flex flex-col max-h-40 overflow-y-auto border-y border-gray-50 py-1 bg-gray-50/30 rounded-md">
                  <button
                    onClick={() => setYear('all')}
                    className="flex items-center gap-2 px-2 py-1.5 hover:bg-gray-100 rounded-md text-sm text-gray-700 text-left shrink-0"
                  >
                    <span className="w-4 flex justify-center text-lg leading-none">
                      {year === 'all' ? '•' : ''}
                    </span>
                    All Years
                  </button>
                  {yearOptions.map(y => (
                    <button
                      key={y}
                      onClick={() => setYear(y)}
                      className="flex items-center gap-2 px-2 py-1.5 hover:bg-gray-100 rounded-md text-sm text-gray-700 text-left shrink-0"
                    >
                      <span className="w-4 flex justify-center text-lg leading-none">
                        {year === y ? '•' : ''}
                      </span>
                      {y}
                    </button>
                  ))}
                </div>
              </div>

              {/* Remarks */}
              <div className="flex flex-col">
                <div className="text-xs font-semibold text-gray-800 px-2 mb-1">Remarks</div>
                <div className="flex flex-col">
                  {[
                    { val: 'all', label: 'All Remarks' },
                    { val: 'completed', label: 'Completed' },
                    { val: 'incomplete', label: 'Not Completed' },
                  ].map(r => (
                    <button
                      key={r.val}
                      onClick={() => setStatus(r.val)}
                      className="flex items-center gap-2 px-2 py-1.5 hover:bg-gray-50 rounded-md text-sm text-gray-700 text-left"
                    >
                      <span className="w-4 flex justify-center text-lg leading-none">
                        {status === r.val ? '•' : ''}
                      </span>
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

          </div>
        )}
      </div>

    </div>
  );
}
