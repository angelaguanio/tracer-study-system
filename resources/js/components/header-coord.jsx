import { Link, usePage, router } from '@inertiajs/react'
import React from 'react'
import { SidebarTrigger } from './ui/sidebar'
import { Button } from './ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu"
import ModeToggle from './mode-toggle'
import ProfileTemp from './profile-temp' 

export default function HeaderCoord({ navItems = [] }) {
  const { url, props } = usePage()
  const user = props.auth?.user 
  const activeItem = navItems.find((item) => url.startsWith(item.href))

  return (
    <header className='flex w-full justify-between py-3 px-2'>
      <div className='flex flex-row items-center'>
        <SidebarTrigger />
        <h1 className='text-2xl font-medium'>
          {activeItem ? activeItem.name : "Dashboard"}
        </h1>
      </div>

      <div className='flex flex-row items-center gap-2'>
        <ModeToggle />

        {/* profile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="nav" className="py-6">
              <ProfileTemp user={user} /> 
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent>
            <DropdownMenuItem asChild>
              <Link>
                Profile
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem asChild>
                <Link href={route('coordinator.logout')} method="post" as="button">
                  Logout
                </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}