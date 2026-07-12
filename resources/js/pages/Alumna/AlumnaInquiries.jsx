import { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import AlumnaLayout from '@/layouts/alumna-layout';
import AlumnaInquiryList from '@/components/alumna/AlumnaInquiryList';
import AlumnaInquiryContent from '@/components/alumna/AlumnaInquiryContent';


export default function AlumnaInquiries({ inquiries, filters, openId }) {
    const initialInquiry = openId
        ? (inquiries.data.find(i => i.id === openId) ?? inquiries.data[0] ?? null)
        : (inquiries.data[0] ?? null);

    const [selectedInquiry, setSelectedInquiry] = useState(initialInquiry);
    const [search, setSearch] = useState(filters?.search || '');
    const [sort, setSort] = useState(filters?.sort || 'newest');
    const [recipient, setRecipient] = useState(filters?.recipient || '');
    const [initialized, setInitialized] = useState(false);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            router.get('/alumna/inquiries', {
                search: search || null,
                sort: sort !== 'newest' ? sort : null,
                recipient: recipient || null,
            }, {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            });
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [search, sort, recipient]);

    useEffect(() => {
        if (inquiries.data.length === 0) {
            setSelectedInquiry(null);
            return;
        }
    
        setSelectedInquiry((current) => {
            if (!current) {
                return null; // don't auto-select again after user pressed Back
            }
    
            const updated = inquiries.data.find(
                (i) => i.id === current.id
            );
    
            return updated ?? inquiries.data[0];
        });
    }, [inquiries.data]);

    useEffect(() => {
        if (initialized) return;
    
        if (inquiries.data.length > 0) {
            setSelectedInquiry(initialInquiry);
        }
    
        setInitialized(true);
    }, []);

 

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
                        sort={sort}
                        setSort={setSort}
                        recipient={recipient}
                        setRecipient={setRecipient}
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
                    sort={sort}
                    setSort={setSort}
                    recipient={recipient}
                    setRecipient={setRecipient}
                />

                <AlumnaInquiryContent inquiry={selectedInquiry} />
            </div>
        </div>
    );
}

AlumnaInquiries.layout = page => <AlumnaLayout>{page}</AlumnaLayout>;
