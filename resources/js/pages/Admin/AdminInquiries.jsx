import AdminLayout from "@/layouts/admin-layout";
import InquiryList from '../../components/InquiryList';
import InquiryContent from '../../components/InquiryContent';
import { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';

export default function AdminInquiries({inquiries, filters}) {
    const [selectedInquiry, setSelectedInquiry] = useState(inquiries.data[0] || null);
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
        if (inquiries.data.length > 0) {
            setSelectedInquiry(inquiries.data[0]);
        } else {
            setSelectedInquiry(null);
        }
    }, [inquiries.data]);

    const handleUpdateStatus = (id, newStatus) => {
        setSelectedInquiry(prev =>
            prev ? { ...prev, status: newStatus } : prev
        );
    };

    return (
        <div className='flex h-screen w-full overflow-hidden bg-white p-4 rounded-lg border border-gray-200 shadow-sm '>
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
            />
        </div>
    )
    }

AdminInquiries.layout = (page) => (
  <AdminLayout>{page}</AdminLayout>
);