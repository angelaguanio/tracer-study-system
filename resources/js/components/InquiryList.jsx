import {Badge} from './ui/badge';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu"

import {Avatar} from './ui/avatar';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Search, ListFilter, ChevronLeft, ChevronRight } from 'lucide-react';
import { router } from '@inertiajs/react';



export default function InquiryList({inquiries, selectedId, onSelect, statusFilter, setStatusFilter, search,
  setSearch, sort, setSort}) {
    
    const getStatusBadge = (status) => {
        switch (status) {
            case 'resolved':
                return 'bg-emerald-50 text-emerald-700 border-emerald-200';
            case 'replied':
                return 'bg-[#009AFB]/10 text-[#009AFB] border-[#9ECEFF]';
            case 'pending':
                return 'bg-amber-50 text-amber-700 border-amber-200';
            default:
                return 'bg-slate-100 text-slate-600 border-slate-200';
        }
    };

    const handlePageChange = (url) => {
        if (url) {
            router.get(url, {}, {
                preserveState: true,
                preserveScroll: true,
            });
        }
    };

    const hasActiveFilters = statusFilter !== '' || (sort && sort !== 'newest');

  return (
    <aside className='bg-slate-50/70 backdrop-blur-md border-r border-slate-200/60 w-full md:w-[340px] lg:w-[380px] shrink-0 flex flex-col h-full rounded-l-2xl overflow-hidden'>
        {/* header */}
        <div className='flex flex-col gap-2 w-full pt-2'>
            <div className='flex justify-between items-center px-6 pt-5'>
                <div className='flex items-center gap-2.5'>
                    <h2 className='text-xl font-bold text-[#0B2545] tracking-tight'>Inquiries</h2>
                    <Badge className='bg-[#0B2545] text-white text-xs px-2.5 py-0.5 rounded-full font-semibold shadow-sm'>
                        {inquiries.total}
                    </Badge>
                </div>
            </div>

            <div className='flex gap-2 px-5 py-3 justify-between'>
                <div className='relative flex items-center w-full'>
                    <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400' />
                    <Input 
                        placeholder='Search inquiries...' 
                        className='bg-white/80 border-slate-200 text-slate-800 placeholder:text-slate-400 pl-9.5 w-full rounded-xl focus-visible:ring-[#009AFB] focus-visible:border-[#009AFB] shadow-inner text-sm' 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="outline"
                            size="icon"
                            className={`shrink-0 bg-white/80 border-slate-200 rounded-xl shadow-sm hover:bg-white text-slate-700 ${
                                hasActiveFilters ? 'ring-2 ring-[#009AFB] border-transparent text-[#009AFB]' : ''
                            }`}
                        >
                            <ListFilter className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48 rounded-xl shadow-xl border-slate-100 bg-white/95 backdrop-blur-md p-1.5">
                        <DropdownMenuLabel className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold px-2 py-1">Sort by date</DropdownMenuLabel>
                        <DropdownMenuRadioGroup value={sort ?? 'newest'} onValueChange={setSort}>
                            <DropdownMenuRadioItem value="newest" className='rounded-lg text-xs font-medium cursor-pointer'>Newest first</DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="oldest" className='rounded-lg text-xs font-medium cursor-pointer'>Oldest first</DropdownMenuRadioItem>
                        </DropdownMenuRadioGroup>

                        <DropdownMenuSeparator className='my-1 border-slate-100' />

                        <DropdownMenuLabel className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold px-2 py-1">Filter by status</DropdownMenuLabel>
                        <DropdownMenuRadioGroup value={statusFilter} onValueChange={setStatusFilter}>
                            <DropdownMenuRadioItem value="" className='rounded-lg text-xs font-medium cursor-pointer'>All</DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="pending" className='rounded-lg text-xs font-medium cursor-pointer'>Pending</DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="replied" className='rounded-lg text-xs font-medium cursor-pointer'>Replied</DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="resolved" className='rounded-lg text-xs font-medium cursor-pointer'>Resolved</DropdownMenuRadioItem>
                        </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
        

        {/* list of messages */}
        <div className='flex flex-col gap-2.5 px-4 py-2 flex-1 min-h-0 overflow-y-auto inquiry-scrollbar'>   
            {inquiries.data.length === 0 ? (
                <div className='flex flex-col items-center justify-center h-48 text-center p-4'>
                    <p className='text-sm font-medium text-slate-500'>No inquiries found</p>
                    <p className='text-xs text-slate-400 mt-1'>Try adjusting your search or filters.</p>
                </div>
            ) : (
                inquiries.data.map((data) => {
                    const isActive = Number(selectedId) === Number(data.id);
                    return(
                    <Card 
                        key={data.id} 
                        className={`group cursor-pointer flex flex-col p-3.5 rounded-2xl transition-all duration-200 border ${
                            isActive 
                                ? 'bg-white border-[#9ECEFF] shadow-md ring-1 ring-[#009AFB]/30 translate-x-1'
                                : 'bg-white/60 hover:bg-white/90 border-slate-200/70 shadow-sm hover:shadow'
                        }`}
                        onClick={() => onSelect(data)} 
                    >
                        <div className='flex gap-3 items-center min-w-0 mb-1'>
                            <Avatar className='h-9 w-9 shrink-0 overflow-hidden border border-slate-200/80 shadow-sm'>
                                {data.alumni.profile_picture ? (
                                   <img
                                       src={data.alumni.profile_picture}
                                       alt={`${data.alumni.first_name}'s profile`}
                                       className="w-full h-full object-cover"
                                   />
                                ) : (
                                    <div className="h-full w-full bg-gradient-to-br from-[#0B2545] to-[#009AFB] flex items-center justify-center text-white text-xs font-bold">
                                        {data.alumni.first_name[0]}{data.alumni.last_name[0]}
                                    </div>
                                )}
                            </Avatar>
                            <div className='flex flex-col min-w-0 flex-1 leading-tight'>
                                <h3 className='text-xs font-bold text-[#0B2545] truncate'>
                                    {data.alumni.first_name} {data.alumni.last_name}
                                </h3>
                                <p className='text-[11px] text-slate-400 truncate font-medium mt-0.5'>
                                    {data.alumni.email}
                                </p>
                            </div>
                            <div className='ml-auto shrink-0'>
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border capitalize ${getStatusBadge(data.status)}`}>
                                    {data.status}
                                </span>
                            </div>
                        </div>

                        <div className='flex flex-col gap-1 pt-1.5 border-t border-slate-100/80'>
                            <h4 className={`text-xs font-bold truncate transition-colors ${
                                isActive ? 'text-[#009AFB]' : 'text-[#0B2545] group-hover:text-[#009AFB]'
                            }`}>
                                {data.subject}
                            </h4>
                            <p className='text-xs text-slate-500 line-clamp-2 leading-relaxed font-normal'>
                                {data.message}
                            </p>
                        </div>
                    </Card>
                    );
                })
            )}
        </div>

        {/* Pagination */}
        <div className='p-3.5 bg-slate-100/50 border-t border-slate-200/50'>
            <div className='flex items-center justify-between bg-white/80 rounded-xl p-1.5 border border-slate-200/60 shadow-sm'>
                <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handlePageChange(inquiries.prev_page_url)}
                    disabled={!inquiries.prev_page_url}
                    className="h-7 w-7 p-0 rounded-lg text-slate-600 hover:bg-slate-100 disabled:opacity-30"
                >
                    <ChevronLeft className="h-4 w-4" />
                </Button>
                
                <span className='text-xs font-semibold text-slate-600'>
                    Page {inquiries.current_page} of {inquiries.last_page}
                </span>
                
                <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handlePageChange(inquiries.next_page_url)}
                    disabled={!inquiries.next_page_url}
                    className="h-7 w-7 p-0 rounded-lg text-slate-600 hover:bg-slate-100 disabled:opacity-30"
                >
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
    </aside>
  )
}
