import React, { useEffect, useState } from "react";
import { useForm } from "@inertiajs/react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export default function AdminAlumniCoordinatorForm({ editing, closeForm }) {
    const [showPassword, setShowPassword] = useState(false);
    
    const { data, setData, post, put, reset, errors, processing } = useForm({
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
            console.log("Loading editing data:", editing);
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
    }, [editing?.id]);

    // SUBMIT
    const submit = (e) => {
        e.preventDefault();

        console.log("Submitting form data:", data);

        if (editing) {
            put(`/admin/alumni-coordinators/${editing.id}`, {
                preserveScroll: true,
                preserveState: false,

                onSuccess: () => {
                    toast.success("Coordinator updated successfully!");
                    reset();
                    closeForm();
                },

                onError: (errors) => {
                    console.error("Update failed:", errors);
                    toast.error("Failed to update coordinator. Please check the form.");
                },
            });
        } else {
            post("/admin/alumni-coordinators", {
                preserveScroll: true,

                onSuccess: () => {
                    toast.success("Coordinator created successfully!");
                    reset();
                    closeForm();
                },

                onError: (errors) => {
                    console.error("Create failed:", errors);
                    toast.error("Failed to create coordinator. Please check the form.");
                },
            });
        }
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden px-2">

                <div className="px-8 pt-8 pb-5 text-black">
                    <h2 className="text-lg font-semibold">
                        {editing ? "Edit Coordinator" : "Add Coordinator"}
                    </h2>
                </div>

                <hr />

                <form onSubmit={submit} className="p-6 space-y-5">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">First Name</label>
                            <Input
                                value={data.first_name}
                                onChange={(e) => setData("first_name", e.target.value)}
                            />
                            {errors.first_name && (
                                <p className="text-red-500 text-xs">{errors.first_name}</p>
                            )}
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">Last Name</label>
                            <Input
                                value={data.last_name}
                                onChange={(e) => setData("last_name", e.target.value)}
                            />
                            {errors.last_name && (
                                <p className="text-red-500 text-xs">{errors.last_name}</p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">Middle Name</label>
                            <Input
                                value={data.middle_name}
                                onChange={(e) => setData("middle_name", e.target.value)}
                                placeholder="Optional"
                            />
                            {errors.middle_name && (
                                <p className="text-red-500 text-xs">{errors.middle_name}</p>
                            )}
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">Email Address</label>
                            <Input
                                type="email"
                                value={data.email}
                                onChange={(e) => setData("email", e.target.value)}
                            />
                            {errors.email && (
                                <p className="text-red-500 text-xs">{errors.email}</p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">Department</label>
                            <Select
                                value={data.department}
                                onValueChange={(val) => setData("department", val)}
                            >
                                <SelectTrigger className="w-full bg-white">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="CECT">CECT</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">Assigned Course</label>
                            <Select
                                value={data.courses || undefined}
                                onValueChange={(val) => setData("courses", val)}
                            >
                                <SelectTrigger className="w-full bg-white">
                                    <SelectValue placeholder="Select a course">
                                        {data.courses || "Select a course"}
                                    </SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="BSIT">BSIT</SelectItem>
                                    <SelectItem value="BSCpE">BSCpE</SelectItem>
                                    <SelectItem value="BSEcE">BSEcE</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.courses && (
                                <p className="text-red-500 text-xs">{errors.courses}</p>
                            )}
                            {data.courses && (
                                <p className="text-xs text-gray-500">Current: {data.courses}</p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-1 pt-4">
                        <label className="text-sm font-medium text-gray-700">
                            {editing ? "Reset Password (Leave blank to keep current)" : "Password"}
                        </label>
                        <div className="relative">
                            <Input
                                type={showPassword ? "text" : "password"}
                                value={data.password}
                                onChange={(e) => setData("password", e.target.value)}
                                required={!editing}
                                className="pr-10"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                        {errors.password && (
                            <p className="text-red-500 text-xs">{errors.password}</p>
                        )}
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={closeForm}
                            disabled={processing}
                        >
                            Cancel
                        </Button>

                        <Button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white px-8"
                            disabled={processing}
                        >
                            {processing ? "Saving..." : editing ? "Update Changes" : "Save Coordinator"}
                        </Button>
                    </div>

                </form>
            </div>
        </div>
    );
}