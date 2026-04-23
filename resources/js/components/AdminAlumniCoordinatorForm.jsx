import React, { useEffect } from "react";
import { useForm } from "@inertiajs/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

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
        closeForm(); 

        const payload = {
            first_name: data.first_name,
            last_name: data.last_name,
            middle_name: data.middle_name,
            email: data.email,
            department: data.department,
            courses: data.courses,
        };

        if (editing) {
            put(`/admin/alumni-coordinators/${editing.id}`, payload, {
                preserveScroll: true,
                onSuccess: () => reset(),
            });
        } else {
            post("/admin/alumni-coordinators", {
                ...payload,
                password: data.password,
                preserveScroll: true,
                onSuccess: () => reset(),
            });
        }
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden px-2">

                {/* HEADER */}
                <div className="px-8 pt-8 pb-5 text-black">
                    <h2 className="text-lg font-semibold">
                        {editing ? "Edit Coordinator" : "Add Coordinator"}
                    </h2>
                </div>

                <hr/>
                
                <form onSubmit={submit} className="p-6 space-y-5">

                    {/* FIRST & LAST NAME */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">First Name</label>
                            <Input
                                value={data.first_name}
                                onChange={(e) => setData("first_name", e.target.value)}
                                placeholder="Enter first name"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">Last Name</label>
                            <Input
                                value={data.last_name}
                                onChange={(e) => setData("last_name", e.target.value)}
                                placeholder="Enter last name"
                            />
                        </div>
                    </div>

                    {/* MIDDLE & EMAIL */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">Middle Name</label>
                            <Input
                                value={data.middle_name}
                                onChange={(e) => setData("middle_name", e.target.value)}
                                placeholder="Optional"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">Email Address</label>
                            <Input
                                type="email"
                                value={data.email}
                                onChange={(e) => setData("email", e.target.value)}
                                placeholder="email@example.com"
                            />
                        </div>
                    </div>

                    {/* DEPARTMENT & COURSE (SHADCN SELECT) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">Department</label>
                            <Select 
                                value={data.department} 
                                onValueChange={(val) => setData("department", val)}
                            >
                                <SelectTrigger className="w-full bg-white">
                                    <SelectValue placeholder="Select Department" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="CECT">CECT</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">Assigned Course</label>
                            <Select 
                                value={data.courses} 
                                onValueChange={(val) => setData("courses", val)}
                            >
                                <SelectTrigger className="w-full bg-white">
                                    <SelectValue placeholder="Select Course" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="BSIT">BSIT</SelectItem>
                                    <SelectItem value="BSCpE">BSCpE</SelectItem>
                                    <SelectItem value="BSEcE">BSEcE</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* PASSWORD (CREATE ONLY) */}
                    {!editing && (
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">Password</label>
                            <Input
                                type="password"
                                value={data.password}
                                onChange={(e) => setData("password", e.target.value)}
                                placeholder="Create a password"
                            />
                        </div>
                    )}

                    {/* ACTIONS */}
                    <div className="flex justify-end gap-3 pt-4">
                        <Button type="button" variant="outline" onClick={closeForm}>
                            Cancel
                        </Button>
                        <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-8">
                            {editing ? "Update Changes" : "Save Coordinator"}
                        </Button>
                    </div>

                </form>
            </div>
        </div>
    );
}