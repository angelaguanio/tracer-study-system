import { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import AlumnaLayout from '@/layouts/alumna-layout';
import AlumnaInquiryList from '@/components/alumna/AlumnaInquiryList';
import AlumnaInquiryContent from '@/components/alumna/AlumnaInquiryContent';
import usePolling from '@/hooks/usePolling';

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

    usePolling({
        interval: 3000,
        only: ['inquiries'],

    });

    return (
        <div className='flex flex-col md:flex-row h-[calc(100vh-2rem)] w-full overflow-hidden shadow-sm bg-white rounded-xl shadow-lg m-4'>
           {/* Mobile */}
            <div className="md:hidden h-full">
                {!selectedInquiry ? (
                    <AlumnaInquiryList
                        inquiries={inquiries}
                        selectedId={selectedInquiry?.id}
                        onSelect={setSelectedInquiry}
                        search={search}
                        setSearch={setSearch}
                    />
                ) : (
                    <AlumnaInquiryContent
                        inquiry={selectedInquiry}
                        onBack={() => setSelectedInquiry(null)}
                    />
                )}
            </div>

            {/* Desktop */}
            <div className="hidden md:flex h-full w-full">
                <AlumnaInquiryList
                    inquiries={inquiries}
                    selectedId={selectedInquiry?.id}
                    onSelect={setSelectedInquiry}
                    search={search}
                    setSearch={setSearch}
                />

                <AlumnaInquiryContent inquiry={selectedInquiry} />
            </div>
        </div>
    );
}

AlumnaInquiries.layout = page => <AlumnaLayout>{page}</AlumnaLayout>;
