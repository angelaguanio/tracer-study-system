import React, { useState, useMemo } from "react";
import AdminLayout from "@/layouts/admin-layout";

import AdminAlumniCoordinatorTable from "@/components/AdminAlumniCoordinatorTable";
import AdminAlumniCoordinatorFilter from "@/components/AdminAlumniCoordinatorFilter";
import AdminAlumniCoordinatorForm from "@/components/AdminAlumniCoordinatorForm";
import AdminAlumniCoordinatorDeletePrompt from "@/components/AdminAlumniCoordinatorDeletePrompt";

export default function AdminAlumniCoordinator({ coordinators }) {

    const [search, setSearch] = useState("");
    const [courseFilter, setCourseFilter] = useState("all");

    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState(null);

    const [deleteTarget, setDeleteTarget] = useState(null);

    const filtered = useMemo(() => {
        return coordinators.filter((c) => {

            const fullName =
                `${c.first_name} ${c.last_name}`.toLowerCase();

            const matchSearch =
                fullName.includes(search.toLowerCase()) ||
                c.email?.toLowerCase().includes(search.toLowerCase());

            const matchCourse =
                courseFilter === "all" || c.department === courseFilter;

            return matchSearch && matchCourse;
        });
    }, [coordinators, search, courseFilter]);

    const courses = ["all", ...new Set(coordinators.map(c => c.department))];

    return (
        <div className="w-full h-full flex flex-col gap-4 p-4 md:p-6">

            <AdminAlumniCoordinatorFilter
                search={search}
                setSearch={setSearch}
                courseFilter={courseFilter}
                setCourseFilter={setCourseFilter}
                courses={courses}
                setEditing={setEditing}
                setShowForm={setShowForm}
            />

            <div className="flex-1 min-h-0">
                <AdminAlumniCoordinatorTable
                    data={filtered}
                    setEditing={setEditing}
                    setShowForm={setShowForm}
                    setDeleteTarget={setDeleteTarget}
                />
            </div>

            {showForm && (
                <AdminAlumniCoordinatorForm
                    editing={editing}
                    closeForm={() => {
                        setEditing(null);
                        setShowForm(false);
                    }}
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