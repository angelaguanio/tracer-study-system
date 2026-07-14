import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
        <Input
          placeholder="Search..."
          className="h-10 w-full sm:w-[220px] bg-white"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <Select value={course} onValueChange={(val) => setCourse(val)}>
          <SelectTrigger className="h-10 w-full sm:w-[160px] bg-white">
            <SelectValue placeholder="All Courses" />
          </SelectTrigger>
          <SelectContent >
            <SelectItem value="all">All Courses</SelectItem>
            <SelectItem value="BSIT">BSIT</SelectItem>
            <SelectItem value="BSCpE">BSCpE</SelectItem>
            <SelectItem value="BSEcE">BSEcE</SelectItem>
          </SelectContent>
        </Select>

        <Select value={year} onValueChange={(val) => setYear(val)}>
          <SelectTrigger className="h-10 w-full sm:w-[160px] bg-white">
            <SelectValue placeholder="All Years" />
          </SelectTrigger>
          <SelectContent className="max-h-48">
            <SelectItem value="all">All Years</SelectItem>
            {yearOptions.map((y) => (
              <SelectItem key={y} value={y}>
                {y}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={status} onValueChange={(val) => setStatus(val)}>
          <SelectTrigger className="h-10 w-full sm:w-[160px] bg-white">
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

