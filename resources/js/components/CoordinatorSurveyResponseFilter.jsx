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
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full">
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
          <SelectContent>
            <SelectItem value="all">All Courses</SelectItem>
            <SelectItem value="BSIT">BSIT</SelectItem>
            <SelectItem value="BSCpE">BSCpE</SelectItem>
            <SelectItem value="BSECE">BSECE</SelectItem>
          </SelectContent>
        </Select>

        <Select value={year} onValueChange={(val) => setYear(val)}>
          <SelectTrigger className="h-10 w-full sm:w-[140px] bg-white">
            <SelectValue placeholder="All Years" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Years</SelectItem>
            {[2022, 2021, 2020, 2019, 2018].map((y) => (
              <SelectItem key={y} value={y.toString()}>
                {y}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

