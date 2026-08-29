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
        /* Pinanatili ang overflow-y-auto pero optimized na ang laman para kasya agad */
        <div className="h-full w-full bg-[#f3f9ff] flex flex-col overflow-y-auto md:overflow-hidden">

            <div className="flex-1 p-4 md:p-6 flex flex-col min-h-0">

                {/* BACK BUTTON - Original style */}
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

                {/* Main Content Wrapper - FIXED: 'pt-12 md:pt-24' para sa "medyo gitna" na bagsak */}
                <div className="flex-1 flex justify-center items-start pt-12 md:pt-24">

                    {/* ORIGINAL CARD STYLE */}
                    <div className="bg-white rounded-2xl w-full max-w-5xl shadow mb-6 md:mb-0">

                        <div className="p-5 md:p-10">

                            {/* HEADER - Pinanatiling magkatabi (flex-row) kahit sa mobile para tipid sa space */}
                            <div className="flex flex-row items-center text-left gap-4 md:gap-6 border-b pb-6 md:pb-8 mb-6 md:mb-10">

                                {/* ORIGINAL ROUNDED AVATAR - scaled down for mobile to save view height */}
                                <div
                                    className="
                                        w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full
                                        bg-gradient-to-r from-blue-500 to-blue-700
                                        text-white flex items-center justify-center
                                        text-xl sm:text-2xl md:text-3xl font-bold shadow-lg shrink-0
                                    "
                                >
                                    {getInitials(
                                        coordinator.first_name,
                                        coordinator.last_name
                                    )}
                                </div>

                                {/* NAME + STATUS */}
                                <div className="flex flex-col items-start min-w-0 w-full">

                                    <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 break-words w-full text-left">
                                        {coordinator.first_name}{" "}
                                        {coordinator.middle_name &&
                                            coordinator.middle_name + " "}
                                        {coordinator.last_name}
                                    </h1>

                                    <div className="mt-1 md:mt-2">
                                        <div className="flex flex-wrap items-center justify-start gap-2 md:gap-3">
                                            <p className="text-gray-500 text-xs sm:text-sm md:text-base">
                                                Alumni Coordinator
                                            </p>

                                            {/* ORIGINAL STATUS BADGE */}
                                            <span
                                                className={`px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-medium shrink-0 ${
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
                                        <p className="text-[11px] sm:text-xs md:text-sm text-gray-600 font-medium mt-1 text-left">
                                            {coordinator.start_year &&
                                            coordinator.end_year
                                                ? `${coordinator.start_year} - ${coordinator.end_year}`
                                                : "No Year Assigned"}
                                        </p>
                                    </div>

                                </div>

                            </div>

                            {/* ORIGINAL INFO GRID - Ginawang 2 columns (grid-cols-2) kahit sa mobile */}
                            <div className="grid grid-cols-2 gap-3 md:gap-6">

                                {/* FULL NAME */}
                                <div className="bg-gray-50 p-3.5 md:p-5 rounded-xl shadow-sm">
                                    <p className="text-[10px] md:text-xs text-gray-500 mb-1">
                                        Full Name
                                    </p>
                                    <div className="flex items-center gap-2 text-gray-800 font-medium text-xs md:text-base break-words">
                                        <User size={14} className="text-gray-400 shrink-0" />
                                        <span className="truncate">
                                            {coordinator.first_name} {coordinator.last_name}{coordinator.suffix ? ' ' + coordinator.suffix : ''}
                                        </span>
                                    </div>
                                </div>

                                {/* EMAIL */}
                                <div className="bg-gray-50 p-3.5 md:p-5 rounded-xl shadow-sm min-w-0">
                                    <p className="text-[10px] md:text-xs text-gray-500 mb-1">
                                        Email
                                    </p>
                                    <div className="flex items-center gap-2 text-gray-800 font-medium text-xs md:text-base min-w-0">
                                        <Mail size={14} className="text-gray-400 shrink-0" />
                                        <span className="truncate w-full" title={coordinator.email}>
                                            {coordinator.email}
                                        </span>
                                    </div>
                                </div>

                                {/* DEPARTMENT */}
                                <div className="bg-gray-50 p-3.5 md:p-5 rounded-xl shadow-sm">
                                    <p className="text-[10px] md:text-xs text-gray-500 mb-1">
                                        Department
                                    </p>
                                    <p className="text-gray-800 font-medium text-xs md:text-base truncate">
                                        {coordinator.department}
                                    </p>
                                </div>

                                {/* COURSE */}
                                <div className="bg-gray-50 p-3.5 md:p-5 rounded-xl shadow-sm">
                                    <p className="text-[10px] md:text-xs text-gray-500 mb-1">
                                        Program
                                    </p>
                                    <p className="text-gray-800 font-medium text-xs md:text-base truncate">
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