import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";

export default function AdminAlumniCoordinatorFilter({
  search,
  setSearch,
  departmentFilter,
  setDepartmentFilter,
  courseFilter,
  setCourseFilter,
  setEditing,
  setShowForm,
}) {
  return (
    <div className="bg-white rounded-xl shadow p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
      
      {/* SEARCH */}
      <div className="w-full md:w-[250px] relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search Alumni Coordinator..."
          className="w-full pl-10 pr-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-blue-400 outline-none h-10"
        />
      </div>

      {/* FILTERS + BUTTON */}
      <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto md:items-center">
        
        {/* DEPARTMENT SELECT */}
        <Select 
          onValueChange={setDepartmentFilter} 
          value={departmentFilter}
        >
          <SelectTrigger className="h-10 w-full md:w-[160px] bg-white text-sm cursor-pointer">
            <SelectValue placeholder="All Department"  />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className='cursor-pointer'>All Department</SelectItem>
            <SelectItem value="CECT" className='cursor-pointer'>CECT</SelectItem>
          </SelectContent>
        </Select>

        {/* COURSE SELECT */}
        <Select 
          onValueChange={setCourseFilter} 
          value={courseFilter}
        >
          <SelectTrigger className="h-10 w-full md:w-[160px] bg-white text-sm cursor-pointer">
            <SelectValue placeholder="All Courses" />
          </SelectTrigger>
          <SelectContent >
            <SelectItem value="all" className='cursor-pointer'>All Courses</SelectItem>
            <SelectItem value="BSIT" className='cursor-pointer'>BSIT</SelectItem>
            <SelectItem value="BSCpE" className='cursor-pointer'>BSCpE</SelectItem>
            <SelectItem value="BSEcE" className='cursor-pointer'>BSEcE</SelectItem>
          </SelectContent>
        </Select>

        {/* ADD BUTTON */}
        <Button
          onClick={() => {
            setEditing(null);
            setShowForm(true);
          }}
          className="bg-green-600 hover:bg-green-700 text-white h-10 flex items-center gap-2"
        >
          <Plus size={16} />
          Add Alumni Coordinator
        </Button>

      </div>
    </div>
  );
}