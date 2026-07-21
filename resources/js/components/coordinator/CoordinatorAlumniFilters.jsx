import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function CoordinatorAlumniFilters({
  search,
  setSearch,
  year,
  setYear,
  course,
  setCourse,
  employment,
  setEmployment,
}) {
  const latestYear = new Date().getFullYear() - 1; // last completed academic year
  const yearOptions = Array.from({ length: latestYear - 1990 + 1 }, (_, i) => {
    const s = latestYear - i;
    return `${s}-${s + 1}`;
  });
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-3 rounded-xl shadow mb-4">
      
      {/* SEARCH */}
      <Input
        placeholder="Search"
        className="w-full md:w-[250px]"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* FILTERS */}
      <div className="grid grid-cols-2 gap-2 w-full sm:grid-cols-3 md:flex md:flex-row md:items-center md:w-auto">
        <Select onValueChange={setYear} value={year}>
          <SelectTrigger className="h-10 w-full md:w-[160px]">
            <SelectValue placeholder="All Years" />
          </SelectTrigger>
          <SelectContent className="max-h-48">
            <SelectItem value="all" className="h-12">All Years</SelectItem>
            {yearOptions.map((y) => (
              <SelectItem key={y} value={y}>{y}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select onValueChange={setCourse} value={course}>
          <SelectTrigger className="h-10 w-full md:w-[160px]">
            <SelectValue placeholder="All Courses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Courses</SelectItem>
            <SelectItem value="BSIT">BSIT</SelectItem>
            <SelectItem value="BSCpE">BSCpE</SelectItem>
            <SelectItem value="BSEcE">BSEcE</SelectItem>
          </SelectContent>
        </Select>

        <Select onValueChange={setEmployment} value={employment}>
          <SelectTrigger className="h-10 w-full col-span-2 sm:col-span-1 md:w-[150px]">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="Yes">Employed</SelectItem>
            <SelectItem value="No">Unemployed</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}