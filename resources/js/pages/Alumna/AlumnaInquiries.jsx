import { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import AlumnaLayout from '@/layouts/alumna-layout';
import AlumnaInquiryList from '@/components/alumna/AlumnaInquiryList';
import AlumnaInquiryContent from '@/components/alumna/AlumnaInquiryContent';
import ContactForm from '@/components/ContactForm';
import echo from '@/echo';
import cectBg from '@/assets/cect_bg_clean.webp';
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
        if (!initialized) return;
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

    useEffect(() => {
        const channels = inquiries.data.map((inq) => {
            const channel = echo.channel(`inquiry.${inq.id}`);
            channel.listen('.inquiry.replied', () => {
                router.reload({ only: ['inquiries'] });
            });
            return `inquiry.${inq.id}`;
        });

        return () => {
            channels.forEach(name => echo.leaveChannel(name));
        };
    }, [inquiries.data.map(i => i.id).join(',')]);

    const hasNoInquiries = inquiries.data.length === 0 && !search && !recipient;

    return (
        <div className="relative min-h-[calc(100vh-64px)] w-full flex flex-col justify-center overflow-hidden">
            {/* Background Image */}
            <div 
                className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat pointer-events-none"
                style={{ backgroundImage: `url(${cectBg})` }}
            >
                {/* Blue Gradient Overlay */}
                <div className="absolute inset-0 bg-blue-900/60 bg-gradient-to-t from-[#003C87] to-[#003C87]/30" />
            </div>

            {/* New Inquiry Modal */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className='max-w-md sm:max-w-lg lg:max-w-xl w-[92vw] sm:w-full overflow-y-auto p-0 rounded-2xl z-50'>
                    <DialogHeader className='px-6 pt-6 pb-0'>
                        <DialogTitle className='text-xl font-semibold pl-4 text-gray-900'>New Inquiry</DialogTitle>
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

            {/* Content Container */}
            <div className="relative z-10 w-full p-3 sm:p-5 lg:p-6 my-auto">
                {hasNoInquiries ? (
                    <div className='flex flex-col items-center justify-center max-w-xl mx-auto gap-6 px-6 py-16 bg-white/85 backdrop-blur-md rounded-3xl shadow-2xl border border-white/50 text-center'>
                        <div className='bg-[#009AFB]/10 p-5 rounded-full border border-[#9ECEFF]/30'>
                            <MessageSquarePlus className='w-10 h-10 text-[#009AFB]' />
                        </div>
                        <div>
                            <h2 className='text-2xl font-bold text-[#0B2545] mb-2'>No Inquiries Yet</h2>
                            <p className='text-slate-600 text-sm max-w-md leading-relaxed'>
                                You haven't sent any inquiries yet. Submit one and we'll respond as soon as possible.
                            </p>
                        </div>
                        <Button
                            size='lg'
                            className='flex items-center gap-2 px-8 bg-[#009AFB] hover:bg-[#0082D6] text-white shadow-lg rounded-xl font-medium cursor-pointer transition-all'
                            onClick={() => setIsModalOpen(true)}
                        >
                            <Plus className='h-4 w-4' />
                            Send Your First Inquiry
                        </Button>
                    </div>
                ) : (
                    <div className='flex flex-col md:flex-row h-[calc(100vh-140px)] min-h-[580px] w-full max-w-[1500px] mx-auto overflow-hidden bg-white/85 backdrop-blur-md rounded-3xl shadow-2xl border border-white/50'>
                        {/* Mobile View */}
                        <div className="md:hidden h-full w-full">
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

                        {/* Desktop View */}
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
            </div>
        </div>
    );
}

AlumnaInquiries.layout = page => <AlumnaLayout>{page}</AlumnaLayout>;
