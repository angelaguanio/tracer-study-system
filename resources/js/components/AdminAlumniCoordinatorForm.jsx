import React, { useEffect } from "react";
import { useForm } from "@inertiajs/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function AdminAlumniCoordinatorForm({ editing, closeForm }) {

    const { data, setData, post, put, reset } = useForm({
        first_name: "",
        last_name: "",
        middle_name: "",
        email: "",
        department: "CECT",
        courses: "",
        password: "",
    });

    // LOAD DATA WHEN EDITING
    useEffect(() => {
        if (editing) {
            setData({
                first_name: editing.first_name || "",
                last_name: editing.last_name || "",
                middle_name: editing.middle_name || "",
                email: editing.email || "",
                department: editing.department || "CECT",
                courses: editing.courses || "",
                password: "",
            });
        } else {
            reset();
        }
    }, [editing]);

    // SUBMIT
    const submit = (e) => {
        e.preventDefault();

        // ISASARA AGAD ANG FORM PAGKAPINDOT PARA INSTANT FEEDBACK
        closeForm(); 

        const payload = {
            first_name: data.first_name,
            last_name: data.last_name,
            middle_name: data.middle_name,
            email: data.email,
            department: data.department,
            courses: data.courses,
        };

        // UPDATE
        if (editing) {
            put(`/admin/alumni-coordinators/${editing.id}`, payload, {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => {
                    reset();
                },
            });
        }

        // CREATE
        else {
            post("/admin/alumni-coordinators", {
                ...payload,
                password: data.password,
                preserveScroll: true,
                onSuccess: () => {
                    reset();
                },
            });
        }
    };

    return (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">

            <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden">

                {/* HEADER */}
                <div className="px-6 py-4 text-white bg-blue-600">
                    <h2 className="text-lg font-semibold">
                        {editing ? "Edit Coordinator" : "Add Coordinator"}
                    </h2>
                </div>

                <form onSubmit={submit} className="p-6 space-y-5">

                    {/* NAME (KATABI) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium">First Name</label>
                            <Input
                                value={data.first_name}
                                onChange={(e) => setData("first_name", e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium">Last Name</label>
                            <Input
                                value={data.last_name}
                                onChange={(e) => setData("last_name", e.target.value)}
                            />
                        </div>
                    </div>

                    {/* MIDDLE & EMAIL (KATABI) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium">Middle Name</label>
                            <Input
                                value={data.middle_name}
                                onChange={(e) => setData("middle_name", e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium">Email</label>
                            <Input
                                value={data.email}
                                onChange={(e) => setData("email", e.target.value)}
                            />
                        </div>
                    </div>

                    {/* DEPARTMENT & COURSE (KATABI) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium">Department</label>
                            <select
                                value={data.department}
                                onChange={(e) => setData("department", e.target.value)}
                                className="w-full border p-2 rounded-md h-10 text-sm"
                            >
                                <option value="CECT">CECT</option>
                            </select>
                        </div>

                        <div>
                            <label className="text-sm font-medium">Course</label>
                            <select
                                value={data.courses}
                                onChange={(e) => setData("courses", e.target.value)}
                                className="w-full border p-2 rounded-md h-10 text-sm"
                            >
                                <option value="">Select Course</option>
                                <option value="BSIT">BSIT</option>
                                <option value="BSCpE">BSCpE</option>
                                <option value="BSEcE">BSEcE</option>
                            </select>
                        </div>
                    </div>

                    {/* PASSWORD (CREATE ONLY) */}
                    {!editing && (
                        <div>
                            <label className="text-sm font-medium">Password</label>
                            <Input
                                type="password"
                                value={data.password}
                                onChange={(e) => setData("password", e.target.value)}
                            />
                        </div>
                    )}

                    {/* BUTTONS - INALIS ANG BORDER LINE PARA MALINIS */}
                    <div className="flex justify-end gap-3 pt-2">
                        <Button type="button" variant="outline" onClick={closeForm}>
                            Cancel
                        </Button>

                        <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                            {editing ? "Update" : "Save"}
                        </Button>
                    </div>

                </form>
            </div>
        </div>
    );
}