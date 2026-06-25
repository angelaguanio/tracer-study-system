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
        /* Pinahintulutan ang scroll gamit ang overflow-y-auto kapag maliit ang screen */
        <div className="h-full w-full bg-[#f3f9ff] flex flex-col overflow-y-auto md:overflow-hidden">

            {/* dynamic padding base sa screen width (p-4 sa mobile, p-6 sa desktop) */}
            <div className="flex-1 p-4 md:p-6 flex flex-col min-h-0">

                {/* BACK BUTTON */}
                <div className="mb-4 md:mb-6">
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

                {/* Main Content Wrapper - Tinanggal ang items-center para hindi mag-shrink ang card sa mobile */}
                <div className="flex-1 flex justify-center items-start md:items-center">

                    <div className="bg-white rounded-2xl w-full max-w-5xl shadow mb-6 md:mb-0">

                        {/* Responsive Padding (p-5 sa mobile, p-10 sa desktop) */}
                        <div className="p-5 md:p-10">

                            {/* HEADER - flex-col sa mobile para magkasunod pababa, flex-row sa desktop */}
                            <div className="flex flex-col md:flex-row items-center text-center md:text-left gap-4 md:gap-6 border-b pb-6 md:pb-8 mb-6 md:mb-10">

                                {/* AVATAR - pinaliit nang kaunti sa mobile (w-20 h-20), lumalaki sa desktop (md:w-24 md:h-24) */}
                                <div
                                    className="
                                        w-20 h-20 md:w-24 md:h-24 rounded-full
                                        bg-gradient-to-r from-blue-500 to-blue-700
                                        text-white flex items-center justify-center
                                        text-2xl md:text-3xl font-bold shadow-lg shrink-0
                                    "
                                >
                                    {getInitials(
                                        coordinator.first_name,
                                        coordinator.last_name
                                    )}
                                </div>

                                {/* NAME + STATUS */}
                                <div className="flex flex-col items-center md:items-start min-w-0 w-full">

                                    {/* Responsive Text Size (text-2xl sa mobile, break-words para sa mahabang pangalan) */}
                                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800 break-words w-full text-center md:text-left">
                                        {coordinator.first_name}{" "}
                                        {coordinator.middle_name &&
                                            coordinator.middle_name + " "}
                                        {coordinator.last_name}
                                    </h1>

                                    <div className="mt-2">
                                        {/* ROLE + STATUS */}
                                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 md:gap-3">
                                            <p className="text-gray-500 text-sm md:text-base">
                                                Alumni Coordinator
                                            </p>

                                            {/* STATUS BADGE */}
                                            <span
                                                className={`px-3 py-0.5 md:py-1 rounded-full text-xs font-medium shrink-0 ${
                                                    coordinator.status === "inactive"
                                                        ? "bg-red-100 text-red-700"
                                                        : "bg-green-100 text-green-700"
                                                }`}
                                            >
                                                {coordinator.status
                                                    ? coordinator.status.charAt(0).toUpperCase() +
                                                      coordinator.status.slice(1)
                                                    : "Active"}
                                            </span>
                                        </div>

                                        {/* YEAR */}
                                        <p className="text-xs md:text-sm text-gray-600 font-medium mt-1.5 text-center md:text-left">
                                            {coordinator.start_year &&
                                            coordinator.end_year
                                                ? `${coordinator.start_year} - ${coordinator.end_year}`
                                                : "No Year Assigned"}
                                        </p>
                                    </div>

                                </div>

                            </div>

                            {/* INFO GRID - Awtomatikong 1 column sa mobile, 2 columns sa desktop (md:grid-cols-2) */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">

                                {/* FULL NAME */}
                                <div className="bg-gray-50 p-4 md:p-5 rounded-xl shadow-sm">
                                    <p className="text-xs text-gray-500 mb-1">
                                        Full Name
                                    </p>
                                    <div className="flex items-center gap-2 text-gray-800 font-medium text-sm md:text-base break-words">
                                        <User size={16} className="text-gray-400 shrink-0" />
                                        <span className="truncate">
                                            {coordinator.first_name}{" "}
                                            {coordinator.middle_name && coordinator.middle_name + " "}
                                            {coordinator.last_name}
                                        </span>
                                    </div>
                                </div>

                                {/* EMAIL */}
                                <div className="bg-gray-50 p-4 md:p-5 rounded-xl shadow-sm min-w-0">
                                    <p className="text-xs text-gray-500 mb-1">
                                        Email
                                    </p>
                                    <div className="flex items-center gap-2 text-gray-800 font-medium text-sm md:text-base min-w-0">
                                        <Mail size={16} className="text-gray-400 shrink-0" />
                                        {/* Ginawang truncate para hindi umapaw ang mahabang email address sa mobile */}
                                        <span className="truncate w-full" title={coordinator.email}>
                                            {coordinator.email}
                                        </span>
                                    </div>
                                </div>

                                {/* DEPARTMENT */}
                                <div className="bg-gray-50 p-4 md:p-5 rounded-xl shadow-sm">
                                    <p className="text-xs text-gray-500 mb-1">
                                        Department
                                    </p>
                                    <p className="text-gray-800 font-medium text-sm md:text-base">
                                        {coordinator.department}
                                    </p>
                                </div>

                                {/* COURSE */}
                                <div className="bg-gray-50 p-4 md:p-5 rounded-xl shadow-sm">
                                    <p className="text-xs text-gray-500 mb-1">
                                        Program
                                    </p>
                                    <p className="text-gray-800 font-medium text-sm md:text-base">
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