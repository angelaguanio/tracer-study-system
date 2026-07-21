import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";

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

  return (
    <div className="flex flex-col gap-2.5 w-full bg-white p-4 rounded-2xl shadow-sm border border-gray-100 md:flex-row md:items-center md:gap-3 md:w-auto md:bg-transparent md:p-0 md:shadow-none md:border-0">

      {/* SEARCH FIELD */}
      <div className="relative w-full md:w-[220px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <Input
          placeholder="Search..."
          className="h-10 pl-10 bg-white border-gray-200 rounded-lg text-gray-700"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* SELECTS — 2-col on mobile (status spans full), flex row on md+ */}
      <div className="grid grid-cols-2 gap-2 w-full md:flex md:flex-row md:items-center md:w-auto">

        <Select value={course} onValueChange={(val) => setCourse(val)}>
          <SelectTrigger className="h-10 w-full md:w-[160px] bg-white border-gray-200 rounded-lg text-gray-700 text-xs sm:text-sm">
            <SelectValue placeholder="All Courses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Courses</SelectItem>
            <SelectItem value="BSIT">BSIT</SelectItem>
            <SelectItem value="BSCpE">BSCpE</SelectItem>
            <SelectItem value="BSEcE">BSEcE</SelectItem>
          </SelectContent>
        </Select>

        <Select value={year} onValueChange={(val) => setYear(val)}>
          <SelectTrigger className="h-10 w-full md:w-[160px] bg-white border-gray-200 rounded-lg text-gray-700 text-xs sm:text-sm">
            <SelectValue placeholder="All Years" />
          </SelectTrigger>
          <SelectContent className="max-h-48">
            <SelectItem value="all">All Years</SelectItem>
            {yearOptions.map((y) => (
              <SelectItem key={y} value={y}>{y}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={status} onValueChange={(val) => setStatus(val)}>
          <SelectTrigger className="h-10 w-full col-span-2 md:col-span-1 md:w-[160px] bg-white border-gray-200 rounded-lg text-gray-700 text-xs sm:text-sm">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="incomplete">Not Completed</SelectItem>
          </SelectContent>
        </Select>

      </div>
    </div>
  );
}
