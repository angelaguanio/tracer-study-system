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
import ProfileTemp from './profile-temp' 
import NotificationBell from './NotificationBell'
import { User, LogOut } from 'lucide-react'

export default function HeaderCoord({ navItemsCoord = [] }) {
  const { url, props } = usePage()
  const user = props.auth?.user 
  const activeItem = navItemsCoord.find((item) => url.startsWith(item.href))

  return (
    <header className='flex w-full justify-between py-3 px-2'>
      <div className='flex flex-row items-center'>
        <SidebarTrigger />
        <h1 className='lg:text-2xl text-lg font-medium'>
          {activeItem ? activeItem.name : "Dashboard"}
        </h1>
      </div>

      <div className='flex flex-row items-center gap-2'>
        <NotificationBell/>
        {/* profile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="py-6 hover:bg-transparent hover:ring-1 hover:ring-border">
              <ProfileTemp user={user} /> 
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent>

            <DropdownMenuItem asChild>
              <Link href={route('coordinator.profile')} className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Profile
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem asChild>
                <Link href={route('coordinator.logout')} className="flex items-center gap-2">
                  <LogOut className="h-4 w-4" />
                  Logout
                </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}