import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";

export default function AdminAlumniFilters({
  search,
  setSearch,
  year,
  setYear,
  course,
  setCourse,
  employment,
  setEmployment,
}) {
  const latestYear = new Date().getFullYear() - 1;
  const yearOptions = Array.from({ length: latestYear - 1990 + 1 }, (_, i) => {
    const s = latestYear - i;
    return `${s}-${s + 1}`;
  });
  return (
    <div className="flex flex-col gap-2.5 bg-white p-3 rounded-xl shadow mb-4 md:flex-row md:items-center md:justify-between md:gap-3">
      
      <div className="relative w-full md:w-[250px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <Input
          placeholder="Search"
          className="pl-10"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-2 w-full md:flex md:flex-row md:items-center md:w-auto">

        <Select onValueChange={setYear} value={year}>
          <SelectTrigger className="h-10 w-full md:w-[160px] bg-white">
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

        <Select onValueChange={setCourse} value={course}>
          <SelectTrigger className="w-full md:w-[140px]">
            <SelectValue placeholder="All Courses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Courses</SelectItem>
            <SelectItem value="BSIT">BSIT</SelectItem>
            <SelectItem value="BSCpE">BSCpE</SelectItem>
            <SelectItem value="BSEcE">BSEcE</SelectItem>
            <SelectItem value="BSCS">BSCS</SelectItem>
          </SelectContent>
        </Select>

        <Select onValueChange={setEmployment} value={employment}>
          <SelectTrigger className="w-full col-span-2 md:col-span-1 md:w-[150px]">
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