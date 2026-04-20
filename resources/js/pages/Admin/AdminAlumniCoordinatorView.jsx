import AdminLayout from "@/layouts/admin-layout";
import { Button } from "@/components/ui/button";
import { router } from "@inertiajs/react";
import { ArrowLeft, Mail, User } from "lucide-react";

export default function AdminAlumniCoordinatorView({ coordinator }) {

    const getInitials = (first, last) => {
        return ((first?.[0] || "") + (last?.[0] || "")).toUpperCase();
    };

    return (
        <div className="h-full w-full bg-[#f3f9ff] flex flex-col overflow-hidden">

            {/* PAGE WRAPPER */}
            <div className="flex-1 p-6 flex flex-col overflow-hidden">

                {/* BACK BUTTON */}
                <div className="mb-6">
                    <Button
                        onClick={() => router.visit("/admin/alumni-coordinators")}
                        className="bg-blue-600 text-white hover:bg-blue-700 shadow-md rounded-md"
                    >
                        <ArrowLeft size={18} className="mr-2" />
                        Back
                    </Button>
                </div>

                {/* CENTER AREA (FIXED CENTERING) */}
                <div className="flex-1 flex justify-center items-center overflow-hidden">

                    {/* CARD */}
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-7xl">

                        <div className="p-12">

                            {/* HEADER */}
                            <div className="flex items-center gap-6 border-b pb-8 mb-10">

                                <div className="w-28 h-28 rounded-full bg-gradient-to-r from-blue-500 to-blue-700 
                                                text-white flex items-center justify-center text-4xl font-bold shadow-lg">
                                    {getInitials(coordinator.first_name, coordinator.last_name)}
                                </div>

                                <div>
                                    <h1 className="text-4xl font-bold text-gray-800">
                                        {coordinator.first_name} {coordinator.last_name}
                                    </h1>
                                    <p className="text-gray-500 mt-2 text-lg">
                                        Alumni Coordinator
                                    </p>
                                </div>

                            </div>

                            {/* INFO GRID */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-lg">

                                {/* FULL NAME */}
                                <div className="bg-gray-50 p-6 rounded-xl shadow-sm">
                                    <p className="text-sm text-gray-500 mb-3">Full Name</p>
                                    <div className="flex items-center gap-3 text-gray-800 font-medium">
                                        <User size={18} />
                                        {coordinator.first_name}{" "}
                                        {coordinator.middle_name}{" "}
                                        {coordinator.last_name}
                                    </div>
                                </div>

                                {/* EMAIL */}
                                <div className="bg-gray-50 p-6 rounded-xl shadow-sm">
                                    <p className="text-sm text-gray-500 mb-3">Email Address</p>
                                    <div className="flex items-center gap-3 text-gray-800 font-medium">
                                        <Mail size={18} />
                                        {coordinator.email}
                                    </div>
                                </div>

                                {/* COURSE */}
                                <div className="bg-gray-50 p-6 rounded-xl shadow-sm md:col-span-2">
                                    <p className="text-sm text-gray-500 mb-3">Course / Department</p>
                                    <p className="text-gray-800 font-medium">
                                        {coordinator.department}
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