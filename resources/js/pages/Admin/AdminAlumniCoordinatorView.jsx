import AdminLayout from "@/layouts/admin-layout";
import { Button } from "@/components/ui/button";
import { router } from "@inertiajs/react";
import {
    ArrowLeft,
    Mail,
    User,
} from "lucide-react";

export default function AdminAlumniCoordinatorView({
    coordinator,
}) {

    const getInitials = (first, last) => {
        return (
            ((first?.[0] || "") +
                (last?.[0] || "")).toUpperCase()
        );
    };

    return (
        <div className="h-full w-full bg-[#f3f9ff] flex flex-col overflow-hidden">

            <div className="flex-1 p-6 flex flex-col overflow-hidden">

                {/* BACK BUTTON */}
                <div className="mb-6">

                    <Button
                        onClick={() =>
                            router.visit(
                                "/admin/alumni-coordinators"
                            )
                        }
                        className="bg-blue-600 text-white hover:bg-blue-700 shadow-md rounded-md"
                    >
                        <ArrowLeft
                            size={18}
                            className="mr-2"
                        />

                        Back
                    </Button>

                </div>

                <div className="flex-1 flex justify-center items-center">

                    <div className="bg-white rounded-2xl w-full max-w-5xl shadow">

                        <div className="p-10">

                            {/* HEADER */}
                            <div className="flex items-center gap-6 border-b pb-8 mb-10">

                                {/* AVATAR */}
                                <div
                                    className="
                                        w-24 h-24 rounded-full
                                        bg-gradient-to-r from-blue-500 to-blue-700
                                        text-white flex items-center justify-center
                                        text-3xl font-bold shadow-lg
                                    "
                                >
                                    {getInitials(
                                        coordinator.first_name,
                                        coordinator.last_name
                                    )}
                                </div>

                                {/* NAME + STATUS */}
                                <div>

                                    <h1 className="text-3xl font-bold text-gray-800">
                                        {coordinator.first_name}{" "}
                                        {coordinator.middle_name &&
                                            coordinator.middle_name + " "}
                                        {coordinator.last_name}
                                    </h1>

                                    <div className="flex items-center gap-3 mt-2">

                                        <p className="text-gray-500">
                                            Alumni Coordinator
                                        </p>

                                        {/* STATUS BADGE */}
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                            coordinator.status === "inactive"
                                            ? "bg-red-100 text-red-700"
                                            : "bg-green-100 text-green-700"}`}>
                                                {coordinator.status
                                                ? coordinator.status.charAt(0).toUpperCase() +
                                                coordinator.status.slice(1): "Active"}
                                        </span>

                                    </div>

                                </div>

                            </div>

                            {/* INFO GRID */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                                {/* FULL NAME */}
                                <div className="bg-gray-50 p-5 rounded-xl shadow-sm">

                                    <p className="text-sm text-gray-500 mb-2">
                                        Full Name
                                    </p>

                                    <div className="flex items-center gap-2 text-gray-800 font-medium">

                                        <User size={16} />

                                        {coordinator.first_name}{" "}

                                        {coordinator.middle_name &&
                                            coordinator.middle_name + " "}

                                        {coordinator.last_name}

                                    </div>

                                </div>

                                {/* EMAIL */}
                                <div className="bg-gray-50 p-5 rounded-xl shadow-sm">

                                    <p className="text-sm text-gray-500 mb-2">
                                        Email
                                    </p>

                                    <div className="flex items-center gap-2 text-gray-800 font-medium">

                                        <Mail size={16} />

                                        {coordinator.email}

                                    </div>

                                </div>

                                {/* DEPARTMENT */}
                                <div className="bg-gray-50 p-5 rounded-xl shadow-sm">

                                    <p className="text-sm text-gray-500 mb-2">
                                        Department
                                    </p>

                                    <p className="text-gray-800 font-medium">
                                        {coordinator.department}
                                    </p>

                                </div>

                                {/* COURSE */}
                                <div className="bg-gray-50 p-5 rounded-xl shadow-sm">

                                    <p className="text-sm text-gray-500 mb-2">
                                        Course
                                    </p>

                                    <p className="text-gray-800 font-medium">
                                        {coordinator.courses}
                                    </p>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}

AdminAlumniCoordinatorView.layout = (page) => (
    <AdminLayout>{page}</AdminLayout>
);
