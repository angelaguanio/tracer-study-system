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
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {Avatar} from './ui/avatar';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Search, ListFilter, ChevronLeft, ChevronRight } from 'lucide-react';
import { router } from '@inertiajs/react';



export default function InquiryList({inquiries, selectedId, onSelect, statusFilter, setStatusFilter, search,
  setSearch}) {
    const statusItems = [
        { value: 'pending', label: 'Pending' },
        { value: 'replied', label: 'Replied' },
        { value: 'resolved', label: 'Resolved' },
    ];
    
    const getStatusColor = (status) => {
        switch (status) {
            case 'resolved':
            return 'bg-green-500 text-white';
            case 'replied':
            return 'bg-blue-500 text-white';
            case 'pending':
            return 'bg-amber-300 text-gray-700';
            default:
            return 'bg-gray-400 text-white';
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

  return (
    <aside className='bg-blue-100 max-w-[300px] rounded-2xl flex flex-col h-full'>
        {/* header */}
        <div className='flex flex-col gap-2 w-full'>
            <div className='flex justify-between items-center px-6 pt-5'>
                <h2 className='text-xl font-semibold'>Inquiries</h2>
                <Badge className='bg-slate-700 text-sm px-3'>{inquiries.total}</Badge>
            </div>

            <div className='flex gap-3 px-4 py-2 justify-between'>
                <div className='relative flex items-center w-full'>
                    <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500' />
                    <Input 
                        placeholder='Search' 
                        className='bg-white text-gray-700 pl-10 w-full focus-visible:ring-blue-500' 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <DropdownMenu >
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline">
                            <ListFilter/>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>  
                        {statusItems.map((status) => (
                            <DropdownMenuCheckboxItem key={status.value} checked={statusFilter.includes(status.value)}
                                 onCheckedChange={(checked) => {
                                if (checked) {
                                setStatusFilter(prev => [...prev, status.value]);
                                } else {
                                setStatusFilter(prev =>
                                    prev.filter(item => item !== status.value)
                                );
                                }}}>
                                {status.label}
                            </DropdownMenuCheckboxItem>
                        ))}   
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
        

        {/* list of messages */}
        <div className='flex flex-col gap-3 p-4 flex-1 w-full overflow-y-auto inquiry-scrollbar'>   
            {inquiries.data.map((data) => {
                const isActive = Number(selectedId) === Number(data.id);
                return(
                <Card 
                    key={data.id} 
                     className={`gap-2 cursor-pointer flex transition-colors
                        ring-2 ring-transparent shadow-sm
                        ${isActive 
                        ? 'bg-slate-100 ring-blue-500 shadow-md'
                        : 'hover:bg-gray-100'
                    }`}
                    onClick={() => onSelect(data)} 
                >
                    <CardHeader>
                        <div className='flex gap-3 items-start min-w-0'>
                            <Avatar className='h-10 w-10 shrink-0 overflow-hidden border border-gray-200'>
                                {data.alumni.profile_picture ? (
                                    <img 
                                        src={`/storage/${data.alumni.profile_picture}`} 
                                        alt={`${data.alumni.first_name}'s profile`}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="h-full w-full bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center text-white text-xs font-bold">
                                        {data.alumni.first_name[0]}{data.alumni.last_name[0]}
                                    </div>
                                )}
                            </Avatar>
                            <div className='flex flex-col min-w-0 flex-1'>
                                <CardTitle className='text-sm truncate'>{data.title} {data.alumni.first_name} {data.alumni.last_name}</CardTitle>
                                <CardDescription className='text-xs truncate'>{data.alumni.email}</CardDescription>
                            </div>
                            <div className='ml-auto shrink-0'>
                                <Badge className={`${getStatusColor(data.status)} px-2 py-1 capitalize`}>{data.status}</Badge>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className='flex flex-col line-clamp-2 '>
                        <h2 className='text-md font-black'>{data.subject}</h2>
                        <p className='text-sm truncate'>
                            {data.message}
                        </p>
                    </CardContent>

                    <CardFooter>
                        
                    </CardFooter>
                </Card>
                );
})}
        </div>

        {/* Pagination */}
        <div className='px-4 pb-4 pt-2'>
            <div className='flex items-center justify-between bg-white rounded-lg p-2 shadow-sm'>
                <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handlePageChange(inquiries.prev_page_url)}
                    disabled={!inquiries.prev_page_url}
                    className="h-8 w-8 p-0"
                >
                    <ChevronLeft className="h-4 w-4" />
                </Button>
                
                <span className='text-xs text-gray-600'>
                    Page {inquiries.current_page} of {inquiries.last_page}
                </span>
                
                <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handlePageChange(inquiries.next_page_url)}
                    disabled={!inquiries.next_page_url}
                    className="h-8 w-8 p-0"
                >
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
    </aside>
  )
}
