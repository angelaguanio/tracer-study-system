import { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import AlumnaLayout from '@/layouts/alumna-layout';
import AlumnaInquiryList from '@/components/AlumnaInquiryList';
import AlumnaInquiryContent from '@/components/AlumnaInquiryContent';

export default function AlumnaInquiries({ inquiries, filters, openId }) {
    const initialInquiry = openId
        ? (inquiries.data.find(i => i.id === openId) ?? inquiries.data[0] ?? null)
        : (inquiries.data[0] ?? null);

    const [selectedInquiry, setSelectedInquiry] = useState(initialInquiry);
    const [search, setSearch] = useState(filters?.search || '');

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            router.get('/alumna/inquiries', {
                search: search || null,
            }, {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            });
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [search]);

    useEffect(() => {
        if (inquiries.data.length > 0) {
            setSelectedInquiry(inquiries.data[0]);
        } else {
            setSelectedInquiry(null);
        }
    }, [inquiries.data]);

    return (
        <div className='flex h-screen w-full overflow-hidden bg-white py-8 px-8 rounded-lg border border-gray-200 shadow-sm'>
            <AlumnaInquiryList
                inquiries={inquiries}
                selectedId={selectedInquiry?.id}
                onSelect={setSelectedInquiry}
                search={search}
                setSearch={setSearch}
            />

            <AlumnaInquiryContent
                inquiry={selectedInquiry}
            />
        </div>
    );
}

AlumnaInquiries.layout = page => <AlumnaLayout>{page}</AlumnaLayout>;
