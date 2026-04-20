import React, { useEffect } from "react";
import { useForm } from "@inertiajs/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function AdminAlumniCoordinatorForm({ editing, closeForm }) {

    const { data, setData, post, put, reset } = useForm({
        first_name: "",
        last_name: "",
        email: "",
        department: "",
        password: "",
    });

    useEffect(() => {
        if (editing) {
            setData({
                first_name: editing.first_name || "",
                last_name: editing.last_name || "",
                email: editing.email || "",
                department: editing.department || "",
                password: "",
            });
        } else {
            reset();
        }
    }, [editing]);

    const submit = (e) => {
        e.preventDefault();

        if (editing) {
            put(`/admin/alumni-coordinators/${editing.id}`, {
                onSuccess: closeForm,
            });
        } else {
            post("/admin/alumni-coordinators", {
                onSuccess: closeForm,
            });
        }
    };

    return (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">

            {/* MODAL CARD */}
            <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden">

                {/* HEADER */}
                <div
                    className="px-6 py-4 text-white"
                    style={{ backgroundColor: "#1184E0" }}
                >
                    <h2 className="text-lg font-semibold">
                        {editing ? "Edit Coordinator" : "Add Coordinator"}
                    </h2>
                </div>

                {/* FORM BODY */}
                <form onSubmit={submit} className="p-6 space-y-5">

                    {/* NAME */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        <div>
                            <label className="text-sm text-gray-600">First Name</label>
                            <Input
                                value={data.first_name}
                                onChange={(e) => setData("first_name", e.target.value)}
                                className="mt-1 border-0 shadow-sm focus:ring-2 focus:ring-blue-400"
                            />
                        </div>

                        <div>
                            <label className="text-sm text-gray-600">Last Name</label>
                            <Input
                                value={data.last_name}
                                onChange={(e) => setData("last_name", e.target.value)}
                                className="mt-1 border-0 shadow-sm focus:ring-2 focus:ring-blue-400"
                            />
                        </div>

                    </div>

                    {/* EMAIL */}
                    <div>
                        <label className="text-sm text-gray-600">Email</label>
                        <Input
                            value={data.email}
                            onChange={(e) => setData("email", e.target.value)}
                            className="mt-1 border-0 shadow-sm focus:ring-2 focus:ring-blue-400"
                        />
                    </div>

                    {/* DEPARTMENT */}
                    <div>
                        <label className="text-sm text-gray-600">Department</label>
                        <Input
                            value={data.department}
                            onChange={(e) => setData("department", e.target.value)}
                            className="mt-1 border-0 shadow-sm focus:ring-2 focus:ring-blue-400"
                        />
                    </div>

                    {/* PASSWORD */}
                    {!editing && (
                        <div>
                            <label className="text-sm text-gray-600">Password</label>
                            <Input
                                type="password"
                                value={data.password}
                                onChange={(e) => setData("password", e.target.value)}
                                className="mt-1 border-0 shadow-sm focus:ring-2 focus:ring-blue-400"
                            />
                        </div>
                    )}

                    {/* ACTIONS */}
                    <div className="flex justify-end gap-3 pt-4">

                        <Button
                            type="button"
                            variant="outline"
                            onClick={closeForm}
                            className="border-0 shadow-sm hover:bg-gray-100"
                        >
                            Cancel
                        </Button>

                        <Button
                            className="text-white px-6 shadow-sm"
                            style={{ backgroundColor: "#1184E0" }}
                        >
                            {editing ? "Update" : "Save"}
                        </Button>

                    </div>

                </form>

            </div>
        </div>
    );
}