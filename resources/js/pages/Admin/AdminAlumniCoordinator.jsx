import React, { useState, useMemo } from "react";
import AdminLayout from "@/layouts/admin-layout";

import AdminAlumniCoordinatorTable from "@/components/AdminAlumniCoordinatorTable";
import AdminAlumniCoordinatorFilter from "@/components/AdminAlumniCoordinatorFilter";
import AdminAlumniCoordinatorForm from "@/components/AdminAlumniCoordinatorForm";
import AdminAlumniCoordinatorDeletePrompt from "@/components/AdminAlumniCoordinatorDeletePrompt";

export default function AdminAlumniCoordinator({ coordinators }) {

    const [search, setSearch] = useState("");
    const [departmentFilter, setDepartmentFilter] = useState("all");
    const [courseFilter, setCourseFilter] = useState("all");

    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);

    // ========================
    // FILTER (UNCHANGED BUT CLEAN)
    // ========================
    const filtered = useMemo(() => {
        return coordinators.filter((c) => {

            const searchValue = search.toLowerCase().trim();

            const fullName = `${c.first_name || ""} ${c.middle_name || ""} ${c.last_name || ""}`
                .toLowerCase()
                .replace(/\s+/g, " ")
                .trim();

            const email = c.email?.toLowerCase() || "";

            const matchSearch =
                searchValue === "" ||
                fullName.includes(searchValue) ||
                email.includes(searchValue);

            const matchDepartment =
                departmentFilter === "all" ||
                c.department === departmentFilter;

            const matchCourse =
                courseFilter === "all" ||
                c.courses === courseFilter;

            return matchSearch && matchDepartment && matchCourse;
        });
    }, [coordinators, search, departmentFilter, courseFilter]);

    // ========================
    // FIXED CLOSE HANDLER (IMPORTANT)
    // ========================
    const closeForm = () => {
        setShowForm(false);

        //  CRITICAL FIX: reset AFTER modal closes
        setTimeout(() => {
            setEditing(null);
        }, 0);
    };

    return (
        <div className="w-full h-full flex flex-col gap-4 p-4 md:p-6 overflow-hidden">

            <AdminAlumniCoordinatorFilter
                search={search}
                setSearch={setSearch}
                departmentFilter={departmentFilter}
                setDepartmentFilter={setDepartmentFilter}
                courseFilter={courseFilter}
                setCourseFilter={setCourseFilter}
                setEditing={setEditing}
                setShowForm={setShowForm}
            />

            <div className="flex-1 min-h-0 flex flex-col">
                <AdminAlumniCoordinatorTable
                    data={filtered}
                    setEditing={setEditing}
                    setShowForm={setShowForm}
                    setDeleteTarget={setDeleteTarget}
                />
            </div>

            {/* ======================== */}
            {/* MODAL (FIXED CONTROL FLOW) */}
            {/* ======================== */}
            {showForm && (
                <AdminAlumniCoordinatorForm
                    editing={editing}
                    closeForm={closeForm}
                />
            )}

            <AdminAlumniCoordinatorDeletePrompt
                open={!!deleteTarget}
                coordinator={deleteTarget}
                onClose={() => setDeleteTarget(null)}
            />

        </div>
    );
}

AdminAlumniCoordinator.layout = (page) => (
    <AdminLayout>{page}</AdminLayout>
);