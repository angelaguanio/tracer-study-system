import { Badge } from '../ui/badge';
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from '@/components/ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Search, ChevronLeft, ChevronRight, ListFilter, Plus } from 'lucide-react';
import { router } from '@inertiajs/react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

export default function AlumnaInquiryList({
    inquiries, selectedId, onSelect,
    search, setSearch,
    sort, setSort,
    recipient, setRecipient,
    onNewInquiry,
}) {
    const handlePageChange = (url) => {
        if (url) {
            router.get(url, {}, { preserveState: true, preserveScroll: true });
        }
    };

    const hasActiveFilters = sort !== 'newest' || recipient !== '';

    return (
        <aside className='bg-blue-100 w-full md:w-[380px] md:min-w-[380px] rounded-2xl flex flex-col h-full'>
            {/* Header */}
            <div className='flex flex-col gap-2 w-full'>
                <div className='flex justify-between items-center px-6 pt-5'>
                    <div className='flex items-center gap-2'>
                        <h2 className='text-xl font-semibold'>My Inquiries</h2>
                        <Badge className='bg-slate-700 text-sm px-3'>{inquiries.total}</Badge>
                    </div>
                    <Button
                        size='sm'
                        variant='default'
                        className='gap-1 text-xs shrink-0 bg-blue-btn hover:bg-bluehover-btn text-white'
                        onClick={onNewInquiry}
                    >
                        <Plus className='h-3.5 w-3.5' />
                        New Inquiry
                    </Button>
                </div>

                {/* Search + filter button */}
                <div className='flex gap-2 px-4 py-2'>
                    <div className='relative flex items-center flex-1'>
                        <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500' />
                        <Input
                            placeholder='Search'
                            className='bg-white text-gray-700 pl-10 w-full focus-visible:ring-blue-500'
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant='outline'
                                size='icon'
                                className={`shrink-0 bg-white ${hasActiveFilters ? 'ring-2 ring-blue-500' : ''}`}
                            >
                                <ListFilter className='h-4 w-4' />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align='end' className='w-44'>
                            <DropdownMenuLabel className='text-xs'>Sort by date</DropdownMenuLabel>
                            <DropdownMenuRadioGroup value={sort} onValueChange={setSort}>
                                <DropdownMenuRadioItem value='newest'>Newest first</DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value='oldest'>Oldest first</DropdownMenuRadioItem>
                            </DropdownMenuRadioGroup>

                            <DropdownMenuSeparator />

                            <DropdownMenuLabel className='text-xs'>Filter by recipient</DropdownMenuLabel>
                            <DropdownMenuRadioGroup value={recipient} onValueChange={setRecipient}>
                                <DropdownMenuRadioItem value=''>All</DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value='coordinator'>Department</DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value='admin'>Alumni Office</DropdownMenuRadioItem>
                            </DropdownMenuRadioGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* List */}
            <div className='flex flex-col gap-3 p-4 flex-1 w-full overflow-y-auto inquiry-scrollbar'>
                {inquiries.data.length === 0 ? (
                    <p className='text-sm text-gray-400 text-center mt-10'>No inquiries yet.</p>
                ) : (
                    inquiries.data.map((data) => {
                        const isActive = Number(selectedId) === Number(data.id);
                        return (
                            <Card
                                key={data.id}
                                className={`gap-2 cursor-pointer flex transition-colors ring-2 ring-transparent shadow-sm ${
                                    isActive
                                        ? 'bg-slate-100 ring-blue-500 shadow-md'
                                        : 'hover:bg-gray-100'
                                }`}
                                onClick={() => onSelect(data)}
                            >
                                <CardHeader>
                                    <div className='flex gap-2 items-start min-w-0'>
                                        <div className='flex flex-col min-w-0 flex-1'>
                                            <CardTitle className='text-sm truncate break-words'>
                                                {data.subject}
                                            </CardTitle>
                                            <CardDescription className='text-xs truncate break-words'>
                                                {data.department
                                                    ? `Dept: ${data.department}`
                                                    : 'To: Admin'}
                                            </CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>

                                <CardContent className='flex flex-col line-clamp-2'>
                                    <p className='text-sm truncate break-words text-gray-500'>
                                        {data.message}
                                    </p>
                                    <p className='text-xs text-gray-400 mt-1'>{data.formatted_date}</p>
                                </CardContent>

                                <CardFooter />
                            </Card>
                        );
                    })
                )}
            </div>

            {/* Pagination */}
            <div className='px-4 pb-4 pt-2'>
                <div className='flex items-center justify-between bg-white rounded-lg p-2 shadow-sm'>
                    <Button
                        variant='ghost'
                        size='sm'
                        onClick={() => handlePageChange(inquiries.prev_page_url)}
                        disabled={!inquiries.prev_page_url}
                        className='h-8 w-8 p-0'
                    >
                        <ChevronLeft className='h-4 w-4' />
                    </Button>
                    <span className='text-xs text-gray-600'>
                        Page {inquiries.current_page} of {inquiries.last_page}
                    </span>
                    <Button
                        variant='ghost'
                        size='sm'
                        onClick={() => handlePageChange(inquiries.next_page_url)}
                        disabled={!inquiries.next_page_url}
                        className='h-8 w-8 p-0'
                    >
                        <ChevronRight className='h-4 w-4' />
                    </Button>
                </div>
            </div>
        </aside>
    );
}
