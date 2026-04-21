import { router } from "@inertiajs/react";
import { ArrowLeft, Eye } from "lucide-react";
import AdminLayout from "@/layouts/admin-layout";

export default function AdminSurveyResponseViewNotComplete() {

    const handleBack = () => {
        router.visit("/admin/survey-response");
    };

    return (
        <div className="bg-[#F3FAFF] min-h-screen w-full px-6 lg:px-10 py-6 relative">

            {/* HEADER (SAME AS COMPLETED VIEW) */}
            <div className="flex items-center justify-between mb-6">

                <button
                    onClick={handleBack}
                    className="flex items-center gap-2 bg-[#0B63F6] text-white px-5 py-2.5 rounded-md hover:bg-blue-700 text-sm font-medium shadow"
                >
                    <ArrowLeft size={16} />
                    Back
                </button>

                {/* <div className="flex items-center gap-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm font-medium">
                    <Eye size={16} />
                    Not Completed
                </div> */}

            </div>

            {/* MESSAGE */}
            <div className="flex items-center justify-center min-h-[80vh]">
                <p className="text-gray-600 font-bold text-lg max-w-md leading-relaxed text-center">
                    This user has not yet completed the survey
                </p>
            </div>

        </div>
    );
}

AdminSurveyResponseViewNotComplete.layout = (page) => (
    <AdminLayout>{page}</AdminLayout>
);