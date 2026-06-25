import CoordinatorLayout from "@/layouts/coord-layout";
import InquiryList from "../../components/InquiryList";
import InquiryContent from "../../components/InquiryContent";
import { useState, useEffect } from "react";
import { router } from "@inertiajs/react";

export default function CoordinatorInquiries({ inquiries, filters }) {

    const [selectedInquiry, setSelectedInquiry] = useState(
        typeof window !== "undefined" && window.innerWidth >= 768
            ? inquiries.data[0] || null
            : null
    );

    const [statusFilter, setStatusFilter] = useState(
        filters?.status ? filters.status.split(",") : []
    );

    const [search, setSearch] = useState(filters?.search || "");

    // Search and filter
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            router.get(
                "/coordinator/inquiries",
                {
                    search,
                    status:
                        statusFilter.length > 0
                            ? statusFilter.join(",")
                            : null,
                },
                {
                    preserveState: true,
                    preserveScroll: true,
                    replace: true,
                }
            );
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [search, statusFilter]);

    // Desktop auto-select first inquiry
    useEffect(() => {
        if (window.innerWidth >= 768) {
            setSelectedInquiry(
                inquiries.data.length > 0
                    ? inquiries.data[0]
                    : null
            );
        }
    }, [inquiries.data]);

    const handleUpdateStatus = (id, newStatus) => {
        setSelectedInquiry((prev) =>
            prev ? { ...prev, status: newStatus } : prev
        );
    };

    return (
        <div
            className="flex flex-col md:flex-row h-[calc(100vh-80px)] w-full overflow-hidden bg-white rounded-xl border border-gray-200 shadow-sm"
        >
            {/* Mobile */}
            <div className="md:hidden h-full w-full">
                {!selectedInquiry ? (
                    <InquiryList
                        inquiries={inquiries}
                        selectedId={selectedInquiry?.id}
                        onSelect={setSelectedInquiry}
                        statusFilter={statusFilter}
                        setStatusFilter={setStatusFilter}
                        search={search}
                        setSearch={setSearch}
                    />
                ) : (
                    <InquiryContent
                        inquiry={selectedInquiry}
                        onUpdateStatus={handleUpdateStatus}
                        userRole="coordinator"
                        onBack={() => setSelectedInquiry(null)}
                    />
                )}
            </div>

            {/* Desktop */}
            <div className="hidden md:flex flex-1 min-h-0">
                <InquiryList
                    inquiries={inquiries}
                    selectedId={selectedInquiry?.id}
                    onSelect={setSelectedInquiry}
                    statusFilter={statusFilter}
                    setStatusFilter={setStatusFilter}
                    search={search}
                    setSearch={setSearch}
                />

                <InquiryContent
                    inquiry={selectedInquiry}
                    onUpdateStatus={handleUpdateStatus}
                    userRole="coordinator"
                />
            </div>
        </div>
    );
}

CoordinatorInquiries.layout = (page) => (
    <CoordinatorLayout>{page}</CoordinatorLayout>
);