import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { router } from "@inertiajs/react";

export default function CoordinatorSurveyResponseFilter({
  search,
  setSearch,
  year,
  setYear,
  course,
  setCourse,
}) {
  // We don't call router here because the parent page handles the debounced navigation.
  // This component only updates local state via setSearch/setYear/setCourse.
  const updateFilters = () => {};

  // NOTE: this filter is used inside CoordinatorSurveyResponse page,
  // where we already debounce+router.get().
  // To avoid mismatch, we perform local state updates only; the parent page will navigate.
  // This component simply mirrors the Admin UI.

  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 mb-3">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Survey Responses</h2>
        <p className="text-sm text-gray-500">Review survey submissions</p>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full md:w-auto">
        <Input
          placeholder="Search..."
          className="h-10 w-full sm:w-[220px] bg-white"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            // parent page will handle navigation via useEffect
          }}
        />

        <Select
          value={course}
          onValueChange={(val) => {
            setCourse(val);
          }}
        >
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

        <Select
          value={year}
          onValueChange={(val) => {
            setYear(val);
          }}
        >
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

