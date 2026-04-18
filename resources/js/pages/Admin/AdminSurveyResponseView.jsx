import { router } from "@inertiajs/react";
import { ArrowLeft, Eye, User } from "lucide-react";
import AdminLayout from "@/layouts/admin-layout";

export default function AdminSurveyResponseView({ response }) {

    const isCompleted = response?.status === "completed";

    const handleBack = () => {
        router.visit("/admin/survey-response");
    };

    // ================= INCOMPLETE VIEW =================
    if (!isCompleted) {
        return (
            <div className="min-h-screen bg-[#F3FAFF] px-6 lg:px-10 py-6 relative">

                {/* MESSAGE */}
                <div className="flex items-center justify-center min-h-[80vh]">
                    <p className="text-gray-600 font-bold text-lg max-w-md leading-relaxed text-center">
                        This user has not yet completed the survey
                    </p>
                </div>

                {/* BACK BUTTON (ALIGNED NEXT TO SIDEBAR) */}
                <div className="fixed bottom-6 left-[18rem] z-50">
                    <button
                        onClick={handleBack}
                        className="flex items-center gap-2 bg-[#0B63F6] text-white px-5 py-2.5 rounded-md hover:bg-blue-700 text-sm font-medium shadow"
                    >
                        <ArrowLeft size={16} />
                        Back
                    </button>
                </div>

            </div>
        );
    }

    // ================= COMPLETED VIEW =================
    return (
        <div className="bg-[#F3FAFF] min-h-screen w-full px-6 lg:px-10 py-6 relative">

            {/* HEADER */}
            <div className="flex items-center justify-between mb-6">

                <button
                    onClick={handleBack}
                    className="flex items-center gap-2 bg-[#0B63F6] text-white px-5 py-2.5 rounded-md hover:bg-blue-700 text-sm font-medium shadow"
                >
                    <ArrowLeft size={16} />
                    Back
                </button>

                <div className="flex items-center gap-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm font-medium">
                    <Eye size={16} />
                    Read Only
                </div>

            </div>

            {/* CARD 1 */}
            <div className="bg-white p-6 lg:p-8 rounded-xl shadow mb-6 w-full">

                <div className="flex items-center gap-2 mb-2">
                    <User className="text-gray-600" size={20} />
                    <h2 className="text-lg font-semibold text-gray-800">
                        Personal Information
                    </h2>
                </div>

                <p className="text-sm text-gray-500 mb-6">
                    Please select the option that applies to you or supply the needed information as completely as possible.
                </p>

                <div className="grid md:grid-cols-3 gap-6 text-sm">

                    <div>
                        <p className="text-gray-500">Name:</p>
                        <p className="font-semibold text-gray-900">{response?.name ?? "-"}</p>
                    </div>

                    <div>
                        <p className="text-gray-500">Email Address:</p>
                        <p className="font-semibold text-gray-900">{response?.email ?? "-"}</p>
                    </div>

                    <div>
                        <p className="text-gray-500">Mobile Number:</p>
                        <p className="font-semibold text-gray-900">{response?.mobile ?? "-"}</p>
                    </div>

                    <div>
                        <p className="text-gray-500">Home Address:</p>
                        <p className="font-semibold text-gray-900">{response?.address ?? "-"}</p>
                    </div>

                    <div>
                        <p className="text-gray-500">Course:</p>
                        <p className="font-semibold text-gray-900">{response?.course ?? "-"}</p>
                    </div>

                    <div>
                        <p className="text-gray-500">Year Graduated:</p>
                        <p className="font-semibold text-gray-900">{response?.year ?? "-"}</p>
                    </div>

                </div>
            </div>

            {/* CARD 2 */}
            <div className="bg-white p-6 lg:p-8 rounded-xl shadow w-full">

                <div className="flex items-center gap-2 mb-2">
                    <User className="text-gray-600" size={20} />
                    <h2 className="text-lg font-semibold text-gray-800">
                        Employment Status
                    </h2>
                </div>

                <p className="text-sm text-gray-500 mb-6">
                    Please select the option that applies to you or supply the needed information as completely as possible.
                </p>

                <div className="space-y-4 text-sm">

                    <div className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded-full border border-gray-400"></div>
                        <span>Graduate Study</span>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded-full bg-black"></div>
                        <span>Attending seminars/trainings</span>
                    </div>

                </div>
            </div>

        </div>
    );
}

AdminSurveyResponseView.layout = (page) => (
    <AdminLayout>{page}</AdminLayout>
);