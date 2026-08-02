import { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import AlumnaLayout from '@/layouts/alumna-layout';
import AlumnaInquiryList from '@/components/alumna/AlumnaInquiryList';
import AlumnaInquiryContent from '@/components/alumna/AlumnaInquiryContent';
import ContactForm from '@/components/ContactForm';
import echo from '@/echo';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { MessageSquarePlus, Plus } from 'lucide-react';


export default function AlumnaInquiries({ inquiries, filters, openId, userEmail, userName, coordinators, departments }) {
    const initialInquiry = openId
        ? (inquiries.data.find(i => i.id === openId) ?? inquiries.data[0] ?? null)
        : (inquiries.data[0] ?? null);

    const [selectedInquiry, setSelectedInquiry] = useState(initialInquiry);
    const [search, setSearch] = useState(filters?.search || '');
    const [sort, setSort] = useState(filters?.sort || 'newest');
    const [recipient, setRecipient] = useState(filters?.recipient || '');
    const [initialized, setInitialized] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

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

    const hasNoInquiries = inquiries.data.length === 0 && !search && !recipient;

    return (
        <>
            {/* New Inquiry Modal */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className='max-w-md sm:max-w-lg lg:max-w-xl w-[92vw] sm:w-full overflow-y-auto p-0 rounded-2xl'>
                    <DialogHeader className='px-6 pt-6 pb-0'>
                        <DialogTitle className='text-xl font-semibold pl-4'>New Inquiry</DialogTitle>
                    </DialogHeader>
                    <ContactForm
                        userEmail={userEmail}
                        userName={userName}
                        coordinators={coordinators}
                        departments={departments}
                        onSuccess={() => {
                            setIsModalOpen(false);
                            router.reload({ only: ['inquiries'] });
                        }}
                    />
                </DialogContent>
            </Dialog>

            {/* Empty state — shown when user has never submitted an inquiry */}
            {hasNoInquiries ? (
                <div className='flex flex-col items-center justify-center flex-1 gap-6 px-4 py-20'>
                    <div className='bg-blue-100 p-5 rounded-full'>
                        <MessageSquarePlus className='w-10 h-10 text-blue-500' />
                    </div>
                    <div className='text-center'>
                        <h2 className='text-2xl font-bold text-gray-800 mb-2'>No Inquiries Yet</h2>
                        <p className='text-gray-500 max-w-md'>
                            You haven't sent any inquiries yet. Submit one and we'll respond as soon as possible.
                        </p>
                    </div>
                    <Button
                        size='lg'
                        variant='default'
                        className='flex items-center gap-2 px-8 bg-blue-btn hover:bg-bluehover-btn text-white'
                        onClick={() => setIsModalOpen(true)}
                    >
                        <Plus className='h-4 w-4' />
                        Send Your First Inquiry
                    </Button>
                </div>
            ) : (
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
                                onNewInquiry={() => setIsModalOpen(true)}
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
                            onNewInquiry={() => setIsModalOpen(true)}
                        />

                        <AlumnaInquiryContent inquiry={selectedInquiry} />
                    </div>
                </div>
            )}
        </>
    );
}

AlumnaInquiries.layout = page => <AlumnaLayout>{page}</AlumnaLayout>;
