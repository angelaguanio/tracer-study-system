import React from 'react'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuItem,

} from "@/components/ui/dropdown-menu"
import { Button } from './ui/button';
import { ChevronDown } from 'lucide-react';
import { router } from '@inertiajs/react';
import { toast } from 'sonner';
import { Avatar } from './ui/avatar';

export default function InquiryContent({inquiry, onUpdateStatus, userRole = 'admin'}) {
    const statusItems = [
        {
            value: 'pending',
            label: 'Pending',
        },
        {
            value: 'replied',
            label: 'Replied',
        },
        {
            value: 'resolved',
            label: 'Resolved',
        }

    ]

    const updateStatus = (newStatus) => {
        const routeName = userRole === 'coordinator' 
            ? 'coordinator.inquiries.update' 
            : 'admin.inquiries.update';
            
        router.patch(route(routeName, inquiry.id), {
            status: newStatus
        }, {
            // Keeps the scroll position so the admin doesn't lose their place
            preserveScroll: true, 
            onStart: () => console.log('Updating...'),
            onSuccess: () => {
                toast.success(`Inquiry marked as ${newStatus}`);
                onUpdateStatus(inquiry.id, newStatus);  
            }
        });
    };

    if (!inquiry) {
    return (
        <div className="flex items-center justify-center h-full w-full text-gray-400">
            No Content
        </div>
    );
}
  return (
    <main className='flex flex-col w-full h-full p-4'>
        <header className='flex flex-row justify-between px-3 pb-3'>
            <div className='flex gap-3 h-full items-center'>
                <Avatar className='h-15 w-15 shrink-0 overflow-hidden border border-gray-200'>
                    {inquiry.alumni.profile_picture ? (
                        <img 
                            src={`/storage/${inquiry.alumni.profile_picture}`} 
                            alt={`${inquiry.alumni.first_name}'s profile`}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="h-full w-full bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center text-white text-md font-bold">
                            {inquiry.alumni.first_name[0]}{inquiry.alumni.last_name[0]}
                        </div>
                    )}
                </Avatar>
                
                <div>
                    <h1 className='text-xl font-semibold'>{inquiry?.title} {inquiry.alumni.first_name} {inquiry.alumni.last_name}</h1>
                    <p>{inquiry.alumni.email}</p>
                    <div>
                        <p className='text-sm'>{inquiry.formatted_date}</p>
                    </div>
                </div>
            </div>

            <div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="gap-2 h-8 text-sm font-semibold">
                        Mark as
                        <ChevronDown className="h-3 w-3" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuLabel className="text-xs text-gray-500 uppercase tracking-wider">
                            Change Status
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        
                        {statusItems.map((option) => (
                        <DropdownMenuItem 
                            key={option.value} 
                            onClick={() => updateStatus(option.value)}
                            className="cursor-pointer gap-2"
                        >
                            {/* Visual status indicator */}
                            <div className={`h-2 w-2 rounded-full ${option.color}`} />
                            {option.label}
                        </DropdownMenuItem>
                        ))}
                        
                    </DropdownMenuContent>
                    </DropdownMenu>
            </div>
        </header>

        <div className='flex flex-col bg-blue-100/30 h-full overflow-y-auto'>
            <div className='px-5 py-4'>
                <h2 className='text-xl font-inter font-semibold text-slate-800'>{inquiry.subject}</h2>
                <hr className='my-3 border-blue-300'/>
                <p className=''>{inquiry.message}</p>
            </div>
        </div>
    </main>
  )
}
