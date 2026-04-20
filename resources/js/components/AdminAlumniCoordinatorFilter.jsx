import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function AdminAlumniCoordinatorFilter({
    search,
    setSearch,
    courseFilter,
    setCourseFilter,
    setEditing,
    setShowForm
}) {
    return (
        <div className="bg-white rounded-xl shadow p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">

            {/* SEARCH */}
            <Input
                placeholder="Search Alumni Coordinator"
                className="w-full md:w-[300px]"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            {/* RIGHT SIDE CONTROLS */}
            <div className="flex gap-2 md:items-center md:justify-end w-full md:w-auto">

                {/* FIXED COURSE FILTER */}
                <select
                    className="border rounded-md px-3 py-2 text-sm w-full md:w-[180px]"
                    value={courseFilter}
                    onChange={(e) => setCourseFilter(e.target.value)}
                >
                    <option value="all">All Courses</option>
                    <option value="BSIT">BSIT</option>
                    <option value="BSCpE">BSCpE</option>
                    <option value="BSECE">BSECE</option>
                </select>

                {/* ADD BUTTON */}
                <Button
                    onClick={() => {
                        setEditing(null);
                        setShowForm(true);
                    }}
                    className="bg-green-600 hover:bg-green-700 text-white whitespace-nowrap"
                >
                    + Add Alumni Coordinator
                </Button>

            </div>
        </div>
    );
}