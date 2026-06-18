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
}) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-3 rounded-xl shadow mb-4">
      
      <div className="relative w-full md:w-[250px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <Input
          placeholder="Search"
          className="pl-10"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="flex gap-2 w-full md:w-auto">
        <Select onValueChange={setYear} value={year}>
          <SelectTrigger className="h-10 w-full sm:w-[160px] bg-white">
            <SelectValue placeholder="All Years" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Years</SelectItem>
            {["2017-2018", "2018-2019", "2019-2020", "2020-2021", "2021-2022"].map((y) => (
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
            <SelectItem value="BSECE">BSECE</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}