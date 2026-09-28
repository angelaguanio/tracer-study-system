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
  const { props } = usePage()
  const user = props.auth?.user

  // Normalize any href (relative or absolute) to just the pathname
  const getPath = (href) => {
    if (!href) return '';
    try { return new URL(href).pathname; }
    catch { return href.split('?')[0]; }
  };

  const currentPath = window.location.pathname;

  let activeTitle = "Dashboard"
  navItemsCoord.forEach((item) => {
    if (item.href && currentPath.startsWith(getPath(item.href))) {
      activeTitle = item.name
    }
    if (item.subItems) {
      item.subItems.forEach((sub) => {
        if (sub.href && currentPath.startsWith(getPath(sub.href))) {
          activeTitle = sub.name
        }
      })
    }
  })

  return (
    <header className='flex w-full justify-between py-3 px-2'>
      <div className='flex flex-row items-center'>
        <SidebarTrigger />
        <h1 className='lg:text-2xl text-lg font-medium'>
          {activeTitle}
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
                <Link href={route('coordinator.logout')} method="post" as="button" className="flex w-full items-center gap-2">
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