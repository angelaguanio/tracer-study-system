import CoordinatorLayout from "@/layouts/coord-layout";
import InquiryList from "../../components/InquiryList";
import InquiryContent from "../../components/InquiryContent";
import { useState, useEffect } from "react";
import { router } from "@inertiajs/react";
import usePolling from '@/hooks/usePolling';

export default function CoordinatorInquiries({ inquiries, filters }) {

    const [selectedInquiry, setSelectedInquiry] = useState(
        typeof window !== "undefined" && window.innerWidth >= 768
            ? inquiries.data[0] || null
            : null
    );

    const [statusFilter, setStatusFilter] = useState(filters?.status || '');
    const [search, setSearch] = useState(filters?.search || "");
    const [sort, setSort] = useState(filters?.sort || "newest");

    // Search and filter
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            router.get(
                "/coordinator/inquiries",
                {
                    search,
                    status: statusFilter || null,
                    sort: sort !== "newest" ? sort : null,
                },
                {
                    preserveState: true,
                    preserveScroll: true,
                    replace: true,
                    only: ['inquiries', 'filters'],
                }
            );
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [search, statusFilter, sort]);

    // Sync selectedInquiry when inquiries.data updates (e.g. after polling/search)
    useEffect(() => {
        setSelectedInquiry(prev => {
            if (!prev) {
                return inquiries.data[0] ?? null;
            }

            const updated = inquiries.data.find(i => i.id === prev.id);

            if (!updated) {
                return inquiries.data[0] ?? null;
            }

            // Only sync non-reply fields from the page prop.
            // Replies are managed exclusively by the polling path in InquiryContent.
            return {
                ...prev,
                status: updated.status,
                title: updated.title,
                subject: updated.subject,
                message: updated.message,
            };
        });
    }, [inquiries.data]);


    const handleUpdateStatus = (id, newStatus) => {
        setSelectedInquiry((prev) =>
            prev ? { ...prev, status: newStatus } : prev
        );
    };

    const handleReplyAdded = (data) => {
        if (!data) return;
        console.log("handleReplyAdded", data);
        setSelectedInquiry(prev => {
            if (!prev) return prev;
    
            // Polling update — replace replies wholesale
            if (data.replace) {
                return {
                    ...prev,
                    status: data.status,
                    replies: data.replies,
                };
            }
    
            // New reply sent locally — deduplicate by id to prevent doubling
            const exists = (prev.replies ?? []).some(r => r.id === data.id);
            if (exists) return prev;

            return {
                ...prev,
                status: 'replied',
                replies: [...(prev.replies ?? []), data],
            };
        });
    };

    return (
        <div
            className="flex flex-col md:flex-row h-full w-full overflow-hidden bg-white rounded-xl border border-gray-200 shadow-sm"
        >
            {/* Mobile */}
            <div className="md:hidden flex h-full w-full">
                {!selectedInquiry ? (
                    <InquiryList
                        inquiries={inquiries}
                        selectedId={selectedInquiry?.id}
                        onSelect={setSelectedInquiry}
                        statusFilter={statusFilter}
                        setStatusFilter={setStatusFilter}
                        search={search}
                        setSearch={setSearch}
                        sort={sort}
                        setSort={setSort}
                    />
                ) : (
                    <InquiryContent
                        inquiry={selectedInquiry}
                        onUpdateStatus={handleUpdateStatus}
                        onReplyAdded={handleReplyAdded}
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
                    sort={sort}
                    setSort={setSort}
                />

                <InquiryContent
                    inquiry={selectedInquiry}
                    onUpdateStatus={handleUpdateStatus}
                    onReplyAdded={handleReplyAdded}
                    userRole="coordinator"
                    onBack={() => setSelectedInquiry(null)}
                />
            </div>
        </div>
    );
}

CoordinatorInquiries.layout = (page) => (
    <CoordinatorLayout>{page}</CoordinatorLayout>
);