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
}) {
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
      <div className="flex gap-2 w-full md:w-auto">
        <Select onValueChange={setYear} value={year}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="All Years" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Years</SelectItem>
            {["2017-2018", "2018-2019", "2019-2020", "2020-2021" , "2021-2022"].map((y) => (
              <SelectItem key={y} value={y.toString()}>
                {y}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select onValueChange={setCourse} value={course}>
          <SelectTrigger className="w-full md:w-[180px]">
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