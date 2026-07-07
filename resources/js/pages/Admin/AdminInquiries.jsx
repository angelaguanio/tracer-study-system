import AdminLayout from "@/layouts/admin-layout";
import InquiryList from '../../components/InquiryList';
import InquiryContent from '../../components/InquiryContent';
import { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';

export default function AdminInquiries({inquiries, filters}) {
    const [selectedInquiry, setSelectedInquiry] = useState(
        window.innerWidth >= 768
            ? inquiries.data[0] || null
            : null
    );
    const [statusFilter, setStatusFilter] = useState(filters?.status ? filters.status.split(',') : []);
    const [search, setSearch] = useState(filters?.search || '');

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            router.get('/admin/inquiries', {
                search: search,
                status: statusFilter.length > 0 ? statusFilter.join(',') : null,
            }, {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            });
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [search, statusFilter]);

    useEffect(() => {
        if (window.innerWidth >= 768) {
            setSelectedInquiry(inquiries.data[0] || null);
        }
    }, [inquiries.data]);

    const handleUpdateStatus = (id, newStatus) => {
        setSelectedInquiry(prev =>
            prev ? { ...prev, status: newStatus } : prev
        );
    };

    const handleReplyAdded = (reply) => {
        setSelectedInquiry(prev => ({
            ...prev,
            status: 'replied',
            replies: [...(prev.replies ?? []), reply],
        }));
    };

    return (
        <div className="flex flex-col md:flex-row h-full w-full overflow-hidden bg-white rounded-xl border border-gray-200 shadow-sm">

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
                />
            ) : (
                <InquiryContent
                    inquiry={selectedInquiry}
                    onUpdateStatus={handleUpdateStatus}
                    onReplyAdded={handleReplyAdded}
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
                onReplyAdded={handleReplyAdded}
            />
        </div>

    </div>
    )
    }

AdminInquiries.layout = (page) => (
  <AdminLayout>{page}</AdminLayout>
);