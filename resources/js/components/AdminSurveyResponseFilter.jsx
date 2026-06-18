import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";

export default function AdminSurveyResponseFilter({
  search,
  setSearch,
  year,
  setYear,
  course,
  setCourse,
}) {
  const latestYear = new Date().getFullYear() - 1;
  const yearOptions = Array.from({ length: latestYear - 1990 + 1 }, (_, i) => {
    const s = latestYear - i;
    return `${s}-${s + 1}`;
  });
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
      <div className="flex flex-col sm:flex-row sm:items-center gap-2">

        {/* SEARCH */}
        <div className="relative w-full sm:w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <Input
            placeholder="Search..."
            className="h-10 pl-10 bg-white"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* COURSE */}
        <Select value={course} onValueChange={(val) => setCourse(val)}>
          <SelectTrigger className="h-10 w-full sm:w-[160px] bg-white">
            <SelectValue placeholder="All Courses" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">All Courses</SelectItem>
            <SelectItem value="BSIT">BSIT</SelectItem>
            <SelectItem value="BSCpE">BSCpE</SelectItem>
            <SelectItem value="BSECE">BSECE</SelectItem>
          </SelectContent>
        </Select>

        {/* YEAR */}
        <Select value={year} onValueChange={(val) => setYear(val)}>
          <SelectTrigger className="h-10 w-full sm:w-[160px] bg-white">
            <SelectValue placeholder="All Years" />
          </SelectTrigger>
          <SelectContent  className="max-h-48">
            <SelectItem value="all">All Years</SelectItem>
            {yearOptions.map((y) => (
              <SelectItem key={y} value={y}>
                {y}
              </SelectItem>
            ))}

          </SelectContent>
        </Select>

      </div>

    </div>
  );
}