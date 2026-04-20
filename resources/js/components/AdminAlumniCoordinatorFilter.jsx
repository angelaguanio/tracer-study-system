export default function AdminAlumniCoordinatorFilter({
    search,
    setSearch,
    departmentFilter,
    setDepartmentFilter,
    courseFilter,
    setCourseFilter,
    setEditing,
    setShowForm
}) {
    return (
        <div className="bg-white rounded-xl shadow p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">

            {/* SEARCH */}
            <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search Alumni Coordinator..."
                className="w-full md:w-[250px] px-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-blue-400 outline-none"
            />

            {/* FILTERS + BUTTON */}
            <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto md:items-center">

                {/* DEPARTMENT */}
                <select
                    value={departmentFilter}
                    onChange={(e) => setDepartmentFilter(e.target.value)}
                    className="px-3 py-2 border rounded-md text-sm"
                >
                    <option value="all">All Department</option>
                    <option value="CECT">CECT</option>
                </select>

                {/* COURSE (KEEP LABEL BUT VALUE MUST MATCH DB FIELD) */}
                <select
                    value={courseFilter}
                    onChange={(e) => setCourseFilter(e.target.value)}
                    className="px-3 py-2 border rounded-md text-sm"
                >
                    <option value="all">All Courses</option>
                    <option value="BSIT">BSIT</option>
                    <option value="BSCpE">BSCpE</option>
                    <option value="BSEcE">BSEcE</option>
                </select>

                {/* ADD BUTTON */}
                <button
                    onClick={() => {
                        setEditing(null);
                        setShowForm(true);
                    }}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm"
                >
                    + Add Alumni Coordinator
                </button>

            </div>
        </div>
    );
}