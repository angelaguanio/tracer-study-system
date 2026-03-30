import { Link, usePage, router } from '@inertiajs/react'
import React from 'react'
import { SidebarTrigger } from './ui/sidebar';
import { Button } from './ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from "../components/ui/dropdown-menu"
import ModeToggle from './mode-toggle';
  

export default function HeaderCoord({ navItems = [] }) {
    const {url} =  usePage();
    const activeItem =  navItems.find((item) => url.startsWith(item.href))

    
  return (
    <header className='flex w-full justify-between py-3 px-2'>
        <div className='flex flex-row items-center'>
            <SidebarTrigger/>
            <h1 className='text-2xl font-medium '>{activeItem ? activeItem.name : "Dashboard"}</h1>
        </div>

        <div className='flex flex-row items-center gap-2'>
            <ModeToggle />

            {/* profile */}
            <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="nav" className="py-6">
                            {/* <ProfileTemp/> */}
                            Dropdown haha next time na ung user
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem asChild>
                            <Link>Profile</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => router.post(route('coordinator.logout'))}>
                            Logout
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
        </div>
    </header>
  )
}
