import { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import AlumnaLayout from '@/layouts/alumna-layout';
import AlumnaInquiryList from '@/components/alumna/AlumnaInquiryList';
import AlumnaInquiryContent from '@/components/alumna/AlumnaInquiryContent';
import echo from '@/echo';


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
        if (!initialized) return; // don't fire on mount
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
            if (!current) return null;
    
            const updated = inquiries.data.find(i => i.id === current.id);
            if (!updated) return inquiries.data[0];

            // Only sync safe fields — replies are managed by polling in AlumnaInquiryContent
            return {
                ...current,
                status: updated.status,
                subject: updated.subject,
                message: updated.message,
                department: updated.department,
                formatted_date: updated.formatted_date,
            };
        });
    }, [inquiries.data]);

    useEffect(() => {
        if (initialized) return;
        if (inquiries.data.length > 0) {
            setSelectedInquiry(initialInquiry);
        }
        setInitialized(true);
    }, []);

    // Realtime: when a staff member replies, the inquiry.replied event fires on that
    // inquiry's channel. AlumnaInquiryContent also subscribes, but we update the
    // list status badge here so the sidebar shows "replied" immediately.
    useEffect(() => {
        const channels = inquiries.data.map((inq) => {
            const channel = echo.channel(`inquiry.${inq.id}`);
            channel.listen('.inquiry.replied', (event) => {
                // Update status badge in the list
                router.reload({ only: ['inquiries'] });
            });
            return `inquiry.${inq.id}`;
        });

        return () => {
            channels.forEach(name => echo.leaveChannel(name));
        };
    // Re-subscribe when the inquiry list page changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [inquiries.data.map(i => i.id).join(',')]);

 

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
