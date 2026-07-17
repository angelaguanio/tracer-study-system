import AdminLayout from "@/layouts/admin-layout";
import InquiryList from '../../components/InquiryList';
import InquiryContent from '../../components/InquiryContent';
import { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import echo from '@/echo';


export default function AdminInquiries({inquiries, filters}) {
    const [selectedInquiry, setSelectedInquiry] = useState(
        window.innerWidth >= 768
            ? inquiries.data[0] || null
            : null
    );
    const [statusFilter, setStatusFilter] = useState(filters?.status || '');
    const [search, setSearch] = useState(filters?.search || '');
    const [sort, setSort] = useState(filters?.sort || 'newest');

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            router.get('/admin/inquiries', {
                search,
                status: statusFilter || null,
                sort: sort !== 'newest' ? sort : null,
            }, {
                preserveState: true,
                preserveScroll: true,
                replace: true,
                only: ['inquiries', 'filters'],
            });
        }, 500);
    
        return () => clearTimeout(delayDebounceFn);
    }, [search, statusFilter, sort]);

    // Realtime: refresh inquiry list when a new inquiry arrives
    useEffect(() => {
        const channel = echo.channel('role.admin');
        channel.listen('.inquiry.created', () => {
            router.reload({ only: ['inquiries'] });
        });
        return () => {
            channel.stopListening('.inquiry.created');
        };
    }, []);
    
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
        setSelectedInquiry(prev =>
            prev ? { ...prev, status: newStatus } : prev
        );
    };

    const handleReplyAdded = (data) => {
        if (!data) return;
        setSelectedInquiry(prev => {
            if (!prev) return prev;
    
            // Full replace (initial fetch on inquiry selection)
            if (data.replace) {
                return {
                    ...prev,
                    status: data.status,
                    replies: data.replies,
                };
            }

            // Realtime single new reply from Echo event
            if (data.newReply) {
                const exists = (prev.replies ?? []).some(r => r.id === data.newReply.id);
                if (exists) return prev;
                return {
                    ...prev,
                    status: data.status ?? prev.status,
                    replies: [...(prev.replies ?? []), data.newReply],
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
                    sort={sort}
                    setSort={setSort}
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
                sort={sort}
                setSort={setSort}
            />

            <InquiryContent
                inquiry={selectedInquiry}
                onUpdateStatus={handleUpdateStatus}
                onReplyAdded={handleReplyAdded}
                userRole="admin"
            />
        </div>

    </div>
    )
    }

AdminInquiries.layout = (page) => (
  <AdminLayout>{page}</AdminLayout>
);